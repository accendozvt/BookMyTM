// Precompute each route's last-modified date from git history into data/lastmod.json.
//
// Done at authoring time rather than in sitemap.ts because the site is deployed to
// Hostinger as a source zip with no .git directory, so `git log` is unavailable at
// build time on the server.
import { execSync } from 'child_process';
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const REPO = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM';
const APP = join(REPO, 'bookmytm-next');

const EXCLUDED = new Set(['test', '__home', 'contact', 'knowledge-base', 'about-us']);

function gitDate(relPath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, { cwd: REPO, encoding: 'utf8' }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function dateFor(absFile, relPath) {
  return gitDate(relPath) || (existsSync(absFile) ? statSync(absFile).mtime.toISOString() : new Date().toISOString());
}

const map = {};

// explicit app routes -> their page source
for (const [route, rel] of [
  ['/', 'bookmytm-next/app/page.tsx'],
  ['/about-us/', 'bookmytm-next/content/about-us.json'],
  ['/contact/', 'bookmytm-next/app/contact/page.tsx'],
  ['/knowledge-base/', 'bookmytm-next/app/knowledge-base/page.tsx'],
]) {
  map[route] = dateFor(join(REPO, rel), rel);
}

// catch-all content pages
for (const f of readdirSync(join(APP, 'content'))) {
  if (!f.endsWith('.json')) continue;
  const slug = f.replace(/\.json$/, '');
  if (EXCLUDED.has(slug)) continue;
  const route = slug === '__home' ? '/' : '/' + slug.replace(/__/g, '/') + '/';
  const rel = `bookmytm-next/content/${f}`;
  map[route] = dateFor(join(APP, 'content', f), rel);
}

// blog posts — prefer the post's own datePublished when git has no history for it
const idx = JSON.parse(readFileSync(join(APP, 'data/posts-index.json'), 'utf8'));
const bySlug = Object.fromEntries(idx.map((p) => [p.slug, p]));
for (const f of readdirSync(join(APP, 'content-posts'))) {
  if (!f.endsWith('.json')) continue;
  const slug = f.replace(/\.json$/, '');
  const rel = `bookmytm-next/content-posts/${f}`;
  const g = gitDate(rel);
  const published = bySlug[slug]?.datePublished;
  map['/' + slug + '/'] = g || (published ? new Date(published).toISOString() : dateFor(join(APP, 'content-posts', f), rel));
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(APP, 'data/lastmod.json'), JSON.stringify(sorted, null, 2) + '\n');

const fromGit = Object.values(sorted).filter(Boolean).length;
console.log(`wrote data/lastmod.json with ${Object.keys(sorted).length} routes (${fromGit} dated)`);
console.log('sample:', Object.entries(sorted).slice(0, 3).map(([k, v]) => `${k} -> ${v.slice(0, 10)}`).join('  |  '));
