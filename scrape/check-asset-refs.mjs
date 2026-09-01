// Every /images/... and /assets/... path written anywhere in the app must resolve
// to a real file in public/. Catches renames that miss a reference — the WebP
// conversion left /images/logo.png referenced by the footer and by JSON-LD after
// the file had been deleted, which would have 404'd the logo on all 141 pages.
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const PUB = join(APP, 'public');
const problems = [];
let checked = 0;

const scan = (file) => {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/["'`(]((?:\/images|\/assets)\/[\w\-./]+\.(?:jpe?g|png|webp|svg|ico))/gi)) {
    checked++;
    const rel = m[1];
    if (!existsSync(join(PUB, rel.replace(/^\//, '')))) {
      problems.push(`${relative(APP, file)} -> ${rel}`);
    }
  }
};

const walk = (d, re) => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, re);
    else if (re.test(e)) scan(p);
  }
};

walk(join(APP, 'app'), /\.(tsx?|mjs|css)$/);
walk(join(APP, 'components'), /\.(tsx?)$/);
walk(join(APP, 'lib'), /\.(tsx?)$/);
walk(join(APP, 'content'), /\.json$/);
walk(join(APP, 'content-posts'), /\.json$/);
walk(join(APP, 'data'), /\.json$/);

console.log(`asset references checked: ${checked}`);
console.log(problems.length ? `BROKEN (${problems.length}):\n  ` + [...new Set(problems)].join('\n  ') : 'All asset references resolve.');
process.exit(problems.length ? 1 : 0);
