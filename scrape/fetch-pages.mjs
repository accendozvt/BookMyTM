// Fetch all page URLs from the SEO CSV and save raw HTML.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const CSV = process.argv[2];
const OUT = join(import.meta.dirname, 'html');
mkdirSync(OUT, { recursive: true });

const lines = readFileSync(CSV, 'utf8').split('\n').slice(1);
const urls = [];
for (const line of lines) {
  const cols = line.split(';');
  if (cols[5] === 'page' && cols[2]) urls.push(cols[2].trim());
}
console.log(`Found ${urls.length} page URLs`);

function slugFor(url) {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '');
  return path === '' ? '__home' : path.replace(/\//g, '__');
}

const results = { ok: [], fail: [] };
const CONCURRENCY = 6;
let i = 0;

async function worker() {
  while (i < urls.length) {
    const url = urls[i++];
    const slug = slugFor(url);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126 Safari/537.36' },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      writeFileSync(join(OUT, slug + '.html'), html);
      results.ok.push(url);
      console.log(`OK  ${slug} (${(html.length / 1024).toFixed(0)}kb)`);
    } catch (e) {
      results.fail.push({ url, error: String(e.message || e) });
      console.log(`ERR ${slug}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 250));
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(join(import.meta.dirname, 'fetch-report.json'), JSON.stringify(results, null, 2));
console.log(`\nDone: ${results.ok.length} ok, ${results.fail.length} failed`);
