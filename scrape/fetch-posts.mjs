// Fetch all blog post URLs and save raw HTML to html-posts/.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const urls = JSON.parse(readFileSync(join(import.meta.dirname, 'post-urls.json'), 'utf8'));
const OUT = join(import.meta.dirname, 'html-posts');
mkdirSync(OUT, { recursive: true });

const results = { ok: [], fail: [] };
let i = 0;

async function worker() {
  while (i < urls.length) {
    const url = urls[i++];
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, '');
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126 Safari/537.36' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(join(OUT, slug + '.html'), await res.text());
      results.ok.push(url);
      console.log('OK ', slug);
    } catch (e) {
      results.fail.push({ url, error: String(e.message) });
      console.log('ERR', slug, e.message);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Done: ${results.ok.length} ok, ${results.fail.length} failed`);
