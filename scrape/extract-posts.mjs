// Extract blog posts: article body from the non-header/footer wp-post Elementor doc.
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const HTML_DIR = join(import.meta.dirname, 'html-posts');
const OUT_DIR = join(import.meta.dirname, 'data-posts');
mkdirSync(OUT_DIR, { recursive: true });

const HEADER_FOOTER_IDS = new Set(['1419', '1449']);
const postImages = new Map();

const cleanText = (t) => t.replace(/\s+/g, ' ').trim();

function realSrc($img) {
  const a = $img.attr() || {};
  let src = a['data-src'] || a['data-lazy-src'] || a.src || '';
  if (src.startsWith('data:')) src = '';
  if (!src && (a['data-srcset'] || a.srcset)) {
    const first = (a['data-srcset'] || a.srcset).split(',')[0].trim().split(' ')[0];
    if (first && !first.startsWith('data:')) src = first;
  }
  return src;
}

function collectImage(src, alt, slug) {
  if (!src || src.startsWith('data:')) return;
  const abs = src.startsWith('http') ? src : 'https://bookmytm.com' + src;
  if (!postImages.has(abs)) postImages.set(abs, { alt: alt || '', pages: [] });
  postImages.get(abs).pages.push(slug);
}

function flatten($, root, slug, blocks) {
  const walk = (el) => {
    const node = $(el);
    const tag = el.tagName?.toLowerCase();
    if (!tag || ['style', 'script', 'link', 'noscript', 'svg', 'iframe'].includes(tag)) return;
    if (/^h[1-6]$/.test(tag)) {
      const text = cleanText(node.text());
      if (text) blocks.push({ type: 'heading', level: +tag[1], text });
      return;
    }
    if (tag === 'p') {
      const text = cleanText(node.text());
      if (text) blocks.push({ type: 'paragraph', text });
      node.find('img').each((_, im) => {
        const s = realSrc($(im));
        collectImage(s, $(im).attr('alt'), slug);
        if (s) blocks.push({ type: 'image', src: s, alt: $(im).attr('alt') || '' });
      });
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      node.children('li').each((_, li) => {
        const t = cleanText($(li).text());
        if (t) items.push(t);
      });
      if (items.length) blocks.push({ type: 'list', ordered: tag === 'ol', items });
      return;
    }
    if (tag === 'table') {
      const rows = [];
      node.find('tr').each((_, tr) => {
        const cells = [];
        $(tr).find('td,th').each((_, td) => cells.push(cleanText($(td).text())));
        if (cells.some(Boolean)) rows.push(cells);
      });
      if (rows.length) blocks.push({ type: 'table', rows });
      return;
    }
    if (tag === 'img') {
      const src = realSrc(node);
      collectImage(src, node.attr('alt'), slug);
      if (src) blocks.push({ type: 'image', src, alt: node.attr('alt') || '' });
      return;
    }
    if (tag === 'blockquote') {
      const text = cleanText(node.text());
      if (text) blocks.push({ type: 'quote', text });
      return;
    }
    node.children().each((_, c) => walk(c));
    if (tag === 'div' || tag === 'section' || tag === 'span') {
      const own = node.contents().filter((_, c) => c.type === 'text').text();
      const t = cleanText(own);
      if (t && t.length > 40) blocks.push({ type: 'paragraph', text: t });
    }
  };
  root.children().each((_, c) => walk(c));
}

const files = readdirSync(HTML_DIR).filter((f) => f.endsWith('.html'));
const index = [];
for (const f of files) {
  const slug = decodeURIComponent(f.replace(/\.html$/, ''));
  const html = readFileSync(join(HTML_DIR, f), 'utf8');
  const $ = cheerio.load(html);

  let article = null;
  $('[data-elementor-type="wp-post"]').each((_, el) => {
    const id = $(el).attr('data-elementor-id');
    if (!HEADER_FOOTER_IDS.has(id)) article = $(el);
  });

  const blocks = [];
  if (article) flatten($, article, slug, blocks);
  const entry = $('.entry-content').first();
  if (!blocks.length && entry.length) flatten($, entry, slug, blocks);

  // metadata
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  if (ogImage) collectImage(ogImage, 'featured', slug);
  let datePublished = $('meta[property="article:published_time"]').attr('content') || '';
  if (!datePublished) {
    $('script[type="application/ld+json"]').each((_, s) => {
      if (datePublished) return;
      try {
        const j = JSON.parse($(s).text());
        const graph = j['@graph'] || [j];
        for (const n of graph) {
          if (n.datePublished) { datePublished = n.datePublished; break; }
        }
      } catch {}
    });
  }
  const title = cleanText($('title').text());
  const h1 = cleanText($('h1').first().text());

  const data = { slug, type: 'post', title, h1, datePublished, featuredImage: ogImage, blocks };
  writeFileSync(join(OUT_DIR, slug + '.json'), JSON.stringify(data, null, 2));
  index.push({ slug, h1: h1 || title, datePublished, featuredImage: ogImage, blockCount: blocks.length });
}
writeFileSync(join(import.meta.dirname, 'posts-index.json'), JSON.stringify(index, null, 2));
writeFileSync(join(import.meta.dirname, 'post-images.json'),
  JSON.stringify([...postImages.entries()].map(([url, v]) => ({ url, ...v })), null, 2));
console.log(`Extracted ${files.length} posts | images: ${postImages.size}`);
index.filter((p) => p.blockCount < 5).forEach((p) => console.log('LOW CONTENT:', p.slug, p.blockCount));
