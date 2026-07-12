// Extract structured content from scraped Elementor pages.
// Output: scrape/data/<slug>.json  — ordered block stream + image inventory.
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const HTML_DIR = join(import.meta.dirname, 'html');
const OUT_DIR = join(import.meta.dirname, 'data');
mkdirSync(OUT_DIR, { recursive: true });

const allImages = new Map(); // url -> {alt, pages:[]}

function cleanText(t) {
  return t.replace(/\s+/g, ' ').trim();
}

function collectImage(src, alt, slug) {
  if (!src || src.startsWith('data:')) return;
  const abs = src.startsWith('http') ? src : 'https://bookmytm.com' + src;
  if (!allImages.has(abs)) allImages.set(abs, { alt: alt || '', pages: [] });
  allImages.get(abs).pages.push(slug);
}

// Resolve real src from lazy-load attributes.
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

// Flatten arbitrary HTML (from text-editor or custom html widgets) into blocks.
function flattenContent($, root, slug, blocks) {
  const walk = (el) => {
    const node = $(el);
    const tag = el.tagName?.toLowerCase();
    if (!tag) return;
    if (tag === 'style' || tag === 'script' || tag === 'link' || tag === 'noscript') return;

    if (/^h[1-6]$/.test(tag)) {
      const text = cleanText(node.text());
      if (text) blocks.push({ type: 'heading', level: +tag[1], text });
      return;
    }
    if (tag === 'p') {
      const text = cleanText(node.text());
      if (text) blocks.push({ type: 'paragraph', text });
      node.find('img').each((_, img) => collectImage($(img).attr('src'), $(img).attr('alt'), slug));
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
      if (src && !src.startsWith('data:')) blocks.push({ type: 'image', src, alt: node.attr('alt') || '' });
      return;
    }
    if (tag === 'a') {
      const href = node.attr('href') || '';
      const text = cleanText(node.text());
      // standalone CTA links (buttons)
      if (text && /apply|contact|get|start|explore|call|whatsapp/i.test(text) && text.length < 60) {
        blocks.push({ type: 'cta', text, href });
        return;
      }
    }
    // FAQ accordion button pattern from custom HTML (btm-btn + btm-content)
    if (node.hasClass('btm-item')) {
      const q = cleanText(node.find('button, .btm-btn').first().text()).replace(/▼|▲/g, '').trim();
      const a = cleanText(node.find('.btm-inner, .btm-content').first().text());
      if (q && a) { blocks.push({ type: 'faqItem', q, a }); return; }
    }
    // FAQ card pattern: .faq-item / .accordion-item with h3/h4 question + .faq-answer div
    if (node.hasClass('faq-item') || node.hasClass('accordion-item')) {
      const q = cleanText(node.find('h3,h4,h5,summary,button,.faq-question,.accordion-title').first().text());
      const ansEl = node.find('.faq-answer, .accordion-content, .accordion-body').first();
      const a = cleanText(ansEl.length ? ansEl.text() : node.clone().children('h3,h4,h5,summary,button').remove().end().text().replace(q, ''));
      if (q && a) { blocks.push({ type: 'faqItem', q, a }); return; }
    }
    node.children().each((_, c) => walk(c));
    // capture bare text nodes living directly in container divs (e.g. answers not wrapped in <p>)
    if (tag === 'div' || tag === 'section' || tag === 'span') {
      const own = node
        .contents()
        .filter((_, c) => c.type === 'text')
        .text();
      const t = cleanText(own);
      if (t && t.length > 40) blocks.push({ type: 'paragraph', text: t });
    }
  };
  root.children().each((_, c) => walk(c));
}

function extractPage(file) {
  const slug = file.replace(/\.html$/, '');
  const html = readFileSync(join(HTML_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  let doc = $('[data-elementor-type="wp-page"]').first();
  const blocks = [];

  // Gutenberg fallback (legal pages): flatten .entry-content directly
  if (!doc.length || !doc.find('[data-widget_type]').length) {
    const entry = $('.entry-content').first();
    if (entry.length && cleanText(entry.text())) {
      flattenContent($, entry, slug, blocks);
    }
  }

  doc.find('[data-widget_type]').each((_, el) => {
    const w = $(el);
    // skip nested widgets inside another widget we already processed wholesale
    const wtype = w.attr('data-widget_type');
    const container = w.find('.elementor-widget-container').first();
    const target = container.length ? container : w;

    switch (wtype) {
      case 'heading.default': {
        const h = target.find('h1,h2,h3,h4,h5,h6,p,div,span').first();
        const tag = h[0]?.tagName?.toLowerCase() || 'h2';
        const text = cleanText(target.text());
        if (text) blocks.push({ type: 'heading', level: /^h[1-6]$/.test(tag) ? +tag[1] : 2, text });
        break;
      }
      case 'text-editor.default':
      case 'html.default': {
        flattenContent($, target, slug, blocks);
        break;
      }
      case 'image-box.default': {
        const img = target.find('img').first();
        collectImage(realSrc(img), img.attr('alt'), slug);
        blocks.push({
          type: 'imageBox',
          src: realSrc(img) || '',
          alt: img.attr('alt') || '',
          title: cleanText(target.find('.elementor-image-box-title').text()),
          text: cleanText(target.find('.elementor-image-box-description').text()),
        });
        break;
      }
      case 'nested-accordion.default': {
        const items = [];
        target.find('details').each((_, d) => {
          const q = cleanText($(d).find('summary').text());
          const a = cleanText($(d).children().not('summary').text());
          if (q) items.push({ q, a });
        });
        if (items.length) blocks.push({ type: 'faq', items });
        break;
      }
      case 'icon-list.default': {
        const items = [];
        target.find('li').each((_, li) => {
          const t = cleanText($(li).text());
          if (t) items.push(t);
        });
        if (items.length) blocks.push({ type: 'list', ordered: false, items });
        break;
      }
      case 'image.default': {
        const img = target.find('img').first();
        collectImage(realSrc(img), img.attr('alt'), slug);
        blocks.push({ type: 'image', src: realSrc(img) || '', alt: img.attr('alt') || '' });
        break;
      }
      case 'form.default': blocks.push({ type: 'form' }); break;
      case 'google_maps.default': blocks.push({ type: 'map' }); break;
      case 'divider.default': case 'spacer.default': break;
    }
  });

  // also collect og:image and any content images with srcset
  doc.find('img').each((_, img) => collectImage(realSrc($(img)), $(img).attr('alt'), slug));
  const og = $('meta[property="og:image"]').attr('content');
  if (og) collectImage(og, 'og:image', slug);

  // consolidate consecutive faqItem blocks into faq
  const merged = [];
  for (const b of blocks) {
    if (b.type === 'faqItem') {
      const last = merged[merged.length - 1];
      if (last?.type === 'faq') last.items.push({ q: b.q, a: b.a });
      else merged.push({ type: 'faq', items: [{ q: b.q, a: b.a }] });
    } else merged.push(b);
  }

  // JS-rendered FAQs: pull q/a pairs from inline script data arrays
  if (!merged.some((b) => b.type === 'faq')) {
    const m = html.match(/(?:const|var|let)\s+\w+\s*=\s*(\[\s*\{\s*q\s*:[\s\S]*?\}\s*\])\s*;/);
    if (m) {
      try {
        const items = new Function('return ' + m[1])().map((it) => ({
          q: cleanText(String(it.q)).replace(/^\d+\.\s*/, ''),
          a: cleanText(String(it.a)),
        })).filter((it) => it.q && it.a);
        if (items.length) {
          const hi = merged.findIndex((b) => b.type === 'heading' && /frequently asked|faq/i.test(b.text));
          if (hi >= 0) merged.splice(hi + 1, 0, { type: 'faq', items });
          else merged.push({ type: 'heading', level: 2, text: 'Frequently Asked Questions' }, { type: 'faq', items });
        }
      } catch { /* malformed script data — skip */ }
    }
  }

  const title = cleanText($('title').text());
  const h1 = cleanText($('h1').first().text());

  return { slug, title, h1, blocks: merged };
}

const files = readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
let blockTotal = 0;
for (const f of files) {
  const data = extractPage(f);
  blockTotal += data.blocks.length;
  writeFileSync(join(OUT_DIR, data.slug + '.json'), JSON.stringify(data, null, 2));
}
writeFileSync(join(import.meta.dirname, 'images.json'),
  JSON.stringify([...allImages.entries()].map(([url, v]) => ({ url, ...v })), null, 2));
console.log(`Extracted ${files.length} pages, ${blockTotal} blocks, ${allImages.size} unique images`);
