// Restore the homepage FAQ questions to the phrasing the WordPress site used.
//
// The rebuild compressed all 30 into labels - "What is an Importer Exporter Code
// (IEC)?" became "What is IEC?". The answers survived intact; only the questions
// were trimmed, and the questions are what carries the work: they are the text in
// the FAQPage schema and the string that has to match a typed or spoken query.
// "What is IEC?" matches almost nothing and gives an assistant no subject to
// anchor to.
//
// Matched by the leading number, which both versions kept, so a question can only
// be replaced by its own counterpart.
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const OLD = JSON.parse(
  readFileSync('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/oldsite/home-faq-old.json', 'utf8'),
);
const byNum = new Map(OLD.map(([n, q]) => [n, q]));

const file = join(APP, 'content/__home.json');
const doc = JSON.parse(readFileSync(file, 'utf8'));

let changed = 0;
const log = [];
(function walk(blocks) {
  for (const b of blocks) {
    if (Array.isArray(b.items)) {
      for (const item of b.items) {
        if (!item.q) continue;
        const m = item.q.match(/^(\d{1,2})\.\s*(.+)$/);
        if (!m) continue;
        const full = byNum.get(+m[1]);
        if (!full || full === m[2]) continue;
        log.push([m[2], full]);
        item.q = `${m[1]}. ${full}`;
        changed++;
      }
    }
    if (Array.isArray(b.blocks)) walk(b.blocks);
  }
})(doc.blocks);

writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
console.log(`restored ${changed} of ${OLD.length} homepage FAQ questions\n`);
log.forEach(([was, now]) => console.log(`  "${was}"\n    -> "${now}"`));
