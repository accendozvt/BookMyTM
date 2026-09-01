// Download the generated inner-page banners, crop to the 16:6 slot the template
// renders, save as WebP under an SEO filename, and emit the page->image map.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { PAGES } from './inner-image-plan.mjs';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const OUT_DIR = join(APP, 'public/images/services');
mkdirSync(OUT_DIR, { recursive: true });

const urls = JSON.parse(readFileSync('./inner-image-urls.json', 'utf8'));
const bySlug = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

// Template renders aspect-[16/6] at width={1200} height={450}
const W = 1200;
const H = 450;

let done = 0, skipped = 0, failed = [];
for (const [slug, url] of Object.entries(urls)) {
  const page = bySlug[slug];
  if (!page) { failed.push(`${slug}: not in plan`); continue; }
  const out = join(OUT_DIR, page.file + '.webp');
  if (existsSync(out) && !process.argv.includes('--force')) { skipped++; continue; }
  try {
    const res = await fetch(url);
    if (!res.ok) { failed.push(`${slug}: HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    // 21:9 source into a 16:6 slot -> centre crop top/bottom
    const webp = await sharp(buf).resize(W, H, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toBuffer();
    writeFileSync(out, webp);
    done++;
  } catch (e) {
    failed.push(`${slug}: ${e.message.slice(0, 60)}`);
  }
}

// page slug -> { src, alt } for lib/service-images.ts
const map = {};
for (const p of PAGES) {
  const f = join(OUT_DIR, p.file + '.webp');
  if (existsSync(f)) map['/' + p.slug.replace(/__/g, '/') + '/'] = { src: `/images/services/${p.file}.webp`, alt: p.alt };
}
writeFileSync(join(APP, 'data/service-images.json'), JSON.stringify(map, null, 2) + '\n');

console.log(`downloaded ${done}, skipped ${skipped} (already present), failed ${failed.length}`);
failed.slice(0, 8).forEach((f) => console.log('  ' + f));
console.log(`service-images.json now maps ${Object.keys(map).length} / ${PAGES.length} pages`);
