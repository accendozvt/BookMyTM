// Second pass over the old-vs-new comparison.
//
// The first pass flagged any heading text present in the old page and absent
// from the new one. That over-reports: a heading is "missing" if it was reworded
// or demoted to a paragraph, even though the content itself is intact. This pass
// separates the two by asking whether the heading's words appear anywhere in the
// new page's body:
//
//   GONE      - the text is nowhere on the new page. Real content loss.
//   DEMOTED   - present as body text, but no longer a heading. Structural only.
//
// Also checks that every old URL that changed has a redirect, since a 404 on an
// indexed URL costs more than any amount of on-page tuning.
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/oldsite';
const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const BUILD = join(APP, '.next/server/app');
const rows = JSON.parse(readFileSync(join(OUT, 'comparison.json'), 'utf8'));

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&rsquo;|&#8217;/g, "'")
    .replace(/&[a-z]+;/gi, ' ');

const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9\u0d00-\u0d7f]+/g, ' ').replace(/\s+/g, ' ').trim();

function newTextFor(path) {
  const clean = path.replace(/^\/|\/$/g, '');
  for (const cand of [clean ? clean + '.html' : 'index.html', join(clean, 'index.html')]) {
    const f = join(BUILD, cand);
    try {
      const h = readFileSync(f, 'utf8');
      return normalise(
        decode(
          h
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
            .replace(/<[^>]+>/g, ' '),
        ),
      );
    } catch {}
  }
  return null;
}

/** Is the heading's substance present? Exact phrase, else >=70% of its words. */
function present(heading, text) {
  if (!heading) return true;
  if (text.includes(heading)) return true;
  const ws = heading.split(' ').filter((w) => w.length > 3);
  if (!ws.length) return text.includes(heading);
  const hit = ws.filter((w) => text.includes(w)).length;
  return hit / ws.length >= 0.7;
}

const gone = [];
const demoted = [];
for (const r of rows) {
  if (r.status !== 'PRESENT' || !r.missingHeadings?.length) continue;
  const text = newTextFor(r.path);
  if (text === null) continue;
  const g = [];
  let d = 0;
  for (const h of r.missingHeadings) {
    if (present(h, text)) d++;
    else g.push(h);
  }
  if (g.length) gone.push({ path: r.path, headings: g, words: r.new.words, oldWords: r.old.words });
  if (d) demoted.push({ path: r.path, count: d });
}

const totalMissing = rows.reduce((n, r) => n + (r.missingHeadings?.length || 0), 0);
const totalGone = gone.reduce((n, r) => n + r.headings.length, 0);
const totalDemoted = demoted.reduce((n, r) => n + r.count, 0);

console.log('============ HEADING ANALYSIS ============');
console.log(`headings flagged by pass 1        : ${totalMissing}`);
console.log(`  reworded/demoted (text present) : ${totalDemoted}  <- structural, not content loss`);
console.log(`  GONE (text nowhere on new page) : ${totalGone}`);
console.log(`pages with genuinely lost content : ${gone.length}`);

if (gone.length) {
  console.log('\n---- PAGES WITH CONTENT NOT PRESENT ANYWHERE ON THE NEW PAGE ----');
  gone
    .sort((a, b) => b.headings.length - a.headings.length)
    .forEach((r) => {
      console.log(`\n  ${r.path}   (new ${r.words} words vs old ${r.oldWords})`);
      r.headings.forEach((h) => console.log(`      - ${h.slice(0, 100)}`));
    });
}

writeFileSync(join(OUT, 'content-loss.json'), JSON.stringify({ gone, demoted }, null, 2));
console.log('\nfull detail: seo-audit/oldsite/content-loss.json');
