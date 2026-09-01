// Stamp the real pixel dimensions of each post's featured image into
// posts-index.json and content-posts/*.json, so og:image:width/height stop lying.
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/image-manifest.json'), 'utf8'));
const localize = (s) => (s ? manifest[s] || manifest[s.split('/').pop()] || s : s);

const idxPath = join(ROOT, 'data/posts-index.json');
const idx = JSON.parse(readFileSync(idxPath, 'utf8'));

let annotated = 0, skipped = 0;
for (const p of idx) {
  const rel = localize(p.featuredImage);
  if (/^https?:\/\//.test(rel)) { skipped++; continue; }
  const file = join(ROOT, 'public', rel.replace(/^\//, ''));
  if (!existsSync(file)) { skipped++; continue; }
  const m = await sharp(file).metadata();
  p.featuredImageWidth = m.width;
  p.featuredImageHeight = m.height;

  const cpPath = join(ROOT, 'content-posts', p.slug + '.json');
  if (existsSync(cpPath)) {
    const cp = JSON.parse(readFileSync(cpPath, 'utf8'));
    cp.featuredImageWidth = m.width;
    cp.featuredImageHeight = m.height;
    writeFileSync(cpPath, JSON.stringify(cp, null, 2) + '\n');
  }
  annotated++;
}

writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
console.log(`annotated ${annotated} posts with real image dimensions (skipped ${skipped})`);
const ratios = {};
idx.forEach((p) => {
  if (!p.featuredImageWidth) return;
  const r = (p.featuredImageWidth / p.featuredImageHeight).toFixed(2);
  ratios[r] = (ratios[r] || 0) + 1;
});
console.log('aspect ratios:', JSON.stringify(ratios));
