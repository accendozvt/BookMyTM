// Force the edge cache to re-fetch every page from the origin.
//
// Hostinger's cache (x-qc-cache) sets s-maxage=31536000 on HTML and its panel
// purge does not reliably clear it, so pages cached before a deploy keep serving
// the previous build - to visitors, not just to us. A request carrying
// Cache-Control: no-cache revalidates against the origin AND repopulates the
// entry, so one pass over the sitemap rebuilds the whole cache on the new build.
//
// Run after every deploy until the TTL is lowered at the CDN.
const ORIGIN = 'https://bookmytm.com';

const xml = await fetch(ORIGIN + '/sitemap.xml', { headers: { 'Cache-Control': 'no-cache' } }).then((r) => r.text());
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`sitemap lists ${urls.length} URLs\n`);

let warmed = 0, failed = 0;
const CONCURRENCY = 6;
const queue = [...urls];

async function worker() {
  for (;;) {
    const u = queue.shift();
    if (!u) return;
    try {
      const r = await fetch(u, { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } });
      if (r.ok) { await r.text(); warmed++; } else { failed++; console.log(`  ${r.status} ${u}`); }
    } catch (e) {
      failed++;
      console.log(`  ERR ${u}: ${e.message.slice(0, 50)}`);
    }
    if ((warmed + failed) % 25 === 0) console.log(`  ${warmed + failed}/${urls.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\nrevalidated ${warmed}, failed ${failed}`);
