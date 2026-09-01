// Validate sitemap.xml: XML shape, canonical-host URLs, no robots-disallowed paths,
// every URL returns 200 with no redirect hop, and canonical matches the sitemap URL.
const ORIGIN = 'http://localhost:' + (process.env.BMTM_PORT || '3187');
const PROD = 'https://bookmytm.com';

const xml = await fetch(ORIGIN + '/sitemap.xml').then((r) => r.text());
const robots = await fetch(ORIGIN + '/robots.txt').then((r) => r.text());

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const problems = [];

if (!xml.startsWith('<?xml')) problems.push('sitemap does not start with an XML declaration');
if (!xml.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) problems.push('missing sitemaps.org namespace');

// robots disallow rules that apply to "*"
const starBlock = robots.split(/\n(?=User-Agent:)/i).find((b) => /User-Agent:\s*\*/i.test(b)) || '';
const disallows = [...starBlock.matchAll(/^Disallow:\s*(\S+)$/gim)].map((m) => m[1]);
const allows = [...starBlock.matchAll(/^Allow:\s*(\S+)$/gim)].map((m) => m[1]);

for (const loc of locs) {
  if (!loc.startsWith(PROD + '/')) problems.push(`not on canonical host: ${loc}`);
  if (loc.includes('?')) problems.push(`query string in sitemap: ${loc}`);
  const path = loc.slice(PROD.length);
  // longest matching rule wins (Google's precedence)
  const d = disallows.filter((r) => path.startsWith(r.replace(/\*$/, ''))).sort((a, b) => b.length - a.length)[0];
  const a = allows.filter((r) => path.startsWith(r.replace(/\*$/, ''))).sort((x, y) => y.length - x.length)[0];
  if (d && (!a || a.length < d.length)) problems.push(`sitemap URL is robots-disallowed by "${d}": ${loc}`);
}

console.log(`sitemap URLs: ${locs.length}`);
console.log(`duplicates  : ${locs.length - new Set(locs).size}`);

let ok = 0, redirects = 0, errors = 0, canonMismatch = 0;
for (const loc of locs) {
  const path = loc.slice(PROD.length);
  const res = await fetch(ORIGIN + path, { redirect: 'manual' });
  if (res.status === 200) {
    ok++;
    const html = await res.text();
    const m = html.match(/<link rel="canonical" href="([^"]+)"/);
    if (!m) problems.push(`no canonical: ${loc}`);
    else if (m[1] !== loc) { canonMismatch++; problems.push(`canonical mismatch: ${loc} -> ${m[1]}`); }
  } else if (res.status >= 300 && res.status < 400) {
    redirects++;
    problems.push(`redirect ${res.status}: ${path} -> ${res.headers.get('location')}`);
  } else {
    errors++;
    problems.push(`HTTP ${res.status}: ${path}`);
  }
}

console.log(`200 OK      : ${ok}`);
console.log(`redirects   : ${redirects}`);
console.log(`errors      : ${errors}`);
console.log(`canonical mismatches: ${canonMismatch}`);
console.log(problems.length ? `\nPROBLEMS (${problems.length}):\n  ` + problems.slice(0, 20).join('\n  ') : '\nNo problems found.');
process.exit(problems.length ? 1 : 0);
