// Replace the SVG title cards on the 20 newest posts with photographs.
//
// Those cards set the headline in white on a dark green gradient. Next to the 35
// photographic headers they read as unfinished, and they bake the headline into
// the image - text no screen reader can reach and no translation can touch.
//
// Same treatment as the other headers: a scene written from the post's own
// subject, an SEO filename, its own alt text, cropped to 1200x630.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { POSTS } from './new-blog-photo-plan.mjs';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
mkdirSync(join(PUB, 'images/blog'), { recursive: true });

const urls = JSON.parse(readFileSync('./new-blog-photo-urls.json', 'utf8'));
const idxPath = join(APP, 'data/posts-index.json');
const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
const bySlug = Object.fromEntries(idx.map((p) => [p.slug, p]));

// Rendered in an aspect-video slot; 1200x630 keeps og:image at the standard size
// and matches the 40 posts that already carry generated headers.
const W = 1200;
const H = 630;

const superseded = new Set();
const failed = [];
let done = 0;

for (const p of POSTS) {
  const url = urls[p.slug];
  const entry = bySlug[p.slug];
  if (!url) { failed.push(`${p.slug}: no generated url`); continue; }
  if (!entry) { failed.push(`${p.slug}: not in posts-index`); continue; }

  try {
    const res = await fetch(url);
    if (!res.ok) { failed.push(`${p.slug}: HTTP ${res.status}`); continue; }
    const rel = `/images/blog/${p.file}.webp`;
    // Read/write through buffers — see optimize-images.mjs on the Windows
    // 260-char path limit tripping sharp's native file IO.
    const webp = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(W, H, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer();
    writeFileSync(join(PUB, rel.replace(/^\//, '')), webp);

    const cp = join(APP, 'content-posts', p.slug + '.json');
    const j = JSON.parse(readFileSync(cp, 'utf8'));
    if (j.featuredImage) superseded.add(j.featuredImage);
    j.featuredImage = rel;
    j.featuredImageAlt = p.alt;
    j.featuredImageWidth = W;
    j.featuredImageHeight = H;
    writeFileSync(cp, JSON.stringify(j, null, 2) + '\n');

    if (entry.featuredImage) superseded.add(entry.featuredImage);
    entry.featuredImage = rel;
    entry.featuredImageAlt = p.alt;
    entry.featuredImageWidth = W;
    entry.featuredImageHeight = H;
    done++;
  } catch (e) {
    failed.push(`${p.slug}: ${e.message.slice(0, 70)}`);
  }
}

writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
console.log(`applied ${done}/${POSTS.length} new blog headers (${W}x${H} webp)`);
failed.forEach((f) => console.log('  FAIL ' + f));
if (done !== POSTS.length) { console.log('\nnot cleaning up — some posts failed'); process.exit(1); }

/* ---------- retire the replaced files ---------- */
const manPath = join(APP, 'data/image-manifest.json');
const varPath = join(APP, 'data/image-variants.json');
const manifest = JSON.parse(readFileSync(manPath, 'utf8'));
const variants = JSON.parse(readFileSync(varPath, 'utf8'));
const localize = (s) => (s ? manifest[s] || manifest[s.split('/').pop()] || s : s);

// What still mentions each file, now that the 15 posts are repointed. Source
// files are in here as well as content: the first run scanned only content/ and
// content-posts/ and deleted two images that lib/site.ts uses for the megamenu
// promo panels, breaking them on all 141 pages.
// image-variants.json and image-manifest.json are derived indexes rebuilt from
// whatever is on disk, not references - counting them would make every file look
// used and nothing would ever be retired.
const DERIVED = new Set(['image-variants.json', 'image-manifest.json']);
const sources = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next') walk(p); }
    else if (/\.(tsx?|mjs|json)$/.test(e.name) && !DERIVED.has(e.name)) sources.push(readFileSync(p, 'utf8'));
  }
})(APP, 0);
const stillUsed = sources.join('\n');

let removed = 0;
for (const src of superseded) {
  const rel = localize(src);
  if (!rel.startsWith('/images/')) continue;
  const base = rel.split('/').pop();
  if (stillUsed.includes(base)) { console.log(`  kept (still referenced): ${base}`); continue; }

  for (const suffix of ['', '-400w', '-800w']) {
    const v = rel.replace(/\.webp$/, suffix + '.webp');
    const abs = join(PUB, v.replace(/^\//, ''));
    if (existsSync(abs)) { unlinkSync(abs); removed++; }
  }
  delete variants[rel];
  for (const [k, v] of Object.entries(manifest)) if (v === rel) delete manifest[k];
  console.log(`  removed superseded: ${base}`);
}

writeFileSync(manPath, JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(varPath, JSON.stringify(variants, null, 2) + '\n');
console.log(`\nremoved ${removed} superseded files, pruned their manifest/variant entries`);
