import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; rows: string[][] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'imageBox'; src: string; alt: string; title: string; text: string }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'quote'; text: string }
  | { type: 'cta'; text: string; href: string }
  | { type: 'form' }
  | { type: 'map' };

export type PageContent = {
  slug: string;
  type?: 'post';
  title: string;
  h1: string;
  datePublished?: string;
  featuredImage?: string;
  blocks: Block[];
};

export type PostMeta = {
  slug: string;
  h1: string;
  datePublished: string;
  featuredImage: string;
  blockCount: number;
};

const CONTENT_DIR = join(process.cwd(), 'content');
const SEO = JSON.parse(readFileSync(join(process.cwd(), 'data', 'seo.json'), 'utf8')) as Record<
  string,
  { title: string; description: string; canonical: string; noindex: boolean; targetKw: string }
>;

const IMAGE_MANIFEST = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'image-manifest.json'), 'utf8'),
) as Record<string, string>;

/** slugs we don't build in the catch-all (junk/handled by dedicated routes) */
const EXCLUDED = new Set(['test', '__home', 'contact', 'knowledge-base', 'about-us']);

const POSTS_DIR = join(process.cwd(), 'content-posts');

export function listPostSlugs(): string[] {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function loadPost(slug: string): PageContent | null {
  try {
    const raw = JSON.parse(readFileSync(join(POSTS_DIR, slug + '.json'), 'utf8')) as PageContent;
    raw.blocks = raw.blocks.map(localizeBlockImages);
    if (raw.featuredImage) raw.featuredImage = localizeSrc(raw.featuredImage);
    return raw;
  } catch {
    return null;
  }
}

export function listPosts(): PostMeta[] {
  const idx = JSON.parse(readFileSync(join(process.cwd(), 'data', 'posts-index.json'), 'utf8')) as PostMeta[];
  return idx
    .map((p) => ({ ...p, featuredImage: localizeSrc(p.featuredImage) }))
    .sort((a, b) => (b.datePublished || '').localeCompare(a.datePublished || ''));
}

export function fileSlugToPath(slug: string): string {
  return slug === '__home' ? '/' : '/' + slug.replace(/__/g, '/') + '/';
}

export function pathToFileSlug(segments: string[]): string {
  return segments.join('__');
}

export function listContentSlugs(): string[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .filter((s) => !EXCLUDED.has(s));
}

export function loadContent(fileSlug: string): PageContent | null {
  try {
    const raw = JSON.parse(readFileSync(join(CONTENT_DIR, fileSlug + '.json'), 'utf8')) as PageContent;
    raw.blocks = raw.blocks.map(localizeBlockImages);
    return raw;
  } catch {
    return null;
  }
}

function localizeSrc(src: string): string {
  if (!src) return src;
  const abs = src.startsWith('http') ? src : 'https://bookmytm.com' + src;
  return IMAGE_MANIFEST[abs] || src;
}

function localizeBlockImages(b: Block): Block {
  if (b.type === 'image' || b.type === 'imageBox') return { ...b, src: localizeSrc(b.src) };
  return b;
}

export function seoFor(path: string) {
  return SEO[path] || null;
}
