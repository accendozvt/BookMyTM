// Print every failing / opportunity audit from a Lighthouse report set.
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const DIR = join('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit', process.argv[2] || 'baseline');
const files = readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'summary.json');
const agg = new Map();

for (const f of files) {
  const lhr = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  const [page, preset] = f.replace('.json', '').split('.');
  for (const [id, a] of Object.entries(lhr.audits)) {
    if (a.scoreDisplayMode === 'notApplicable' || a.scoreDisplayMode === 'manual' || a.scoreDisplayMode === 'informative') continue;
    if (a.score === null || a.score >= 1) continue;
    const key = id;
    if (!agg.has(key)) agg.set(key, { title: a.title, hits: [], savings: 0 });
    const e = agg.get(key);
    e.hits.push(`${page}/${preset}`);
    const ms = a.details?.overallSavingsMs || 0;
    const by = a.details?.overallSavingsBytes || 0;
    e.savings = Math.max(e.savings, ms || by / 1024);
    e.unit = ms ? 'ms' : by ? 'KiB' : '';
  }
}

const sorted = [...agg.entries()].sort((a, b) => b[1].hits.length - a[1].hits.length);
console.log(`Failing audits across ${files.length} reports:\n`);
for (const [id, e] of sorted) {
  const s = e.savings ? ` (~${Math.round(e.savings)}${e.unit})` : '';
  console.log(`[${String(e.hits.length).padStart(2)}x] ${id}${s}`);
  console.log(`      ${e.title}`);
  console.log(`      ${e.hits.slice(0, 6).join(', ')}${e.hits.length > 6 ? ' …' : ''}`);
}
