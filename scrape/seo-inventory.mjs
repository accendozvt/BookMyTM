// Phase 0 — enumerate every prerendered route from the Next.js build output.
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, relative } from 'path';

const ROOT = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const base = join(ROOT, '.next/server/app');
const out = [];

(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) {
      const rel = relative(base, p).split(/[\\/]/).join('/').replace(/\.html$/, '');
      out.push('/' + rel);
    }
  }
})(base);

const routes = out.map((r) => (r === '/index' ? '/' : r + '/')).sort();
const posts = new Set(readdirSync(join(ROOT, 'content-posts')).map((f) => '/' + f.replace('.json', '') + '/'));

const legal = /privacy-policy|terms-and-conditions|cancellation-refund/;
const groups = { top: [], service: [], blog: [], legal: [], other: [] };

for (const r of routes) {
  if (['/', '/about-us/', '/contact/', '/knowledge-base/', '/_not-found/'].includes(r)) groups.top.push(r);
  else if (legal.test(r)) groups.legal.push(r);
  else if (posts.has(r)) groups.blog.push(r);
  else if (r.split('/').filter(Boolean).length >= 2) groups.service.push(r);
  else groups.other.push(r);
}

mkdirSync(join(ROOT, '..', 'seo-audit'), { recursive: true });
writeFileSync(join(ROOT, '..', 'seo-audit', 'route-inventory.txt'), routes.join('\n') + '\n');

console.log('Top-level app routes : ' + groups.top.length);
console.log('Service hubs + leaves: ' + groups.service.length);
console.log('Blog posts           : ' + groups.blog.length);
console.log('Legal / policy       : ' + groups.legal.length);
console.log('Other single-segment : ' + groups.other.length);
console.log('TOTAL PRERENDERED    : ' + routes.length);

console.log('\n--- Top-level ---');
groups.top.forEach((r) => console.log('  ' + r));
console.log('--- Legal ---');
groups.legal.forEach((r) => console.log('  ' + r));
console.log('--- Other single-segment (' + groups.other.length + ') ---');
groups.other.forEach((r) => console.log('  ' + r));
console.log('--- Service, top 2 levels (sample) ---');
groups.service.filter((r) => r.split('/').filter(Boolean).length <= 2).forEach((r) => console.log('  ' + r));
console.log('--- Service leaves: ' + groups.service.filter((r) => r.split('/').filter(Boolean).length > 2).length + ' deeper pages (full list in seo-audit/route-inventory.txt) ---');
