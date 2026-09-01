// Find genuine same-breakpoint Tailwind class collisions (e.g. "p-5.5 p-6"),
// ignoring legitimate responsive pairs like "py-16 md:py-20".
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const files = [];
for (const root of ['app', 'components']) {
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx$/.test(e)) files.push(p);
    }
  })(join(APP, root));
}

// key = variant prefix + utility family, so md:py-20 and py-16 never collide
const keyOf = (c) => {
  const m = c.match(/^((?:[a-z-]+:)*)(.+)$/);
  const variants = m[1];
  const util = m[2].replace(/-?[\d.]+(\/\d+)?$/, '').replace(/\/\d+$/, '');
  return variants + '|' + util;
};

const FAMILIES = /\|(p|px|py|pb|pt|pl|pr|m|mt|mb|h|w|bg-white|border-gray|text-gray)$/;
let found = 0;

for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(/className="([^"]+)"/);
    if (!m) return;
    const cls = m[1].split(/\s+/).filter(Boolean);
    const problems = [];
    const seen = new Set();
    const groups = {};
    for (const c of cls) {
      if (seen.has(c)) problems.push(`duplicate "${c}"`);
      seen.add(c);
      const k = keyOf(c);
      (groups[k] = groups[k] || []).push(c);
    }
    for (const [k, v] of Object.entries(groups)) {
      if (v.length > 1 && new Set(v).size > 1 && FAMILIES.test(k)) problems.push(`conflict "${v.join(' ')}"`);
    }
    if (problems.length) {
      found += problems.length;
      console.log(`${f.replace(APP + '\\', '').split('\\').join('/')}:${i + 1}  ${problems.join(' ; ')}`);
    }
  });
}
console.log(`\n${found} genuine class collisions`);
