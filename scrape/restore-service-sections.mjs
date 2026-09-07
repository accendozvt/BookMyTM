// Put back the Documents / 3 Easy Steps / Process content the migration condensed,
// and normalise the pages that kept it in the old site's flat heading structure.
//
// Two different states were found across the service pages:
//
//   Condensed. "Address Proof of Applicant" carried a full sentence about which
//   IDs qualify; the new JSON says "Certificate of Registration or Valid Photo ID
//   proof." Step 01 had four bullets, now one line. Day 01 had six items, now
//   three, abbreviated. The raw scrape already has the short text, so the only
//   complete source is the old HTML cached by the audit. Those sections are
//   re-parsed from it and replaced - only when the old section has more words,
//   so a page the rebuild made richer is never touched.
//
//   Flat. The company-registration pages kept everything verbatim but in the old
//   site's structure: the documents heading is an h4 over a flat list whose items
//   read "PAN Card PAN Card of shareholders", and every "Step 01" / "Day 1 – 2" is
//   an h2 at the same level as the section it belongs to. Nothing is missing; the
//   renderer just cannot tell parent from child. Those get their levels fixed and
//   their document lists split into title + description.
//
// Either way, section titles end up as h2 and their children as h3/h4, which is
// what the renderer groups on - the ISO pages' stack of bare headings above one
// undifferentiated card grid came from titling sub-sections with h3.
//
//   node restore-service-sections.mjs                 dry run, prints the plan
//   node restore-service-sections.mjs --show=<slug>   also dumps one page's blocks
//   node restore-service-sections.mjs --write         applies it
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const APP = join(ROOT, 'bookmytm-next');
const WRITE = process.argv.includes('--write');
const SHOW = (process.argv.find((a) => a.startsWith('--show=')) || '').slice(7);

const cache = JSON.parse(readFileSync(join(ROOT, 'seo-audit/oldsite/old-pages.json'), 'utf8'));

// The one old URL whose page moved: its content lives at the Kerala slug.
const ALIAS = {
  '/intellectual-property/trademark/trademark-registration/':
    'intellectual-property__trademark__trademark-registration-in-kerala',
};
const fileFor = (p) => ALIAS[p] || p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__');

// Copy-paste errors carried over from the old site. A proprietorship page whose
// process is titled "Registering Trademark" is wrong for the reader and for the
// query it should rank for. Only headings whose intended text is unambiguous.
const HEADING_FIXES = [
  { file: /^iso-certification__/, from: /^Register for Trademark in 3 Easy Steps$/i, to: 'Get Certified in 3 Easy Steps' },
  { file: /^startup__registrations__proprietorship/, from: /^The Process of Registering Trademark$/i, to: 'The Process of Registering a Proprietorship Firm' },
];

/* ---------------- text helpers ---------------- */
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x27;|&#039;|&rsquo;|&#8217;|&lsquo;|&#8216;/g, "'")
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8220;|&ldquo;|&#8221;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/gi, ' ');
const clean = (html) => decode(html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const words = (t) => (t ? String(t).split(/\s+/).filter(Boolean).length : 0);
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/* ---------------- section patterns ---------------- */
const RX = {
  docs: /^documents?\s+requir/i,
  steps: /\b(?:3|three)\s+(?:easy\s+)?steps\b/i,
  process: /^(?:the\s+)?process\b|process\s+timeline|^process\s+(?:of|to)\b/i,
  faq: /frequently asked|faq/i,
  benefits: /^benefits?\b|^why\b|^advantages?\b/i,
};
const OPENER = /^(?:step|day|week)\s*[\d\u2013\-–]+/i;
const isSectionTitle = (t) => Object.values(RX).some((r) => r.test(t)) && !OPENER.test(t);
const kindOf = (t) => (RX.docs.test(t) ? 'docs' : RX.steps.test(t) ? 'steps' : RX.process.test(t) && !OPENER.test(t) ? 'process' : null);

/* ---------------- old page: tokenise ---------------- */
function tokens(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
  const out = [];
  for (const m of body.matchAll(/<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const raw = m[2];
    const text = clean(raw);
    if (!text) continue;
    out.push({ tag: m[1].toLowerCase(), text, raw, bold: /^\s*<(?:b|strong)\b/i.test(raw) });
  }
  return out;
}

/* Split "Title description" from text alone, for lists that lost their markup. */
function splitText(text, knownTitles) {
  let m = text.match(/^([^:]{3,70}):\s+(.{8,})$/);
  if (m) return { title: m[1].trim(), text: m[2].trim() };
  const lower = text.toLowerCase();
  const hit = knownTitles.filter((t) => t && lower.startsWith(t.toLowerCase())).sort((a, b) => b.length - a.length)[0];
  if (hit && text.length > hit.length + 8) return { title: text.slice(0, hit.length).trim(), text: text.slice(hit.length).trim() };
  // "PAN Card PAN Card of shareholders..." — the bold title was flattened into the
  // text and the description restates it. The repeated phrase is the title.
  const ws = text.split(' ');
  for (let n = Math.min(6, Math.floor(ws.length / 2)); n >= 1; n--) {
    const a = ws.slice(0, n).join(' ');
    const b = ws.slice(n, 2 * n).join(' ');
    if (norm(a) === norm(b) && ws.length > 2 * n) return { title: a, text: ws.slice(n).join(' ') };
  }
  return { title: '', text };
}

/* A document line from the old markup, whichever shape the page used. */
function splitDoc(tok, knownTitles) {
  const { raw, text } = tok;
  let m = raw.match(/^\s*<(?:b|strong)\b[^>]*>([\s\S]*?)<\/(?:b|strong)>([\s\S]*)$/i);
  if (m && clean(m[2])) return { title: clean(m[1]), text: clean(m[2]) };
  m = raw.match(/^\s*<(\w+)\b[^>]*>([^<]{3,80})<\/\1>\s*([\s\S]+)$/);
  if (m && clean(m[3])) return { title: clean(m[2]), text: clean(m[3]) };
  return splitText(text, knownTitles);
}

/* ---------------- old page: parse the three sections ---------------- */
function parseOld(html, knownTitles) {
  const toks = tokens(html);
  const found = { docs: null, steps: null, process: null };

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (!/^h[2-4]$/.test(t.tag)) continue;
    const kind = kindOf(t.text);
    if (!kind || found[kind]) continue;

    // Extent: up to the next heading that is a real section title - not a
    // Step/Day opener, not a group title right after an opener, not an h4 child.
    let end = toks.length;
    for (let j = i + 1; j < toks.length; j++) {
      const x = toks[j];
      if (!/^h[2-4]$/.test(x.tag)) continue;
      if (OPENER.test(x.text)) continue;
      const prev = toks[j - 1];
      if (prev && OPENER.test(prev.text) && prev.tag !== 'li') continue;
      if (x.tag === 'h4' && !isSectionTitle(x.text)) continue;
      if (x.tag === 'h3' && kind !== 'docs' && !isSectionTitle(x.text) && toks[j + 1]?.tag === 'li') continue;
      end = j;
      break;
    }
    const body = toks.slice(i + 1, end);

    if (kind === 'docs') {
      const items = [];
      for (let k = 0; k < body.length; k++) {
        const b = body[k];
        if (b.tag === 'li') items.push(splitDoc(b, knownTitles));
        else if (/^h[3-4]$/.test(b.tag)) {
          // h4 title with a paragraph, or with its own list of lines
          const nxt = body[k + 1];
          if (nxt?.tag === 'p') { items.push({ title: b.text, text: nxt.text }); k++; }
          else if (nxt?.tag === 'li') {
            const lines = [];
            while (body[k + 1]?.tag === 'li') { lines.push(body[k + 1].text); k++; }
            items.push({ title: b.text, text: '', lines });
          } else items.push({ title: b.text, text: '' });
        } else if (b.tag === 'p' && !items.length) items.push({ title: '', text: b.text });
      }
      found.docs = { heading: t.text, items: items.filter((x) => x.title || x.text || x.lines) };
    } else {
      const groups = [];
      let cur = null;
      const hasOpeners = body.some((b) => OPENER.test(b.text) && b.tag !== 'li');
      for (let k = 0; k < body.length; k++) {
        const b = body[k];
        const opens = hasOpeners ? OPENER.test(b.text) && b.tag !== 'li' : /^h[3-4]$/.test(b.tag) || (b.tag === 'p' && b.bold && body[k + 1]?.tag === 'li');
        if (opens) {
          cur = { label: hasOpeners ? b.text.replace(/\s+/g, ' ') : '', title: hasOpeners ? '' : b.text, items: [] };
          groups.push(cur);
          const nxt = body[k + 1];
          if (hasOpeners && nxt && !OPENER.test(nxt.text) && (nxt.tag === 'h4' || nxt.tag === 'h3' || (nxt.tag === 'p' && nxt.bold))) { cur.title = nxt.text; k++; }
          continue;
        }
        if (!cur) continue;
        if (b.tag === 'li' || b.tag === 'p') cur.items.push(b.text);
      }
      found[kind] = { heading: t.text, groups: groups.filter((g) => g.items.length || g.title) };
    }
  }
  return found;
}

/* ---------------- new page: normalise the flat structure ---------------- */
function normalise(blocks, file, knownTitles) {
  let changed = 0;
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'heading') {
      for (const f of HEADING_FIXES) if (f.file.test(file) && f.from.test(b.text)) { b.text = f.to; changed++; }
      // An ISO page's own section title naming a different standard is a
      // copy-paste error from the old site ("Document Required for ISO 9001:2015"
      // on the 27001 page). Only section titles: body text may compare standards.
      const own = file.match(/^iso-certification__iso-(\d{4,5})-(\d{4})/);
      if (own && isSectionTitle(b.text)) {
        const fixed = b.text.replace(/ISO\s?(\d{4,5})(?::(\d{4}))?/g, (m, num) => (num === own[1] ? m : `ISO ${own[1]}:${own[2]}`));
        if (fixed !== b.text) { b.text = fixed; changed++; }
      }
      // "Step 01" / "Day 1 – 2" at h2 sit level with the section they belong to
      if (OPENER.test(b.text) && b.level <= 2) { b.level = 3; changed++; }
      // a documents heading at h4 over a list is a section, not a card title
      if (b.level >= 3 && RX.docs.test(b.text) && (blocks[i + 1]?.type === 'list' || blocks[i + 1]?.type === 'heading')) { b.level = 2; changed++; }
      // any other section title at h3 whose first following heading is h4
      if (b.level === 3 && isSectionTitle(b.text)) {
        const nxt = blocks.slice(i + 1).find((x) => x.type === 'heading');
        if (!nxt || nxt.level >= 4 || RX.docs.test(b.text) || RX.steps.test(b.text) || RX.process.test(b.text)) { b.level = 2; changed++; }
      }
      out.push(b);
      // a flat document list right under a documents heading → title + description cards
      if (b.level === 2 && RX.docs.test(b.text) && blocks[i + 1]?.type === 'list') {
        const list = blocks[i + 1];
        const split = list.items.map((t) => splitText(t, knownTitles));
        if (split.filter((s) => s.title).length >= Math.ceil(list.items.length * 0.6)) {
          for (const s of split) {
            if (s.title) out.push({ type: 'heading', level: 4, text: s.title }, { type: 'paragraph', text: s.text || s.title });
            else out.push({ type: 'paragraph', text: s.text });
          }
          i++;
          changed++;
        }
      }
      continue;
    }
    out.push(b);
  }
  return { blocks: out, changed };
}

/* ---------------- new page: locate a section ---------------- */
function findSection(blocks, kind) {
  const i = blocks.findIndex((b) => b.type === 'heading' && b.level <= 3 && kindOf(b.text) === kind);
  if (i < 0) return null;
  const L = blocks[i].level;
  let end = blocks.length;
  for (let j = i + 1; j < blocks.length; j++) {
    const b = blocks[j];
    if (b.type === 'faq') { end = j; break; }
    if (b.type !== 'heading' || OPENER.test(b.text)) continue;
    if (b.level <= 2 || b.level <= L || (b.level <= 3 && isSectionTitle(b.text))) { end = j; break; }
  }
  return { start: i, end };
}
const blockWords = (b) => words(b.text) + (Array.isArray(b.items) ? b.items.reduce((m, x) => m + words(typeof x === 'string' ? x : x.q + ' ' + x.a), 0) : 0);
const sectionWords = (blocks, s) => blocks.slice(s.start + 1, s.end).reduce((n, b) => n + blockWords(b), 0);

/* ---------------- build replacement blocks ---------------- */
function docsBlocks(heading, parsed) {
  const out = [{ type: 'heading', level: 2, text: heading }];
  const loose = [];
  for (const it of parsed.items) {
    if (it.title) {
      out.push({ type: 'heading', level: 4, text: it.title });
      if (it.lines) out.push({ type: 'list', ordered: false, items: it.lines });
      else out.push({ type: 'paragraph', text: it.text || it.title });
    } else loose.push(it.text);
  }
  if (loose.length) out.splice(1, 0, { type: 'list', ordered: false, items: loose });
  return out;
}
function groupBlocks(heading, parsed) {
  const out = [{ type: 'heading', level: 2, text: heading }];
  for (const g of parsed.groups) {
    const label = g.label.replace(/\s*[–-]\s*/g, ' – ').replace(/^(step|day|week)\s*/i, (m) => m[0].toUpperCase() + m.slice(1).toLowerCase());
    const text = label && g.title ? `${label} · ${g.title}` : label || g.title;
    out.push({ type: 'heading', level: 3, text });
    if (g.items.length) out.push({ type: 'list', ordered: false, items: g.items });
  }
  return out;
}

/* ---------------- run ---------------- */
const report = [];
const pages = Object.keys(cache).filter((p) => /^\/(?:startup|intellectual-property|statutory-compliance|other-services)\/.+\/.+|^\/iso-certification\/.+\//.test(p));

for (const p of pages) {
  const html = cache[p];
  if (!html || html.startsWith('__')) continue;
  const fname = fileFor(p);
  const file = join(APP, 'content', fname + '.json');
  if (!existsSync(file)) { report.push({ path: p, error: 'no new file' }); continue; }

  const doc = JSON.parse(readFileSync(file, 'utf8'));
  const knownTitles = doc.blocks.filter((b) => b.type === 'heading' && b.level >= 3).map((b) => b.text.trim());
  const old = parseOld(html, knownTitles);
  const row = { path: p, file: fname, sections: {}, normalised: 0, wordsBefore: doc.blocks.reduce((n, b) => n + blockWords(b), 0) };

  const n = normalise(doc.blocks, fname, knownTitles);
  let blocks = n.blocks;
  row.normalised = n.changed;

  if (SHOW && p.includes(SHOW)) { console.log('\n===== OLD PARSED: ' + p); console.log(JSON.stringify(old, null, 1).slice(0, 5000)); }

  for (const kind of ['docs', 'steps', 'process']) {
    const o = old[kind];
    const s = findSection(blocks, kind);
    const oldWords = o ? (kind === 'docs' ? o.items.reduce((m, x) => m + words(x.title) + words(x.text) + (x.lines ? x.lines.reduce((q, l) => q + words(l), 0) : 0), 0) : o.groups.reduce((m, g) => m + words(g.title) + g.items.reduce((q, x) => q + words(x), 0), 0)) : 0;
    const newWords = s ? sectionWords(blocks, s) : 0;
    const entry = { oldWords, newWords, action: 'kept' };
    // Structure counts as well as words. A documents section that is one flat
    // list has lost its titles, and a process whose days are run-on sentences has
    // lost its steps - the old page had both. Replace when the old parse restores
    // that structure and carries at least as many words.
    let structureGain = false;
    if (o && s) {
      const inner = blocks.slice(s.start + 1, s.end);
      if (kind === 'docs') {
        const newTitled = inner.filter((b) => b.type === 'heading' && b.level >= 3).length;
        const oldTitled = o.items.filter((x) => x.title).length;
        structureGain = newTitled === 0 && oldTitled >= Math.ceil(o.items.length * 0.6) && oldWords >= newWords * 0.9;
      } else {
        const newLists = inner.filter((b) => b.type === 'list').length;
        const oldListed = o.groups.reduce((m, g) => m + g.items.length, 0);
        structureGain = newLists === 0 && oldListed >= 3 && oldWords >= newWords * 0.8;
      }
    }
    if (o && s && (oldWords > newWords || structureGain)) {
      const repl = kind === 'docs' ? docsBlocks(blocks[s.start].text, o) : groupBlocks(blocks[s.start].text, o);
      if (SHOW && p.includes(SHOW)) { console.log(`----- REPLACEMENT (${kind}): blocks ${s.start}-${s.end} -> ${repl.length} blocks`); repl.forEach((b) => console.log('   [' + b.type + (b.level || '') + '] ' + (b.text || JSON.stringify(b.items)).slice(0, 170))); }
      blocks = [...blocks.slice(0, s.start), ...repl, ...blocks.slice(s.end)];
      entry.action = structureGain && !(oldWords > newWords) ? 'restructured' : 'restored';
      entry.items = kind === 'docs' ? o.items.length : o.groups.length;
    } else if (o && !s) entry.action = 'no section on new page';
    else if (!o) entry.action = 'not on old page';
    row.sections[kind] = entry;
  }

  row.wordsAfter = blocks.reduce((m, b) => m + blockWords(b), 0);
  doc.blocks = blocks;
  if (WRITE) writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
  if (SHOW && p.includes(SHOW)) { console.log('===== RESULTING OUTLINE'); blocks.forEach((b, i) => { if (b.type === 'heading' || b.type === 'list') console.log('  ' + String(i).padStart(2) + ' [' + b.type + (b.level || '') + '] ' + (b.text || 'items:' + b.items.length + ' ' + JSON.stringify(b.items).slice(0, 70))); }); }
  report.push(row);
}

/* ---------------- summary ---------------- */
const ok = report.filter((r) => !r.error);
const restored = (k) => ok.filter((r) => r.sections[k]?.action === 'restored').length;
const restructured = (k) => ok.filter((r) => r.sections[k]?.action === 'restructured').length;
console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN'} — ${ok.length} service pages`);
console.log(`  documents restored : ${restored('docs')}  (+${restructured('docs')} restructured at equal words)`);
console.log(`  steps restored     : ${restored('steps')}  (+${restructured('steps')} restructured)`);
console.log(`  process restored   : ${restored('process')}  (+${restructured('process')} restructured)`);
console.log(`  structure fixes    : ${ok.reduce((m, r) => m + r.normalised, 0)} (on ${ok.filter((r) => r.normalised).length} pages)`);
const gaps = ok.filter((r) => Object.values(r.sections).some((s) => s.action === 'no section on new page'));
console.log(`  old section with no counterpart on the new page: ${gaps.length}`);
gaps.forEach((r) => console.log('     ' + r.path + '  ' + Object.entries(r.sections).filter(([, s]) => s.action === 'no section on new page').map(([k, s]) => `${k}(${s.oldWords}w)`).join(' ')));
console.log('\n  per page (old→new words: docs | steps | process; R = restored; N = structure fixes):');
for (const r of ok) {
  const cell = (k) => { const s = r.sections[k]; return `${String(s.oldWords).padStart(3)}→${String(s.newWords).padEnd(3)}${s.action === 'restored' ? 'R' : s.action === 'restructured' ? 'S' : ' '}`; };
  console.log(`  ${cell('docs')} ${cell('steps')} ${cell('process')} ${r.normalised ? 'N' + String(r.normalised).padEnd(2) : '   '} ${r.path}`);
}
report.filter((r) => r.error).forEach((r) => console.log(`  ERROR ${r.path}: ${r.error}`));
writeFileSync(join(ROOT, 'seo-audit/restore-report.json'), JSON.stringify(report, null, 2));
