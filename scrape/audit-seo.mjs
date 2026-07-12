// Audit exported HTML for the full SEO checklist.
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';

const OUT = join(import.meta.dirname, '..', 'bookmytm-next', 'out');

function* walk(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) yield* walk(p);
    else if (f.name === 'index.html') yield p;
  }
}

const checks = {
  title: (h) => /<title[^>]*>[^<]+<\/title>/.test(h),
  metaDesc: (h) => /<meta name="description" content="[^"]+"/.test(h),
  canonical: (h) => /<link rel="canonical" href="https:\/\/bookmytm\.com[^"]*"/.test(h),
  charset: (h) => /<meta charset/i.test(h),
  viewport: (h) => /<meta name="viewport"/.test(h),
  ogTitle: (h) => /<meta property="og:title"/.test(h),
  ogDesc: (h) => /<meta property="og:description"/.test(h),
  ogImage: (h) => /<meta property="og:image"/.test(h),
  ogUrl: (h) => /<meta property="og:url"/.test(h),
  twitterCard: (h) => /<meta name="twitter:card" content="summary_large_image"/.test(h),
  twitterImage: (h) => /<meta name="twitter:image"/.test(h),
  jsonLd: (h) => /application\/ld\+json/.test(h),
};

let total = 0;
const failures = {};
for (const p of walk(OUT)) {
  const rel = '/' + relative(OUT, p).split(sep).slice(0, -1).join('/');
  const html = readFileSync(p, 'utf8');
  total++;
  for (const [name, fn] of Object.entries(checks)) {
    if (!fn(html)) (failures[name] ||= []).push(rel || '/');
  }
}

console.log('pages audited:', total);
let allPass = true;
for (const name of Object.keys(checks)) {
  const f = failures[name] || [];
  console.log(`${f.length === 0 ? 'PASS' : 'FAIL'} ${name}${f.length ? ` (${f.length}): ${f.slice(0, 6).join(', ')}` : ''}`);
  if (f.length) allPass = false;
}

// files
for (const f of ['sitemap.xml', 'robots.txt', 'llms.txt', 'assets/opengraph/preview.webp']) {
  console.log(existsSync(join(OUT, f)) ? 'PASS' : 'FAIL', f);
}
const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
console.log('sitemap URLs:', (sitemap.match(/<loc>/g) || []).length);
const robots = readFileSync(join(OUT, 'robots.txt'), 'utf8');
console.log('robots has sitemap pointer:', robots.includes('Sitemap: https://bookmytm.com/sitemap.xml') ? 'PASS' : 'FAIL');
