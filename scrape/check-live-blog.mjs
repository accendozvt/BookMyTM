import { readFileSync } from 'fs';
const ORIGIN = 'https://bookmytm.com';
const POSTS = (await import('./legacy-blog-image-plan.mjs')).POSTS;

const head = async (u) => { try { const r = await fetch(u, { method: 'HEAD' }); return r.status; } catch (e) { return 'ERR'; } };

// identity guard: never report on a site that is not BookMyTM
const home = await fetch(ORIGIN + '/').then((r) => r.text());
if (!/BookMyTM/.test(home)) { console.error('ABORT: not serving BookMyTM'); process.exit(1); }
console.log('origin confirmed serving BookMyTM\n');

console.log('--- the 15 new header images ---');
let ok = 0;
for (const p of POSTS) {
  const s = await head(`${ORIGIN}/images/blog/${p.file}.webp`);
  if (s === 200) ok++; else console.log(`  ${s}  ${p.file}.webp`);
}
console.log(`images 200: ${ok}/${POSTS.length}`);

console.log('\n--- responsive variants ---');
let v = 0;
for (const p of POSTS) for (const w of [400, 800]) {
  if ((await head(`${ORIGIN}/images/blog/${p.file}-${w}w.webp`)) === 200) v++;
}
console.log(`variants 200: ${v}/${POSTS.length * 2}`);

console.log('\n--- pages render the new image + alt ---');
let pages = 0;
for (const p of POSTS) {
  const html = await fetch(`${ORIGIN}/${p.slug}/`).then((r) => r.text()).catch(() => '');
  const hasImg = html.includes(`/images/blog/${p.file}.webp`);
  const hasAlt = html.includes(p.alt);
  if (hasImg && hasAlt) pages++;
  else console.log(`  ${p.slug}\n     img:${hasImg} alt:${hasAlt}`);
}
console.log(`pages correct: ${pages}/${POSTS.length}`);

console.log('\n--- retired files should now 404 ---');
for (const f of ['1388', '48375', '104127', '11960', '12283', 'blog_07_trademark_classes', 'blog_08_amazon_registry']) {
  console.log(`  ${await head(`${ORIGIN}/images/blog/${f}.webp`)}  ${f}.webp`);
}

console.log('\n--- megamenu promo images (all 141 pages) ---');
for (const f of ['hdr-iso-9001-2025-upgrade-msme', 'hdr-trademark-vs-copyright-vs-patent-india']) {
  console.log(`  ${await head(`${ORIGIN}/images/blog/${f}.webp`)}  ${f}.webp`);
}

console.log('\n--- key endpoints ---');
for (const u of ['/', '/knowledge-base/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt', '/images/logo.webp']) {
  console.log(`  ${await head(ORIGIN + u)}  ${u}`);
}
