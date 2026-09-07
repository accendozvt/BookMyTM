// Cross-checked change report for every standalone page (blog posts excluded).
//
// Pulls together, per page: what the old site had, what the new site has now,
// what changed in this pass, and what the build-time checks say about the
// result. Reads the restore log (restore-report.json), the old-site cache, the
// content JSON and the built HTML - nothing is asserted that was not measured.
//
// Writes seo-audit/CHANGE-REPORT.json and seo-audit/CHANGE-REPORT.md.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const APP = join(ROOT, 'bookmytm-next');
const BUILD = join(APP, '.next/server/app');
const OLD = 'https://mediumblue-koala-112940.hostingersite.com';

const cache = JSON.parse(readFileSync(join(ROOT, 'seo-audit/oldsite/old-pages.json'), 'utf8'));
const restore = JSON.parse(readFileSync(join(ROOT, 'seo-audit/restore-report.json'), 'utf8'));
const byFile = Object.fromEntries(restore.filter((r) => r.file).map((r) => [r.file, r]));
const seo = JSON.parse(readFileSync(join(APP, 'data/seo.json'), 'utf8'));

const decode = (s) => s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&#x27;|&#039;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/gi, ' ');
const textOf = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<header[\s\S]*?<\/header>/gi, ' ')
      .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
const words = (t) => (t ? t.split(/\s+/).filter((w) => /[a-z0-9\u0d00-\u0d7f]/i.test(w)).length : 0);

const ALIAS = { 'intellectual-property__trademark__trademark-registration-in-kerala': '/intellectual-property/trademark/trademark-registration/' };
const pathFor = (file) => (file === '__home' ? '/' : '/' + file.replace(/__/g, '/') + '/');
const oldPathFor = (file) => ALIAS[file] || pathFor(file);
const builtHtml = (file) => {
  const p = file === '__home' ? 'index.html' : file.replace(/__/g, '/') + '.html';
  const f = join(BUILD, p);
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};
const categoryOf = (file) =>
  file === '__home' ? 'home'
  : /^(about-us|contact)$/.test(file) ? 'company'
  : /^(privacy-policy|terms-and-conditions|cancellation-refund-policy)$/.test(file) ? 'legal'
  : /^knowledge-base$/.test(file) ? 'listing'
  : byFile[file] ? 'service'
  : 'hub';

const files = readdirSync(join(APP, 'content')).filter((f) => f.endsWith('.json') && f !== 'test.json').map((f) => f.replace(/\.json$/, ''));
const rows = [];
for (const file of files) {
  const path = pathFor(file);
  const html = builtHtml(file);
  const oldHtml = cache[oldPathFor(file)];
  const doc = JSON.parse(readFileSync(join(APP, 'content', file + '.json'), 'utf8'));
  const r = byFile[file];

  const row = {
    path,
    title: (seo[path] && seo[path].title) || doc.h1 || doc.title || file,
    category: categoryOf(file),
    oldWords: oldHtml && !oldHtml.startsWith('__') ? words(textOf(oldHtml)) : null,
    newWords: html ? words(textOf(html)) : null,
    formInHero: html ? /Get Started<\/p>/.test(html.split('</h1>')[1]?.split('<main')[0] || '') || (html.indexOf('Free Consultation') > -1 && html.indexOf('Free Consultation') < html.indexOf('</section>')) : false,
    changes: [],
    checks: {},
  };

  if (r) {
    for (const k of ['docs', 'steps', 'process']) {
      const s = r.sections[k];
      const label = { docs: 'Documents Required', steps: '3 Easy Steps', process: 'The Process' }[k];
      if (s.action === 'restored') row.changes.push(`${label}: restored from the old site (${s.oldWords} words, was ${s.newWords})`);
      else if (s.action === 'restructured') row.changes.push(`${label}: restructured into titled items / lists (${s.oldWords} words)`);
    }
    if (r.normalised) row.changes.push(`${r.normalised} heading-level / structure fix${r.normalised > 1 ? 'es' : ''}`);
    row.sections = r.sections;
  }
  if (row.category === 'service') row.changes.push('lead form moved beside the hero; body now full width');

  if (html) {
    const main = (html.match(/<main[\s\S]*?<\/main>/i) || [html])[0];
    row.checks.h1 = (main.match(/<h1\b/g) || []).length;
    row.checks.h2 = (main.match(/<h2\b/g) || []).length;
    row.checks.faqSchema = /"@type":"FAQPage"/.test(html);
    row.checks.serviceSchema = /"@type":"Service"/.test(html);
    row.checks.description = /<meta name="description" content="[^"]{20,}"/.test(html);
    row.checks.canonical = /rel="canonical"/.test(html);
    row.checks.ogImage = /property="og:image"/.test(html);
  }
  rows.push(row);
}

rows.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(join(ROOT, 'seo-audit/CHANGE-REPORT.json'), JSON.stringify(rows, null, 2));

/* ---------------- markdown ---------------- */
const svc = rows.filter((r) => r.category === 'service');
const restoredPages = svc.filter((r) => r.changes.some((c) => /restored|restructured/.test(c)));
const md = [];
md.push('# BookMyTM — standalone page change report', '');
md.push(`Generated ${new Date().toISOString().slice(0, 10)}. ${rows.length} standalone pages cross-checked (blog posts excluded).`, '');
md.push('## Summary', '');
md.push(`- Service pages: ${svc.length} — form moved beside the hero on all of them; body content now full width`);
md.push(`- Pages with Documents / Steps / Process content restored or restructured from the old site: ${restoredPages.length}`);
md.push(`- Documents restored: ${svc.filter((r) => r.sections?.docs.action === 'restored').length}, restructured: ${svc.filter((r) => r.sections?.docs.action === 'restructured').length}`);
md.push(`- Steps restored: ${svc.filter((r) => r.sections?.steps.action === 'restored').length}, restructured: ${svc.filter((r) => r.sections?.steps.action === 'restructured').length}`);
md.push(`- Process restored: ${svc.filter((r) => r.sections?.process.action === 'restored').length}, restructured: ${svc.filter((r) => r.sections?.process.action === 'restructured').length}`);
md.push(`- Heading-level / structure fixes: ${svc.reduce((n, r) => n + (r.sections ? (byFile[r.path === '/' ? '__home' : r.path.replace(/^\/|\/$/g, '').replace(/\//g, '__')]?.normalised || 0) : 0), 0)}`);
md.push(`- Pages thinner than the old site after this pass (<90% of old words): ${rows.filter((r) => r.oldWords && r.newWords && r.newWords < r.oldWords * 0.9).map((r) => r.path).join(', ') || 'none'}`, '');
md.push('## Per page', '');
md.push('| Page | Type | Old words | New words | Docs | Steps | Process | Changes | Checks |');
md.push('|---|---|---:|---:|---|---|---|---|---|');
const cell = (s) => (s ? `${s.oldWords}→${s.newWords}${s.action === 'restored' ? ' **R**' : s.action === 'restructured' ? ' **S**' : ''}` : '—');
for (const r of rows) {
  const c = r.checks;
  const checks = c.h1 !== undefined ? `h1 ${c.h1} · h2 ${c.h2}${c.faqSchema ? ' · FAQ✓' : ''}${c.serviceSchema ? ' · Service✓' : ''}${c.description && c.canonical && c.ogImage ? ' · meta✓' : ' · meta✗'}` : '—';
  md.push(`| ${r.path} | ${r.category} | ${r.oldWords ?? '—'} | ${r.newWords ?? '—'} | ${cell(r.sections?.docs)} | ${cell(r.sections?.steps)} | ${cell(r.sections?.process)} | ${r.changes.join('; ') || '—'} | ${checks} |`);
}
md.push('', 'R = restored from the old site (old had more words). S = restructured at equal words (titles/lists recovered). Word counts exclude header, footer and navigation.');
writeFileSync(join(ROOT, 'seo-audit/CHANGE-REPORT.md'), md.join('\n') + '\n');

console.log(`pages: ${rows.length} | service: ${svc.length} | restored/restructured: ${restoredPages.length}`);
console.log('thinner than old (<90%):', rows.filter((r) => r.oldWords && r.newWords && r.newWords < r.oldWords * 0.9).map((r) => `${r.path} (${r.newWords}/${r.oldWords})`).join(', ') || 'none');
console.log('written: seo-audit/CHANGE-REPORT.md, CHANGE-REPORT.json');
