// Generates public/llms.txt and public/llms-full.txt from the site's own content.
//
// Runs as an npm `postbuild` step and reads titles/descriptions out of the built
// HTML rather than data/seo.json: 59 seo.json entries have an empty description
// and the real one is derived at render time by descriptionFor() in
// app/[...slug]/page.tsx. Reading the build output means llms.txt always states
// exactly what the pages actually serve, with no duplicated fallback logic.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_BASE = 'https://bookmytm.com';

// Mirrors lib/site.ts (source of truth) — kept here because this is a plain
// node script and cannot import the TypeScript module.
const SITE = {
  name: 'BookMyTM',
  tagline: 'Click. Start Business!',
  email: 'cc@bookmytm.com',
  phone1: '+91 809 809 0880',
  phone2: '+91 809 809 0440',
  address: 'Plot No 207, Behind Onam Park, Mavelipuram, Kakkanad, Kochi, Kerala 682030, India',
  facebook: 'https://www.facebook.com/bookmytm',
  instagram: 'https://www.instagram.com/bookmytm',
};

const EXCLUDED = new Set(['test', '__home', 'contact', 'knowledge-base', 'about-us']);
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));

const seo = read(join(APP, 'data/seo.json'));

/* Pull the shipped title/description straight out of the prerendered HTML. */
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&#039;/g, "'").replace(/&#x2F;/g, '/');

const BUILT = join(APP, '.next/server/app');
const built = {};
if (existsSync(BUILT)) {
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith('.html')) {
        const rel = relative(BUILT, p).split(/[\\/]/).join('/').replace(/\.html$/, '');
        const route = rel === 'index' ? '/' : '/' + rel + '/';
        const html = readFileSync(p, 'utf8');
        const t = html.match(/<title>([^<]*)<\/title>/);
        const d2 = html.match(/<meta name="description" content="([^"]*)"/);
        built[route] = {
          title: t ? decode(t[1]) : '',
          description: d2 ? decode(d2[1]) : '',
        };
      }
    }
  })(BUILT);
}

/** Shipped metadata for a route, falling back to seo.json if the build isn't present. */
const metaFor = (r) => {
  const b = built[r];
  const s = seo[r];
  return {
    title: (b?.title || s?.title || '').trim(),
    description: (b?.description || s?.description || '').trim(),
  };
};

const postSlugs = readdirSync(join(APP, 'content-posts')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
const contentSlugs = readdirSync(join(APP, 'content'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .filter((s) => !EXCLUDED.has(s));

const routes = [
  '/', '/about-us/', '/contact/', '/knowledge-base/',
  ...contentSlugs.map((s) => '/' + s.replace(/__/g, '/') + '/'),
  ...postSlugs.map((s) => `/${s}/`),
].filter((v, i, a) => a.indexOf(v) === i).sort();

const cleanTitle = (t) => t.replace(/\s*[|\-–]\s*BookMyTM.*$/i, '').trim();

/** Flatten a content JSON's blocks to plain text. */
function plainText(j) {
  const out = [];
  for (const b of j.blocks || []) {
    if (b.type === 'heading') out.push('\n' + '#'.repeat(Math.min(b.level + 1, 6)) + ' ' + b.text);
    else if (b.type === 'paragraph') out.push(b.text);
    else if (b.type === 'list') out.push((b.items || []).map((i) => '- ' + i).join('\n'));
    else if (b.type === 'faq') out.push((b.items || []).map((i) => `Q: ${i.q}\nA: ${i.a}`).join('\n\n'));
  }
  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function fileForRoute(route) {
  const slug = route.replace(/^\/|\/$/g, '');
  const post = join(APP, 'content-posts', slug + '.json');
  if (existsSync(post)) return post;
  const content = join(APP, 'content', slug.replace(/\//g, '__') + '.json');
  return existsSync(content) ? content : null;
}

/* ---------------------------------------------------------------- llms.txt */
const L = [];
L.push(`# ${SITE.name}`);
L.push('');
L.push(`> ${SITE.name} is an Indian legal-services platform for trademark registration, ISO certification, company and startup registration, intellectual property and statutory compliance.`);
L.push('');
L.push(
  `${SITE.name} ("${SITE.tagline}") helps founders and businesses across India protect their brands and stay compliant, with a 100% digital process. ` +
    `Services span trademark search, filing and enforcement with IP India; patent and design registration; ISO certification; company, LLP and firm incorporation; ` +
    `and ongoing GST, PF, ESI and ROC compliance. The team operates from Kochi, Kerala with support for clients nationwide, and has filed over 10,000 trademarks for more than 15,000 users across 8+ years. ` +
    `Guides are published in English and Malayalam.`,
);
L.push('');
L.push('## Pages');
for (const r of routes) {
  const m = metaFor(r);
  if (!m.title) continue;
  L.push(`- [${cleanTitle(m.title)}](${URL_BASE}${r}): ${m.description.replace(/\s+/g, ' ')}`);
}
L.push('');
L.push('## Services');
for (const [route, label] of [
  ['/intellectual-property/trademark/', 'Trademark'],
  ['/intellectual-property/patent/', 'Patent'],
  ['/intellectual-property/other-ip-registrations/', 'Copyright & Design'],
  ['/iso-certification/', 'ISO Certification'],
  ['/startup/registrations/', 'Company & Firm Registration'],
  ['/startup/other-registrations/', 'Startup Registrations'],
  ['/startup/special-business-entities/', 'Special Entities'],
  ['/statutory-compliance/basic-compliances/', 'Tax & Labour Compliance'],
  ['/statutory-compliance/roc-filing/', 'ROC Filing'],
  ['/other-services/change-entity-type/', 'Entity Conversion'],
  ['/other-services/change-in-master-data/', 'Company Master Data Changes'],
  ['/other-services/winding-up-an-entity/', 'Winding Up'],
]) {
  const m = metaFor(route);
  if (m.description) L.push(`- ${label} (${URL_BASE}${route}): ${m.description.replace(/\s+/g, ' ')}`);
}
L.push('');
L.push('## Contact');
L.push(`- Website: ${URL_BASE}`);
L.push(`- Email: ${SITE.email}`);
L.push(`- Phone / WhatsApp: ${SITE.phone1}, ${SITE.phone2}`);
L.push(`- Address: ${SITE.address}`);
L.push(`- Facebook: ${SITE.facebook}`);
L.push(`- Instagram: ${SITE.instagram}`);
L.push('');

writeFileSync(join(APP, 'public/llms.txt'), L.join('\n'));

/* ----------------------------------------------------------- llms-full.txt */
const F = [`# ${SITE.name} — full site content`, '', `> Plain-text content of every public page on ${URL_BASE}.`, ''];
let withText = 0;
for (const r of routes) {
  const m = metaFor(r);
  const f = fileForRoute(r);
  if (!m.title) continue;
  F.push(`\n---\n`);
  F.push(`## ${cleanTitle(m.title)}`);
  F.push(`URL: ${URL_BASE}${r}`);
  F.push('');
  if (f) {
    const body = plainText(read(f));
    if (body) { F.push(body); withText++; } else F.push(m.description);
  } else {
    F.push(m.description);
  }
}
writeFileSync(join(APP, 'public/llms-full.txt'), F.join('\n') + '\n');

const kb = (p) => (readFileSync(join(APP, p), 'utf8').length / 1024).toFixed(0);
console.log(`llms.txt: ${routes.length} pages listed (${kb('public/llms.txt')} KB)`);
console.log(`llms-full.txt: ${withText} pages with body text (${kb('public/llms-full.txt')} KB)`);
