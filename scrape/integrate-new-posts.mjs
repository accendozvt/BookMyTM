// Convert scrape/new-posts-data.mjs shorthand into content-posts JSON files,
// and append entries to posts-index.json and seo.json.
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { POSTS } from './new-posts-data.mjs';

const ROOT = join(import.meta.dirname, '..', 'bookmytm-next');
const CONTENT_DIR = join(ROOT, 'content-posts');
const INDEX_PATH = join(ROOT, 'data', 'posts-index.json');
const SEO_PATH = join(ROOT, 'data', 'seo.json');

function toBlocks(body) {
  const blocks = [];
  for (const item of body) {
    if ('p' in item) {
      blocks.push({ type: 'paragraph', text: item.p });
    } else if ('h2' in item) {
      blocks.push({ type: 'heading', level: 2, text: item.h2 });
    } else if ('ul' in item) {
      blocks.push({ type: 'list', ordered: false, items: item.ul });
    } else if ('faq' in item) {
      blocks.push({ type: 'faq', items: item.faq });
    } else {
      throw new Error('Unknown body item: ' + JSON.stringify(item));
    }
  }
  return blocks;
}

const index = JSON.parse(readFileSync(INDEX_PATH, 'utf8'));
const seo = JSON.parse(readFileSync(SEO_PATH, 'utf8'));

let created = 0;
for (const post of POSTS) {
  const featuredImage = `/images/blog/blog-${post.slug}.webp`;
  const blocks = [
    { type: 'heading', level: 1, text: post.title },
    ...toBlocks(post.body),
  ];

  const pageContent = {
    slug: post.slug,
    type: 'post',
    title: post.title,
    h1: post.title,
    datePublished: post.datePublished,
    featuredImage,
    blocks,
  };

  writeFileSync(
    join(CONTENT_DIR, `${post.slug}.json`),
    JSON.stringify(pageContent, null, 2) + '\n',
  );

  index.push({
    slug: post.slug,
    h1: post.title,
    datePublished: post.datePublished,
    featuredImage,
    blockCount: blocks.length,
  });

  seo[`/${post.slug}/`] = {
    title: post.metaTitle,
    description: post.metaDescription,
    canonical: `https://bookmytm.com/${post.slug}/`,
    noindex: false,
    targetKw: '',
  };

  created++;
}

writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n');
writeFileSync(SEO_PATH, JSON.stringify(seo, null, 2) + '\n');

console.log(`Created ${created} content-post JSON files.`);
console.log(`posts-index.json now has ${index.length} entries.`);
console.log(`seo.json now has ${Object.keys(seo).length} entries.`);
