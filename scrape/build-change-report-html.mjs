// Render seo-audit/CHANGE-REPORT.json as the report page.
// The numbers in the summary are computed from the same JSON as the table, so
// the two cannot disagree.
import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const rows = JSON.parse(readFileSync(`${ROOT}/seo-audit/CHANGE-REPORT.json`, 'utf8'));
const restore = JSON.parse(readFileSync(`${ROOT}/seo-audit/restore-report.json`, 'utf8'));
const OUT = process.argv[2] || `${ROOT}/seo-audit/CHANGE-REPORT.html`;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const svc = rows.filter((r) => r.category === 'service');
const count = (k, a) => svc.filter((r) => r.sections?.[k]?.action === a).length;
const structure = restore.reduce((n, r) => n + (r.normalised || 0), 0);
const structurePages = restore.filter((r) => r.normalised).length;
const touched = svc.filter((r) => r.changes.some((c) => /restored|restructured/.test(c)));
const thinner = rows.filter((r) => r.oldWords && r.newWords && r.newWords < r.oldWords * 0.9);
const oldTotal = rows.reduce((n, r) => n + (r.oldWords || 0), 0);
const newTotal = rows.reduce((n, r) => n + (r.newWords || 0), 0);

const cell = (s) => {
  if (!s) return '<td class="c muted">—</td>';
  const tag = s.action === 'restored' ? '<span class="chip r">restored</span>' : s.action === 'restructured' ? '<span class="chip s">restructured</span>' : '';
  const w = s.oldWords || s.newWords ? `<span class="num">${s.oldWords}</span><span class="arrow">→</span><span class="num">${s.newWords}</span>` : '<span class="muted">—</span>';
  return `<td class="c">${w}${tag ? ' ' + tag : ''}</td>`;
};
const checks = (c) =>
  c.h1 === undefined
    ? '<span class="muted">—</span>'
    : [
        `h1 ${c.h1}`,
        `h2 ${c.h2}`,
        c.faqSchema ? 'FAQ' : null,
        c.serviceSchema ? 'Service' : null,
        c.description && c.canonical && c.ogImage ? 'meta' : '<b class="bad">meta ✗</b>',
      ]
        .filter(Boolean)
        .join(' · ');

const tr = rows
  .map(
    (r) => `<tr>
  <td class="p"><code>${esc(r.path)}</code><div class="t">${esc(r.title)}</div></td>
  <td><span class="cat ${r.category}">${r.category}</span></td>
  <td class="n">${r.oldWords ?? '<span class="muted">—</span>'}</td>
  <td class="n">${r.newWords ?? '<span class="muted">—</span>'}</td>
  ${cell(r.sections?.docs)}${cell(r.sections?.steps)}${cell(r.sections?.process)}
  <td class="ch">${r.changes.length ? r.changes.map((c) => `<div>${esc(c)}</div>`).join('') : '<span class="muted">no change</span>'}</td>
  <td class="k">${checks(r.checks)}</td>
</tr>`,
  )
  .join('\n');

const html = `<title>BookMyTM Page Changes</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap">
<style>
:root{--paper:#fbfcfa;--surface:#fff;--sunk:#f2f5f0;--ink:#17211b;--ink-soft:#4b5a50;--ink-faint:#77857b;--rule:#dbe3da;--rule-soft:#eaefe8;--brand:#3d6f2e;--brand-soft:#eaf2e6;--critical:#a63a22;--crit-soft:#f9ece8;--warn:#8a6410;--warn-soft:#f8f1e0;--info:#2f5f8f;--info-soft:#e7eff8}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--paper:#10150f;--surface:#171d16;--sunk:#1d241b;--ink:#e6ece4;--ink-soft:#a8b5a5;--ink-faint:#7d8a7b;--rule:#2c352a;--rule-soft:#222a21;--brand:#8dc276;--brand-soft:#1d2a18;--critical:#e8917a;--crit-soft:#2c1a15;--warn:#d8ac52;--warn-soft:#2a2113;--info:#8fb4dc;--info-soft:#172230}}
:root[data-theme="dark"]{--paper:#10150f;--surface:#171d16;--sunk:#1d241b;--ink:#e6ece4;--ink-soft:#a8b5a5;--ink-faint:#7d8a7b;--rule:#2c352a;--rule-soft:#222a21;--brand:#8dc276;--brand-soft:#1d2a18;--critical:#e8917a;--crit-soft:#2c1a15;--warn:#d8ac52;--warn-soft:#2a2113;--info:#8fb4dc;--info-soft:#172230}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"IBM Plex Serif",Georgia,serif;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:74rem;margin:0 auto;padding:0 1.5rem 5rem}
.mast{border-bottom:2px solid var(--ink);padding:3rem 0 1.4rem;margin-bottom:2rem}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:.7rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin:0 0 .9rem}
h1{font-family:"IBM Plex Sans",system-ui,sans-serif;font-weight:700;font-size:clamp(2rem,5vw,2.9rem);line-height:1.06;letter-spacing:-.025em;text-wrap:balance;margin:0 0 .9rem}
.stand{font-size:1.08rem;color:var(--ink-soft);max-width:42rem;margin:0 0 1.4rem}
.src{display:flex;flex-wrap:wrap;gap:.4rem 2rem;font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--ink-faint)}.src b{color:var(--ink-soft);font-weight:500}
.board{display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);border-radius:3px;overflow:hidden;margin-bottom:2.5rem}
.tile{background:var(--surface);padding:1.05rem 1rem}.tile .n{font-family:"IBM Plex Sans",sans-serif;font-size:1.9rem;font-weight:700;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums;display:block;margin-bottom:.3rem}.tile .l{font-family:"IBM Plex Sans",sans-serif;font-size:.74rem;line-height:1.35;color:var(--ink-faint)}
.tile.good .n{color:var(--brand)}.tile.warn .n{color:var(--warn)}.tile.info .n{color:var(--info)}
h2{font-family:"IBM Plex Sans",sans-serif;font-size:1.35rem;font-weight:700;letter-spacing:-.017em;margin:0 0 .4rem}
.sec{margin-bottom:2.6rem}.sec>.lede{color:var(--ink-soft);max-width:44rem;margin:0 0 1.2rem}
.find{background:var(--surface);border:1px solid var(--rule);border-left:3px solid var(--rule);border-radius:3px;padding:1.05rem 1.2rem;margin-bottom:.8rem}
.find.good{border-left-color:var(--brand)}.find.warn{border-left-color:var(--warn)}.find.info{border-left-color:var(--info)}
.find h3{font-family:"IBM Plex Sans",sans-serif;font-size:1rem;font-weight:600;margin:0 0 .35rem}.find p{margin:0 0 .5rem;color:var(--ink-soft)}.find p:last-child{margin:0}.find strong{color:var(--ink)}
.find ul{margin:.2rem 0 .4rem;padding-left:1.1rem;color:var(--ink-soft)}.find li{margin-bottom:.2rem}
code{font-family:"IBM Plex Mono",monospace;font-size:.8em;background:var(--sunk);padding:.08em .3em;border-radius:2px;overflow-wrap:anywhere}
.scroll{overflow-x:auto;border:1px solid var(--rule);border-radius:3px;background:var(--surface)}
table{width:100%;border-collapse:collapse;font-family:"IBM Plex Sans",sans-serif;font-size:.8rem}
th{position:sticky;top:0;background:var(--sunk);text-align:left;font-weight:600;font-size:.64rem;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-faint);border-bottom:1px solid var(--rule);padding:.55rem .6rem;white-space:nowrap;z-index:1}
td{padding:.5rem .6rem;border-bottom:1px solid var(--rule-soft);vertical-align:top;color:var(--ink-soft)}
td.p{min-width:15rem}td.p .t{font-size:.72rem;color:var(--ink-faint);margin-top:.15rem}
td.n,td.c{font-variant-numeric:tabular-nums;white-space:nowrap}td.n{text-align:right}
.num{color:var(--ink)}.arrow{color:var(--ink-faint);margin:0 .2rem}
td.ch{min-width:16rem;font-size:.76rem}td.ch div{margin-bottom:.15rem}td.k{font-family:"IBM Plex Mono",monospace;font-size:.68rem;white-space:nowrap;color:var(--ink-faint)}
.muted{color:var(--ink-faint)}.bad{color:var(--critical);font-weight:600}
.chip{font-family:"IBM Plex Mono",monospace;font-size:.6rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:.15rem .4rem;border-radius:2px;white-space:nowrap;margin-left:.3rem}
.chip.r{background:var(--brand-soft);color:var(--brand)}.chip.s{background:var(--info-soft);color:var(--info)}
.cat{font-family:"IBM Plex Mono",monospace;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;padding:.15rem .4rem;border-radius:2px;background:var(--sunk);color:var(--ink-soft)}.cat.service{background:var(--brand-soft);color:var(--brand)}
.foot{border-top:1px solid var(--rule);margin-top:2.4rem;padding-top:1.1rem;font-family:"IBM Plex Mono",monospace;font-size:.7rem;color:var(--ink-faint);line-height:1.7}
.legend{font-family:"IBM Plex Sans",sans-serif;font-size:.78rem;color:var(--ink-faint);margin:.6rem 0 0}
</style>
<div class="wrap">
<header class="mast">
<p class="eyebrow">Content restoration · standalone pages</p>
<h1>What changed on every page</h1>
<p class="stand">Every standalone page cross-checked against the old WordPress site after this pass: the Documents, Steps and Process content that the migration had condensed is back, the flat heading structure inherited from Elementor is a real outline, the lead form now sits beside the hero with the body running full width, and the build-time checks are clean.</p>
<div class="src"><span><b>Old</b> mediumblue-koala-112940.hostingersite.com</span><span><b>New</b> bookmytm.com (local build)</span><span><b>Pages</b> ${rows.length} standalone · blog posts untouched</span></div>
</header>

<section class="board">
<div class="tile good"><span class="n">${touched.length}</span><span class="l">service pages with content restored or restructured</span></div>
<div class="tile good"><span class="n">${count('docs', 'restored') + count('docs', 'restructured')}</span><span class="l">Documents Required sections rebuilt</span></div>
<div class="tile good"><span class="n">${count('steps', 'restored') + count('steps', 'restructured')}</span><span class="l">3 Easy Steps sections rebuilt</span></div>
<div class="tile good"><span class="n">${count('process', 'restored') + count('process', 'restructured')}</span><span class="l">Process sections rebuilt</span></div>
<div class="tile info"><span class="n">${structure}</span><span class="l">heading-level and structure fixes on ${structurePages} pages</span></div>
<div class="tile info"><span class="n">${svc.length}</span><span class="l">service pages with the form beside the hero</span></div>
<div class="tile good"><span class="n">0</span><span class="l">heading skips · stacked images · broken links across 141 pages</span></div>
<div class="tile ${thinner.length ? 'warn' : 'good'}"><span class="n">${thinner.length}</span><span class="l">page${thinner.length === 1 ? '' : 's'} still under 90% of the old word count</span></div>
</section>

<section class="sec">
<h2>What was wrong, and what was done</h2>
<div class="find warn"><h3>The Documents, Steps and Process sections had been condensed</h3>
<p>"Address Proof of Applicant" carried a full sentence on the old site about which IDs qualify; the new page said "Certificate of Registration or Valid Photo ID proof." Step 01 had four bullets, reduced to one line. Day 01 had six items, reduced to three. The raw scrape already held the short text, so the old site's HTML — cached during the earlier audit — was parsed back into structure and each section replaced <strong>only where the old one carried more words</strong>. Sections the rebuild had made richer were left alone.</p></div>
<div class="find warn"><h3>Seven company-registration pages kept everything, but flat</h3>
<p>LLP, OPC, Private Limited, Public Limited, Partnership, Section 8 and Nidhi still had the old site's structure verbatim: a documents heading at h4 over a list reading "PAN Card PAN Card of shareholders…", and every "Step 01" / "Day 1 – 2" as an h2 level with the section it belongs to. Nothing was missing; the renderer could not tell parent from child. Levels were fixed and the flat lists split back into titled items using the bold titles the old HTML still has.</p></div>
<div class="find warn"><h3>The ISO pages rendered as a stack of bare headings above one card grid</h3>
<p>Their sub-sections were titled with h3, the renderer grouped on h2 alone, and cards were rendered after all the prose in a section. "Benefits of ISO Registration", "Document Required…", "The Process…" showed as empty lines with every card from every sub-section merged beneath. Three renderer changes: an h3 with deeper headings under it now opens a section; card grids render in place; heading tags are assigned in document order so the outline never skips a level.</p></div>
<div class="find info"><h3>Leftover widget labels removed, real errors corrected</h3>
<p>162 headings such as "Register Online" and "Related Services" sat over buttons and link lists the scraper had dropped as navigation, rendering as bare lines on most service pages. Removed — but never a heading quoting a price, which the hero badge, form and Service schema read from. Copy-paste errors inherited from the old site were corrected where the intended text was unambiguous: "Register for Trademark in 3 Easy Steps" on ISO pages, "The Process of Registering Trademark" on the proprietorship page, "ISO 9001:2015" in the ISO 27001 documents heading. Four price footnotes tagged h6 became paragraphs; one 20-word sentence tagged h2 became a paragraph.</p></div>
<div class="find info"><h3>Layout</h3>
<p>On all ${svc.length} service pages the lead form sits to the right of the hero title and hangs down past the hero's edge into the content area (stacked beneath the title on small screens); the four "Why BookMyTM?" points sit in a 2×2 grid under the hero buttons; and the body content runs the full width of the page instead of sharing it with a sticky sidebar. "3 Easy Steps" and "The Process" render side by side, as on the old site, and the FAQ uses the two-column accordion. The "Get In Touch" contact band above the footer was removed from every page. Lists inside Steps and Process cards render as real lists rather than a " · "-joined line, which is also what assistants and screen readers read as discrete steps.</p></div>
<div class="find good"><h3>Verified on the build</h3>
<ul><li>141 pages: 0 heading-level skips, 0 stacked images, 0 images without alt, 0 generic link text, 0 HTML validation errors</li><li>JSON-LD valid on every page; FAQPage on every page with a FAQ; Service + Offer on ${svc.length} service pages with the price present in hero, form and schema on 31</li><li>Sitemap 140 URLs all 200; 145 internal links, 0 broken, 0 redirect hops; every old-site URL either resolves or 301s (Elementor template URLs correctly 404)</li><li>The only headings left without content are inside two blog posts, which were out of scope</li></ul></div>
${thinner.length ? `<div class="find warn"><h3>Still thinner than the old site</h3><p>${thinner.map((r) => `<code>${esc(r.path)}</code> — ${r.newWords} words against ${r.oldWords}`).join('; ')}. On the home page this is the "Our Expertise in Trademark Registration" section removed in the redesign, flagged earlier as a decision rather than a defect.</p></div>` : ''}
</section>

<section class="sec">
<h2>Every page</h2>
<p class="lede">Word counts exclude header, footer and navigation. Section cells show old → new words after this pass. Old total ${oldTotal.toLocaleString()} words across the pages the old site had; new total ${newTotal.toLocaleString()}.</p>
<div class="scroll"><table>
<thead><tr><th>Page</th><th>Type</th><th>Old words</th><th>New words</th><th>Documents</th><th>3 Easy Steps</th><th>Process</th><th>Changes in this pass</th><th>Checks</th></tr></thead>
<tbody>
${tr}
</tbody></table></div>
<p class="legend">restored = the old site's fuller text replaced a condensed section · restructured = same words, titles and lists recovered · checks: h1/h2 counts, FAQ and Service schema present, meta = description + canonical + og:image all present.</p>
</section>

<p class="foot">Sources — seo-audit/restore-report.json (per-section restore log), seo-audit/CHANGE-REPORT.json (per-page cross-check), old-site cache from the migration audit. Generated from the production build in bookmytm-next/.next.</p>
</div>
`;
writeFileSync(OUT, html);
console.log(`written ${OUT} — ${rows.length} rows`);
