// Verify every image referenced by posts/content resolves to a real file in public/.
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const manifest = JSON.parse(readFileSync(join(ROOT, 'data/image-manifest.json'), 'utf8'));

// mirror of lib/content.ts localizeSrc()
function localize(src) {
  if (!src) return src;
  if (manifest[src]) return manifest[src];
  const file = src.split('/').pop();
  if (file && manifest[file]) return manifest[file];
  return src;
}

const rows = [];
function check(where, src) {
  if (!src) return;
  const out = localize(src);
  const isRemote = /^https?:\/\//.test(out);
  const exists = !isRemote && existsSync(join(ROOT, 'public', out.replace(/^\//, '')));
  rows.push({ where, src, out, isRemote, exists });
}

const idx = JSON.parse(readFileSync(join(ROOT, 'data/posts-index.json'), 'utf8'));
idx.forEach((p) => check('posts-index:' + p.slug, p.featuredImage));

for (const dir of ['content-posts', 'content']) {
  for (const f of readdirSync(join(ROOT, dir))) {
    const j = JSON.parse(readFileSync(join(ROOT, dir, f), 'utf8'));
    if (j.featuredImage) check(dir + ':' + f + ':featured', j.featuredImage);
    (j.blocks || []).forEach((b, i) => {
      if (b.type === 'image' || b.type === 'imageBox') check(dir + ':' + f + ':block' + i, b.src);
    });
  }
}

const broken = rows.filter((r) => r.isRemote || !r.exists);
console.log('image references checked : ' + rows.length);
console.log('resolve to a local file  : ' + rows.filter((r) => r.exists).length);
console.log('STILL REMOTE (will 404)  : ' + rows.filter((r) => r.isRemote).length);
console.log('local path but MISSING   : ' + rows.filter((r) => !r.isRemote && !r.exists).length);
if (broken.length) {
  console.log('\n--- broken (first 15) ---');
  broken.slice(0, 15).forEach((r) => console.log(`  ${r.isRemote ? 'REMOTE ' : 'MISSING'}  ${r.where}\n            ${r.out.slice(0, 100)}`));
}
