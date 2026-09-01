// Validate rewrite lengths, then merge them into data/seo.json.
// Usage: node apply-seo-rewrites.mjs <module.mjs> [--write]
import { readFileSync, writeFileSync } from 'fs';

const SEO_PATH = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/data/seo.json';
const mod = await import('./' + process.argv[2]);
const REWRITES = mod.REWRITES;
const write = process.argv.includes('--write');

const seo = JSON.parse(readFileSync(SEO_PATH, 'utf8'));
const bad = [];
let okT = 0, okD = 0, missing = [];

for (const [route, patch] of Object.entries(REWRITES)) {
  if (!seo[route]) { missing.push(route); continue; }
  if (patch.title !== undefined) {
    const n = patch.title.length;
    if (n < 50 || n > 60) bad.push(`TITLE ${n} (need 50-60)  ${route}\n      ${patch.title}`);
    else okT++;
  }
  if (patch.description !== undefined) {
    const n = patch.description.length;
    if (n < 140 || n > 160) bad.push(`DESC  ${n} (need 140-160) ${route}\n      ${patch.description}`);
    else okD++;
  }
}

console.log(`titles in range: ${okT} | descriptions in range: ${okD}`);
if (missing.length) console.log(`\nROUTES NOT IN seo.json (${missing.length}):\n  ` + missing.join('\n  '));
if (bad.length) {
  console.log(`\nOUT OF RANGE (${bad.length}):`);
  bad.forEach((b) => console.log('  ' + b));
}

if (!write) { console.log('\n(dry run — pass --write to apply)'); process.exit(bad.length ? 1 : 0); }
if (bad.length || missing.length) { console.log('\nREFUSING TO WRITE: fix the above first.'); process.exit(1); }

for (const [route, patch] of Object.entries(REWRITES)) Object.assign(seo[route], patch);
writeFileSync(SEO_PATH, JSON.stringify(seo, null, 2) + '\n');
console.log(`\napplied ${Object.keys(REWRITES).length} route patches to seo.json`);
