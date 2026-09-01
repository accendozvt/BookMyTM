// Phase 6 image work, done at authoring time and committed, so nothing new has to
// build or run on the Hostinger server (no sharp dependency, no per-request
// optimisation). Two jobs:
//   1. convert every referenced JPEG/PNG to WebP and repoint references
//   2. emit 400w/800w variants of the post featured images, which are served at
//      ~380px in card grids but were shipping the full 1200px file
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname } from 'path';
import sharp from 'sharp';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
const DRY = !process.argv.includes('--write');

/* ---------- 1. collect every image path referenced anywhere ---------- */
const referenced = new Set();
const addFrom = (text) => {
  for (const m of text.matchAll(/\/images\/[\w\-./]+\.(?:jpe?g|png|webp)/gi)) referenced.add(m[0]);
  for (const m of text.matchAll(/\/assets\/[\w\-./]+\.(?:jpe?g|png|webp)/gi)) referenced.add(m[0]);
};
for (const dir of ['content', 'content-posts', 'data']) {
  for (const f of readdirSync(join(APP, dir))) addFrom(readFileSync(join(APP, dir, f), 'utf8'));
}
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mjs)$/.test(e)) addFrom(readFileSync(p, 'utf8'));
  }
})(join(APP, 'app'));
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|mjs)$/.test(e)) addFrom(readFileSync(p, 'utf8'));
  }
})(join(APP, 'components'));
addFrom(readFileSync(join(APP, 'lib/site.ts'), 'utf8'));

/* ---------- 2. convert non-WebP rasters ---------- */
const toConvert = [...referenced].filter((r) => /\.(jpe?g|png)$/i.test(r) && existsSync(join(PUB, r.replace(/^\//, ''))));
const renames = {}; // old path -> new path
let saved = 0;

for (const rel of toConvert) {
  const abs = join(PUB, rel.replace(/^\//, ''));
  const outRel = rel.replace(/\.(jpe?g|png)$/i, '.webp');
  const outAbs = join(PUB, outRel.replace(/^\//, ''));
  const before = statSync(abs).size;
  if (!DRY) {
    // Read/write through buffers: several stock-photo filenames push the absolute
    // path past the Windows 260-char limit, which sharp's native file IO rejects.
    const buf = await sharp(readFileSync(abs)).webp({ quality: 82, effort: 5 }).toBuffer();
    writeFileSync(outAbs, buf);
  }
  const after = DRY ? before : statSync(outAbs).size;
  saved += before - after;
  renames[rel] = outRel;
}

console.log(`convert to webp : ${toConvert.length} files, saving ${(saved / 1024).toFixed(0)} KB`);

/* ---------- 3. responsive variants for post featured images ---------- */
const idx = JSON.parse(readFileSync(join(APP, 'data/posts-index.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(APP, 'data/image-manifest.json'), 'utf8'));
const localize = (s) => (s ? manifest[s] || manifest[s.split('/').pop()] || s : s);

let variants = 0;
for (const p of idx) {
  let rel = localize(p.featuredImage);
  rel = renames[rel] || rel;
  const abs = join(PUB, rel.replace(/^\//, ''));
  if (!existsSync(abs)) continue;
  const srcBuf = readFileSync(abs);
  const meta = await sharp(srcBuf).metadata();
  for (const w of [400, 800]) {
    if (meta.width <= w) continue;
    const outRel = rel.replace(/\.webp$/, `-${w}w.webp`);
    if (!DRY) await sharp(abs).resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(join(PUB, outRel.replace(/^\//, '')));
    variants++;
  }
}
console.log(`responsive variants: ${variants} files (400w + 800w)`);

/* ---------- 4. repoint references ---------- */
if (!DRY && Object.keys(renames).length) {
  const patchFile = (p) => {
    let s = readFileSync(p, 'utf8');
    const before = s;
    for (const [oldP, newP] of Object.entries(renames)) s = s.split(oldP).join(newP);
    if (s !== before) { writeFileSync(p, s); return 1; }
    return 0;
  };
  let n = 0;
  for (const dir of ['content', 'content-posts', 'data']) {
    for (const f of readdirSync(join(APP, dir))) n += patchFile(join(APP, dir, f));
  }
  for (const f of ['app/page.tsx', 'app/[...slug]/page.tsx', 'app/knowledge-base/page.tsx', 'lib/site.ts', 'components/Header.tsx']) {
    if (existsSync(join(APP, f))) n += patchFile(join(APP, f));
  }
  console.log(`repointed references in ${n} files`);

  // the originals are now unreferenced
  for (const rel of Object.keys(renames)) {
    const abs = join(PUB, rel.replace(/^\//, ''));
    if (existsSync(abs)) unlinkSync(abs);
  }
  console.log(`removed ${Object.keys(renames).length} superseded jpg/png originals`);
}

if (DRY) console.log('\n(dry run — pass --write to apply)');
