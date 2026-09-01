// Audit core meta tags across every prerendered page in the build output.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const base = join(ROOT, '.next/server/app');
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) files.push(p);
  }
})(base);

const one = (h, re) => (h.match(re) || []).length;

// Titles/descriptions are HTML-escaped in the build output, so "&" is stored as
// "&amp;" and inflates .length by 4. Search engines count the decoded character,
// so decode before measuring or every "&" title reads 4 chars too long.
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&#x2F;/g, '/');

const grab = (h, re) => { const m = h.match(re); return m ? decode(m[1].trim()) : ''; };

const rows = [];
for (const f of files) {
  const h = readFileSync(f, 'utf8');
  const route = '/' + relative(base, f).split(/[\\/]/).join('/').replace(/\.html$/, '').replace(/^index$/, '');
  rows.push({
    route: route === '/' ? '/' : route + '/',
    title: grab(h, /<title>([^<]*)<\/title>/),
    desc: grab(h, /<meta name="description" content="([^"]*)"/),
    canonical: grab(h, /<link rel="canonical" href="([^"]*)"/),
    charset: one(h, /<meta charSet="utf-8"|<meta charset="utf-8"/gi),
    viewport: one(h, /name="viewport"/g),
    robots: one(h, /<meta name="robots"/g),
    themeColor: one(h, /name="theme-color"/g),
    ogTitle: one(h, /property="og:title"/g),
    ogImage: one(h, /property="og:image"/g),
    ogImageWH: one(h, /property="og:image:(width|height)"/g),
    twCard: one(h, /name="twitter:card"/g),
    jsonld: one(h, /application\/ld\+json/g),
    h1: one(h, /<h1[\s>]/g),
    manifest: one(h, /rel="manifest"/g),
    appleIcon: one(h, /apple-touch-icon/g),
  });
}

const dupe = (k) => {
  const m = new Map();
  rows.forEach((r) => { if (r[k]) m.set(r[k], (m.get(r[k]) || 0) + 1); });
  return [...m.entries()].filter(([, c]) => c > 1);
};

const missing = (k) => rows.filter((r) => !r[k] || r[k] === 0).length;
const notOne = (k) => rows.filter((r) => r[k] !== 1).length;

console.log('Pages audited: ' + rows.length + '\n');
console.log('TAG PRESENCE (pages failing "exactly one"):');
for (const k of ['charset', 'viewport', 'robots', 'themeColor', 'ogTitle', 'twCard', 'manifest', 'appleIcon', 'h1']) {
  console.log(`  ${k.padEnd(12)} not-exactly-1 on ${String(notOne(k)).padStart(3)} / ${rows.length}`);
}
console.log(`  ogImage      pages with 0: ${missing('ogImage')}`);
console.log(`  ogImageWH    pages without w+h pair: ${rows.filter((r) => r.ogImageWH !== 2).length}`);
console.log(`  jsonld       pages with 0: ${missing('jsonld')}`);
console.log('\nCONTENT QUALITY:');
console.log('  missing title      : ' + missing('title'));
console.log('  missing description: ' + missing('desc'));
console.log('  missing canonical  : ' + missing('canonical'));
const dt = dupe('title'), dd = dupe('desc'), dc = dupe('canonical');
console.log('  DUPLICATE titles      : ' + dt.length + ' values');
dt.slice(0, 6).forEach(([v, c]) => console.log(`     ${c}x  ${v.slice(0, 78)}`));
console.log('  DUPLICATE descriptions: ' + dd.length + ' values');
dd.slice(0, 6).forEach(([v, c]) => console.log(`     ${c}x  ${v.slice(0, 78)}`));
console.log('  DUPLICATE canonicals  : ' + dc.length + ' values');
dc.slice(0, 4).forEach(([v, c]) => console.log(`     ${c}x  ${v}`));

const tl = rows.filter((r) => r.title).map((r) => r.title.length);
const dl = rows.filter((r) => r.desc).map((r) => r.desc.length);
const stat = (a) => `min ${Math.min(...a)} / max ${Math.max(...a)} / avg ${Math.round(a.reduce((x, y) => x + y, 0) / a.length)}`;
console.log('\nLENGTHS:');
console.log('  title       ' + stat(tl) + `  | outside 50-60: ${tl.filter((n) => n < 50 || n > 60).length}`);
console.log('  description ' + stat(dl) + `  | outside 140-160: ${dl.filter((n) => n < 140 || n > 160).length}`);

writeFileSync(join(ROOT, '..', 'seo-audit', 'meta-audit.json'), JSON.stringify(rows, null, 2));
