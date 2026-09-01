// List every inner page that actually renders the section banner image,
// with the H1/lead needed to write a page-specific prompt.
import { readFileSync, readdirSync } from 'fs';
import fs2 from 'fs';
import { join } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const EXCLUDED = new Set(['test', '__home', 'contact', 'knowledge-base', 'about-us']);
const NO_FORM = new Set(['privacy-policy', 'terms-and-conditions', 'cancellation-refund-policy', 'about-us']);

// mirrors lib/site.ts childrenFor(): a page with children and no body is a hub
const siteSrc = readFileSync(join(APP, 'lib/site.ts'), 'utf8');
const navHrefs = [...siteSrc.matchAll(/href: '([^']+)'/g)].map((m) => m[1]);
const isParentOf = (path) => navHrefs.some((h) => h !== path && h.startsWith(path));

const BOILER = /drop a mail|whatsapp|request callback|call expert|available on/i;
const rows = [];

for (const f of readdirSync(join(APP, 'content'))) {
  if (!f.endsWith('.json')) continue;
  const slug = f.replace(/\.json$/, '');
  if (EXCLUDED.has(slug)) continue;
  const route = '/' + slug.replace(/__/g, '/') + '/';
  const j = JSON.parse(readFileSync(join(APP, 'content', f), 'utf8'));

  // body = blocks after the hero; a hub has effectively none
  const body = (j.blocks || []).filter(
    (b) => !(b.type === 'heading' && b.level === 1) && !(b.type === 'cta') && !((b.type === 'paragraph' || b.type === 'heading') && BOILER.test(b.text || '')),
  );
  const isHub = body.length <= 1 && isParentOf(route);
  const isLegal = NO_FORM.has(slug);
  if (isHub || isLegal) continue;

  const h1 = j.h1 || j.title || '';
  const lead = (j.blocks || []).find((b) => b.type === 'paragraph' && (b.text || '').length > 80 && !BOILER.test(b.text));
  rows.push({ route, slug, h1: h1.replace(/\s*[-–]\s*BookMyTM.*$/i, '').trim(), lead: (lead?.text || '').slice(0, 180) });
}

rows.sort((a, b) => a.route.localeCompare(b.route));
console.log('pages rendering a section banner: ' + rows.length + '\n');
rows.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.route}\n    H1: ${r.h1.slice(0, 78)}`));
fs2.writeFileSync('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/inner-pages.json', JSON.stringify(rows, null, 2));
