// Put back the price CTA headings the orphan-heading prune removed.
//
// "Apply Now for Rs. 16000!", "Book Now for Rs.8999", "File for Rs. 2800": these
// look empty in the content JSON, and the prune treated them as leftover widget
// labels. They are not - splitHero reads the page's price out of them for the
// hero badge, the lead form and the Service schema offer. Removing them took the
// price off every page that had one. Each is re-inserted at the index it held at
// HEAD, which is where splitHero found it before.
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const DIR = join(ROOT, 'bookmytm-next/content');
const PRICE = /(?:rs\.?|₹)\s*[\d,]{3,}/i;

let restored = 0;
for (const f of readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  let head;
  try {
    head = JSON.parse(execSync(`git show HEAD:bookmytm-next/content/${f}`, { cwd: ROOT, maxBuffer: 1 << 26 }).toString());
  } catch {
    continue; // new file, nothing to restore
  }
  const cur = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  const has = (blocks, text) => blocks.some((b) => b.type === 'heading' && b.text === text);
  let changed = false;
  head.blocks.forEach((b, i) => {
    if (b.type !== 'heading' || !PRICE.test(b.text) || has(cur.blocks, b.text)) return;
    cur.blocks.splice(Math.min(i, cur.blocks.length), 0, { ...b });
    changed = true;
    restored++;
    console.log(`  ${f.replace(/\.json$/, '')}  @${i}  "${b.text}"`);
  });
  if (changed) writeFileSync(join(DIR, f), JSON.stringify(cur, null, 2) + '\n');
}
console.log(`\nrestored ${restored} price headings`);
