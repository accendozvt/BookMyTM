// Download the 15 generated headers, crop to 1200x630 (the OG size the other 40
// posts already use), and repoint the last WordPress-era featured images: five
// Freepik stock IDs, eight square 1024x1024 illustrations and two ChatGPT exports.
//
// Also writes featuredImageAlt. Until now every post header rendered with
// alt={post.h1}, which just repeats the heading a screen reader has already
// announced; these 15 get their own description of what the photo actually shows.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { POSTS } from './legacy-blog-image-plan.mjs';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
mkdirSync(join(PUB, 'images/blog'), { recursive: true });

const urls = JSON.parse(readFileSync('./legacy-blog-image-urls.json', 'utf8'));
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
const sources = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.next') walk(p); }
    else if (/\.(tsx?|mjs|json)$/.test(e.name)) sources.push(readFileSync(p, 'utf8'));
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
