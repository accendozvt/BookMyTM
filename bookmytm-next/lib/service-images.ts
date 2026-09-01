import serviceImages from '@/data/service-images.json';

/**
 * Per-page banner image for the service pages.
 *
 * Replaces the old CATEGORY_IMAGES regex table, where 8 stock photos were shared
 * across 84 pages (one image appeared on 16 of them). Each page now has its own
 * image and its own descriptive alt text, generated from that page's subject.
 *
 * Static import rather than a runtime file read — see the note in app/sitemap.ts
 * about readFileSync(process.cwd()) failing in production on Hostinger.
 */
const IMAGES = serviceImages as Record<string, { src: string; alt: string }>;

/** Shown when a page has no dedicated image yet. */
const FALLBACK = {
  src: '/images/kerala_startup_trademark_16x9_v2.webp',
  alt: 'BookMyTM business and trademark services for Indian companies',
};

export function serviceImageFor(path: string): { src: string; alt: string } {
  return IMAGES[path] ?? FALLBACK;
}
