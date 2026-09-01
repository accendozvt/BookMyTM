// Regenerate the 400w/800w card variants for every post featured image and
// rebuild image-variants.json from what actually exists on disk.
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
const idx = JSON.parse(readFileSync(join(APP, 'data/posts-index.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(APP, 'data/image-manifest.json'), 'utf8'));
const localize = (s) => (s ? manifest[s] || manifest[s.split('/').pop()] || s : s);

const variants = {};
let made = 0;
for (const p of idx) {
  const rel = localize(p.featuredImage);
  const abs = join(PUB, rel.replace(/^\//, ''));
  if (!existsSync(abs)) { console.log('MISSING ' + rel); continue; }
  const meta = await sharp(readFileSync(abs)).metadata();
  const widths = [];
  for (const w of [400, 800]) {
    if (meta.width <= w) continue;
    const outRel = rel.replace(/\.webp$/, `-${w}w.webp`);
    const outAbs = join(PUB, outRel.replace(/^\//, ''));
    if (!existsSync(outAbs)) {
      const buf = await sharp(readFileSync(abs)).resize({ width: w }).webp({ quality: 80, effort: 5 }).toBuffer();
      writeFileSync(outAbs, buf);
      made++;
    }
    widths.push(w);
  }
  if (widths.length) variants[rel] = widths;
}
writeFileSync(join(APP, 'data/image-variants.json'), JSON.stringify(variants, null, 2) + '\n');
console.log(`generated ${made} new variants; image-variants.json now lists ${Object.keys(variants).length} images`);
