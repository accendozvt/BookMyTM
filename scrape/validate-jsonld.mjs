// Validate the JSON-LD @graph on every prerendered page: parses, has the required
// node types, resolves every internal @id reference, and carries required properties.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const BUILT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/.next/server/app';
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) files.push(p);
  }
})(BUILT);

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&#x27;|&#39;/g, "'");

const REQUIRED = {
  Organization: ['name', 'url', 'logo'],
  WebSite: ['name', 'url', 'publisher'],
  WebPage: ['name', 'url', 'isPartOf', 'inLanguage'],
  BreadcrumbList: ['itemListElement'],
  Service: ['name', 'provider', 'areaServed'],
  BlogPosting: ['headline', 'author', 'publisher', 'image'],
  FAQPage: ['mainEntity'],
};

// Google recommends but does not require these; absence is reported separately
// rather than as a validation failure.
const RECOMMENDED = { BlogPosting: ['datePublished', 'dateModified'] };

const problems = [];
const warnings = [];
const typeCount = {};
let pages = 0, blocks = 0;

for (const f of files) {
  const route = '/' + relative(BUILT, f).split(/[\\/]/).join('/').replace(/\.html$/, '').replace(/^index$/, '');
  const html = readFileSync(f, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => m[1]);
  if (route === '/_not-found') continue;
  pages++;
  if (scripts.length === 0) { problems.push(`${route}: no JSON-LD`); continue; }
  if (scripts.length > 1) problems.push(`${route}: ${scripts.length} JSON-LD blocks (expected 1 @graph)`);

  for (const raw of scripts) {
    blocks++;
    let doc;
    try { doc = JSON.parse(decode(raw)); }
    catch (e) { problems.push(`${route}: JSON parse error - ${e.message.slice(0, 60)}`); continue; }
    if (!doc['@context']) problems.push(`${route}: missing @context`);
    const nodes = doc['@graph'] || [doc];
    const ids = new Set(nodes.map((n) => n['@id']).filter(Boolean));

    for (const n of nodes) {
      const t = n['@type'];
      typeCount[t] = (typeCount[t] || 0) + 1;
      for (const req of REQUIRED[t] || []) {
        if (n[req] === undefined || n[req] === null || n[req] === '') {
          problems.push(`${route}: ${t} missing required "${req}"`);
        }
      }
      for (const rec of RECOMMENDED[t] || []) {
        if (n[rec] === undefined || n[rec] === null || n[rec] === '') warnings.push(`${t}.${rec}`);
      }
      // every internal {"@id": ...} reference must resolve within this graph
      JSON.stringify(n, (k, v) => {
        if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 1 && v['@id']) {
          if (!ids.has(v['@id'])) problems.push(`${route}: ${t}.${k} -> unresolved @id ${v['@id']}`);
        }
        return v;
      });
    }
    const types = nodes.map((n) => n['@type']);
    for (const must of ['Organization', 'WebSite', 'WebPage']) {
      if (!types.includes(must)) problems.push(`${route}: graph missing ${must}`);
    }
  }
}

console.log(`pages with JSON-LD: ${pages}, script blocks: ${blocks}`);
console.log('\nnode types across the site:');
Object.entries(typeCount).sort((a, b) => b[1] - a[1]).forEach(([t, n]) => console.log(`  ${String(n).padStart(4)}x  ${t}`));
if (warnings.length) {
  const w = {};
  warnings.forEach((x) => (w[x] = (w[x] || 0) + 1));
  console.log('\nrecommended-but-absent (not failures):');
  Object.entries(w).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}x  ${k}`));
}
console.log(problems.length ? `\nPROBLEMS (${problems.length}):\n  ` + [...new Set(problems)].slice(0, 25).join('\n  ') : '\nNo problems found.');
process.exit(problems.length ? 1 : 0);
