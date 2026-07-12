// Convert the seopress CSV export into bookmytm-next/data/seo.json keyed by page path.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const CSV = process.argv[2];
const raw = readFileSync(CSV, 'utf8');

// crude CSV-with-semicolons parser handling quoted fields
function parseLine(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ';') { cols.push(cur); cur = ''; }
      else cur += c;
    }
  }
  cols.push(cur);
  return cols;
}

const lines = raw.split(/\r?\n/).filter(Boolean);
const header = parseLine(lines[0]);
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const out = {};
for (const line of lines.slice(1)) {
  const c = parseLine(line);
  if (c[idx.post_type] !== 'page' && c[idx.post_type] !== 'post') continue;
  const url = c[idx.url];
  if (!url) continue;
  const path = decodeURIComponent(new URL(url).pathname); // e.g. /about-us/
  const resolveVars = (s) =>
    (s || '')
      .replace(/%%post_title%%/g, c[idx.post_title] || '')
      .replace(/%%sitetitle%%/g, 'BookMyTM')
      .replace(/\s*%%sep%%\s*/g, ' | ')
      .replace(/%%[a-z_]+%%/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  out[path] = {
    title: resolveVars(c[idx.meta_title]) || c[idx.post_title],
    description: resolveVars(c[idx.meta_desc]) || '',
    canonical: c[idx.canonical_url] || url,
    noindex: c[idx.noindex] === '1',
    targetKw: c[idx.target_kw] || '',
  };
}
const dest = join(import.meta.dirname, '..', 'bookmytm-next', 'data');
mkdirSync(dest, { recursive: true });
writeFileSync(join(dest, 'seo.json'), JSON.stringify(out, null, 2));
console.log('Wrote seo.json with', Object.keys(out).length, 'entries');
