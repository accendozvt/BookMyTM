// Export pages whose title/description falls outside target length, with the real
// on-page content needed to rewrite them (H1 + lead paragraph).
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const rows = JSON.parse(readFileSync('D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/meta-audit.json', 'utf8'))
  .filter((r) => r.route !== '/_not-found/');

const postSlugs = new Set(readdirSync(join(ROOT, 'content-posts')).map((f) => f.replace('.json', '')));
const isMal = (s) => /[\u0D00-\u0D7F]/.test(s);

function fileFor(route) {
  const segs = route.split('/').filter(Boolean);
  if (segs.length === 1 && postSlugs.has(segs[0])) return join(ROOT, 'content-posts', segs[0] + '.json');
  const f = join(ROOT, 'content', segs.join('__') + '.json');
  return existsSync(f) ? f : null;
}

function contentOf(route) {
  const f = fileFor(route);
  if (!f || !existsSync(f)) return { h1: '', lead: '' };
  const j = JSON.parse(readFileSync(f, 'utf8'));
  const lead = (j.blocks || []).find(
    (b) => b.type === 'paragraph' && b.text.length > 60 && !/drop a mail|whatsapp|request callback|written by|reading time/i.test(b.text),
  );
  return { h1: j.h1 || j.title || '', lead: lead ? lead.text : '' };
}

const group = (r) =>
  isMal(r.title + r.desc) ? 'malayalam'
    : postSlugs.has(r.route.replace(/\//g, '')) ? 'blog'
    : r.route.split('/').filter(Boolean).length >= 2 ? 'service' : 'hub';

const want = process.argv[2] || 'service';
const out = rows
  .filter((r) => r.title.length < 50 || r.title.length > 60 || r.desc.length < 140 || r.desc.length > 160)
  .filter((r) => group(r) === want)
  .map((r) => {
    const c = contentOf(r.route);
    return {
      route: r.route,
      t: r.title, tl: r.title.length,
      d: r.desc, dl: r.desc.length,
      h1: c.h1,
      lead: c.lead.slice(0, 260),
    };
  });

writeFileSync(`D:/Google Drive/Work/Accendoz/Projects/BookMyTM/seo-audit/offenders-${want}.json`, JSON.stringify(out, null, 2));
console.log(`${want}: ${out.length} pages`);
out.forEach((r, i) => {
  console.log(`\n[${i + 1}] ${r.route}`);
  console.log(`  T(${r.tl}) ${r.t}`);
  console.log(`  D(${r.dl}) ${r.d.slice(0, 150)}${r.d.length > 150 ? '…' : ''}`);
  if (r.h1) console.log(`  H1  ${r.h1.slice(0, 90)}`);
  if (r.lead) console.log(`  LEAD ${r.lead.slice(0, 165)}…`);
});
