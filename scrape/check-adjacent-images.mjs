// Guard against two images rendering back to back.
//
// Checking the content JSON is not enough: Blocks.tsx splits sections on h2 only,
// and lifts h3+paragraph runs out into a card grid. Two images separated by a run
// of h3 cards in the source therefore end up as siblings in the output - which is
// how the About page shipped a stacked pair whose blocks sit 25 apart in the JSON.
// This checks the built HTML, which is what a reader actually sees.
import { readdirSync, readFileSync } from 'fs';
import { join, sep } from 'path';

const BUILD = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/.next/server/app';
const rel = (f) => f.slice(BUILD.length + 1).split(sep).join('/');

const files = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(BUILD);

// the body-content image treatment: a centring wrapper around one rounded image
const PAIR =
  /<div class="flex justify-center">\s*<img[^>]*src="([^"]+)"[^>]*>\s*<\/div>\s*<div class="flex justify-center">\s*<img[^>]*src="([^"]+)"/g;

let flagged = 0;
for (const f of files) {
  for (const m of readFileSync(f, 'utf8').matchAll(PAIR)) {
    flagged++;
    console.log(`  ${rel(f)}`);
    console.log(`      ${m[1].split('/').pop()}`);
    console.log(`      ${m[2].split('/').pop()}`);
  }
}

console.log(flagged === 0 ? `no stacked images across ${files.length} pages` : `\n${flagged} stacked image pair(s)`);
process.exit(flagged === 0 ? 0 : 1);
