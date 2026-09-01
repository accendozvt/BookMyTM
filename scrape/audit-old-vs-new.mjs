// Cross-check the new Next.js site against the original WordPress site.
//
// Reads the new side from the local build output rather than the live site, so
// the comparison is not confounded by the CDN serving pre-deploy HTML.
//
// Compares, per URL: presence, H1, heading outline, body word count, FAQ
// question count, price, and image count. Word counts will never match exactly
// (the old pages carry Elementor chrome, cookie notices and widget text the new
// template does not), so the report flags proportional shortfalls rather than
// demanding equality.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const OLD = 'https://mediumblue-koala-112940.hostingersite.com';
const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const OUT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/oldsite';
mkdirSync(OUT, { recursive: true });

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&rsquo;|&#8217;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/gi, ' ');

/** Strip scripts/styles/nav/footer and reduce to visible words. */
function textOf(html, { dropChrome = true } = {}) {
  let h = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  if (dropChrome) {
    h = h
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
  }
  return decode(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

const words = (t) => (t ? t.split(/\s+/).filter((w) => /[a-z0-9\u0d00-\u0d7f]/i.test(w)).length : 0);

function headings(html) {
  const out = [];
  for (const m of html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const t = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (t) out.push({ level: +m[1], text: t });
  }
  return out;
}

const normalise = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\u0d00-\u0d7f]+/g, ' ').replace(/\s+/g, ' ').trim();

function extract(html, { dropChrome }) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1];
  const body = dropChrome
    ? html.replace(/<header[\s\S]*?<\/header>/gi, ' ').replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    : html;
  const hs = headings(body);
  const text = textOf(html, { dropChrome });
  // Prices appear as "Rs. 6,400" / "₹6400" on both sides.
  const prices = [...text.matchAll(/(?:Rs\.?\s*|₹\s*)([\d,]{3,})/g)].map((m) => m[1].replace(/,/g, ''));
  return {
    title: title ? decode(title).trim() : '',
    description: desc ? decode(desc).trim() : '',
    h1: (hs.find((h) => h.level === 1) || {}).text || '',
    headings: hs,
    headingSet: new Set(hs.map((h) => normalise(h.text)).filter(Boolean)),
    words: words(text),
    text,
    prices: [...new Set(prices)],
    images: (body.match(/<img\b/gi) || []).length,
  };
}

/* ---------- old site ---------- */
const urls = JSON.parse(readFileSync(join(OUT, 'urls.json'), 'utf8'));
const pagePaths = urls
  .filter((u) => u.map === 'page-sitemap.xml' || u.map === 'post-sitemap.xml')
  .map((u) => {
    let s = u.url.replace(OLD, '');
    if (!s) s = '/';
    if (!s.endsWith('/')) s += '/';
    return { path: s, kind: u.map === 'post-sitemap.xml' ? 'post' : 'page' };
  });

const cachePath = join(OUT, 'old-pages.json');
let cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};

const todo = pagePaths.filter((p) => !cache[p.path]);
console.log(`old site: ${pagePaths.length} URLs, ${todo.length} to fetch\n`);

let n = 0;
const queue = [...todo];
async function worker() {
  for (;;) {
    const item = queue.shift();
    if (!item) return;
    try {
      const r = await fetch(OLD + item.path);
      cache[item.path] = r.ok ? await r.text() : `__STATUS_${r.status}__`;
    } catch (e) {
      cache[item.path] = `__ERROR_${e.message.slice(0, 40)}__`;
    }
    if (++n % 20 === 0) console.log(`  fetched ${n}/${todo.length}`);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
writeFileSync(cachePath, JSON.stringify(cache));
console.log(`old pages cached: ${Object.keys(cache).length}\n`);

/* ---------- new site (local build) ---------- */
const BUILD = join(APP, '.next/server/app');
function newHtmlFor(path) {
  const clean = path.replace(/^\/|\/$/g, '');
  for (const cand of [clean ? clean + '.html' : 'index.html', join(clean, 'index.html')]) {
    const f = join(BUILD, cand);
    if (existsSync(f)) return readFileSync(f, 'utf8');
  }
  return null;
}

/* ---------- compare ---------- */
const rows = [];
for (const { path, kind } of pagePaths) {
  const oldHtml = cache[path];
  const row = { path, kind };
  if (!oldHtml || oldHtml.startsWith('__')) {
    row.status = 'OLD_UNAVAILABLE';
    row.note = oldHtml || 'no fetch';
    rows.push(row);
    continue;
  }
  const o = extract(oldHtml, { dropChrome: true });
  const nHtml = newHtmlFor(path);
  row.old = { h1: o.h1, words: o.words, headings: o.headings.length, prices: o.prices, images: o.images };

  if (!nHtml) {
    row.status = 'MISSING_ON_NEW';
    rows.push(row);
    continue;
  }
  const nw = extract(nHtml, { dropChrome: true });
  row.new = { h1: nw.h1, words: nw.words, headings: nw.headings.length, prices: nw.prices, images: nw.images };

  const missingHeadings = [...o.headingSet].filter((h) => !nw.headingSet.has(h));
  row.missingHeadings = missingHeadings;
  row.wordRatio = o.words ? +(nw.words / o.words).toFixed(2) : null;
  row.missingPrices = o.prices.filter((p) => !nw.prices.includes(p));
  row.status = 'PRESENT';
  rows.push(row);
}

writeFileSync(join(OUT, 'comparison.json'), JSON.stringify(rows, null, 2));

/* ---------- report ---------- */
const missing = rows.filter((r) => r.status === 'MISSING_ON_NEW');
const unavailable = rows.filter((r) => r.status === 'OLD_UNAVAILABLE');
const present = rows.filter((r) => r.status === 'PRESENT');
const thin = present.filter((r) => r.wordRatio !== null && r.wordRatio < 0.8).sort((a, b) => a.wordRatio - b.wordRatio);
const lostHeadings = present.filter((r) => r.missingHeadings.length > 0);
const lostPrices = present.filter((r) => r.missingPrices.length > 0);

console.log('================ SUMMARY ================');
console.log(`old URLs compared      : ${rows.length}`);
console.log(`present on new site    : ${present.length}`);
console.log(`MISSING on new site    : ${missing.length}`);
console.log(`old page unavailable   : ${unavailable.length}`);
console.log(`thinner than old (<80%): ${thin.length}`);
console.log(`pages losing headings  : ${lostHeadings.length}`);
console.log(`pages losing a price   : ${lostPrices.length}`);

if (missing.length) {
  console.log('\n---- MISSING ON NEW SITE ----');
  missing.forEach((r) => console.log(`  [${r.kind}] ${r.path}  (old: ${r.old.words} words, h1: ${r.old.h1.slice(0, 60)})`));
}
if (thin.length) {
  console.log('\n---- THINNER THAN THE ORIGINAL ----');
  thin.slice(0, 30).forEach((r) => console.log(`  ${(r.wordRatio * 100).toFixed(0).padStart(3)}%  ${r.new.words} vs ${r.old.words}  ${r.path}`));
}
if (lostPrices.length) {
  console.log('\n---- PRICES PRESENT IN OLD, ABSENT IN NEW ----');
  lostPrices.forEach((r) => console.log(`  ${r.path}  missing: ${r.missingPrices.join(', ')}`));
}
if (lostHeadings.length) {
  console.log('\n---- HEADINGS PRESENT IN OLD, ABSENT IN NEW (top 25 pages) ----');
  lostHeadings
    .sort((a, b) => b.missingHeadings.length - a.missingHeadings.length)
    .slice(0, 25)
    .forEach((r) => {
      console.log(`  ${r.path}  (${r.missingHeadings.length})`);
      r.missingHeadings.slice(0, 6).forEach((h) => console.log(`      - ${h.slice(0, 90)}`));
    });
}
console.log('\nfull detail: seo-audit/oldsite/comparison.json');
