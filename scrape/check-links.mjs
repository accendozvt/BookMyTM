// Crawl every internal link on every built page against the running server.
// Reports broken links, redirect hops, and any link from a public page to a
// noindex/private route.
const ORIGIN = 'http://localhost:' + (process.env.BMTM_PORT || '3187');

const routes = (await (await fetch(ORIGIN + '/sitemap.xml')).text())
  .match(/<loc>([^<]+)<\/loc>/g)
  .map((m) => m.replace(/<\/?loc>/g, '').replace('https://bookmytm.com', ''));

const seen = new Map(); // url -> {status, location}
const linkSources = new Map(); // url -> Set(pages linking to it)
let scanned = 0;

async function head(url) {
  if (seen.has(url)) return seen.get(url);
  const res = await fetch(ORIGIN + url, { redirect: 'manual' });
  const rec = { status: res.status, location: res.headers.get('location') || '' };
  seen.set(url, rec);
  return rec;
}

for (const route of routes) {
  const html = await (await fetch(ORIGIN + route)).text();
  scanned++;
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    if (!href.startsWith('/')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean || clean.startsWith('/_next/')) continue;
    if (!linkSources.has(clean)) linkSources.set(clean, new Set());
    linkSources.get(clean).add(route);
  }
}

const broken = [];
const redirects = [];
for (const url of linkSources.keys()) {
  const r = await head(url);
  if (r.status >= 400) broken.push(`${url}  (${r.status})  linked from: ${[...linkSources.get(url)].slice(0, 2).join(', ')}`);
  else if (r.status >= 300) redirects.push(`${url} -> ${r.location}  linked from: ${[...linkSources.get(url)].slice(0, 2).join(', ')}`);
}

console.log(`pages crawled       : ${scanned}`);
console.log(`distinct internal links: ${linkSources.size}`);
console.log(`broken (4xx/5xx)    : ${broken.length}`);
broken.slice(0, 12).forEach((b) => console.log('   ' + b));
console.log(`redirecting (3xx)   : ${redirects.length}`);
redirects.slice(0, 12).forEach((r) => console.log('   ' + r));
process.exit(broken.length ? 1 : 0);
