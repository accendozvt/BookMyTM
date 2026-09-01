// Delete images under public/images that nothing in the app refers to any more,
// and drop their entries from the derived indexes.
//
// image-variants.json and image-manifest.json are excluded from the reference
// scan: they are rebuilt from whatever is on disk, so counting them would make
// every file look used. lib/site.ts and the components ARE scanned - an earlier
// prune that skipped them deleted the two megamenu promo images.
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
const DERIVED = new Set(['image-variants.json', 'image-manifest.json']);
const APPLY = process.argv.includes('--write');
// Restrict to filenames matching this pattern. Deleting every orphan the scan
// finds is a wider blast radius than any one task needs, and a reference built
// at runtime would not show up in a text scan.
const MATCH = (process.argv.find((a) => a.startsWith('--match=')) || '').slice(8);

const sources = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.next', 'public'].includes(e.name)) walk(p); }
    else if (/\.(tsx?|mjs|css|json)$/.test(e.name) && !DERIVED.has(e.name)) sources.push(readFileSync(p, 'utf8'));
  }
})(APP);
const text = sources.join('\n');

// A responsive variant is used whenever its base image is.
const baseOf = (f) => f.replace(/-(?:400|800)w\.webp$/, '.webp');

const orphans = [];
(function walkImages(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { walkImages(p); continue; }
    if (!/\.(webp|png|jpe?g|ico|svg)$/i.test(e.name)) continue;
    if (MATCH && !new RegExp(MATCH).test(e.name)) continue;
    if (!text.includes(baseOf(e.name))) orphans.push(p);
  }
})(join(PUB, 'images'));

let bytes = 0;
for (const p of orphans) bytes += statSync(p).size;
console.log(`orphaned image files: ${orphans.length} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
for (const p of orphans) console.log('  ' + p.slice(PUB.length + 1).split(String.fromCharCode(92)).join('/'));

if (!APPLY) { console.log('\n(dry run — pass --write to delete)'); process.exit(0); }

for (const p of orphans) unlinkSync(p);

// prune the derived indexes of anything that no longer exists
for (const f of ['data/image-variants.json', 'data/image-manifest.json']) {
  const abs = join(APP, f);
  const obj = JSON.parse(readFileSync(abs, 'utf8'));
  let n = 0;
  for (const [k, v] of Object.entries(obj)) {
    const rel = f.endsWith('variants.json') ? k : v;
    if (typeof rel === 'string' && rel.startsWith('/images/') && !existsSync(join(PUB, rel.replace(/^\//, '')))) {
      delete obj[k];
      n++;
    }
  }
  writeFileSync(abs, JSON.stringify(obj, null, 2) + '\n');
  console.log(`${f}: pruned ${n} stale entries`);
}
console.log(`\ndeleted ${orphans.length} files, freed ${(bytes / 1024 / 1024).toFixed(1)} MB`);
