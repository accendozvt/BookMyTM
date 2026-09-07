// Fail on any heading in the rendered page body that has nothing under it.
//
// This is how the ISO pages shipped: the content was in the JSON, but the
// renderer grouped it away from its headings, leaving "Benefits of ISO
// Registration" and "Document Required for ISO 9001:2015" as bare lines with
// nothing beneath. A content-level check cannot see that; only the built HTML can.
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

let flagged = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
  // Significant tokens only: headings, and anything that counts as content. A
  // link counts: the hub pages are grids of <a> cards whose h3 is followed only
  // by "Learn More", and those are navigation, not empty sections.
  // A closing </a> counts too: a card's h3 is the last thing inside its link, and
  // the last card on a page has no following token at all.
  const toks = [...main.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>|<(p|li|img|table|details|summary|a)\b|<\/(a)>/gi)].map((m) =>
    m[1] ? { h: +m[1][1], text: m[2].replace(/<[^>]+>/g, '').trim() } : { content: m[3] || m[4] },
  );
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (!t.h || t.h === 1) continue;
    const next = toks[i + 1];
    // empty if followed by nothing, or by a heading at the same or a shallower level
    if (!next || (next.h && next.h <= t.h)) {
      flagged++;
      console.log(`  ${rel(f)}  h${t.h} "${t.text.slice(0, 70)}"`);
    }
  }
}
console.log(flagged === 0 ? `no empty headings across ${files.length} pages` : `\n${flagged} empty heading(s)`);
process.exit(flagged === 0 ? 0 : 1);
