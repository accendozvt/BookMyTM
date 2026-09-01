import type { Metadata } from 'next';
import { SITE } from './site';

/** Site-wide social preview card (1200x630 WebP, generated at build-time by scrape/). */
export const OG_FALLBACK = { url: '/assets/opengraph/preview.webp', width: 1200, height: 630 };

/** Open Graph locale form of the site's primary locale (en-IN -> en_IN). */
export const OG_LOCALE = 'en_IN';

function mimeFor(url: string): string | undefined {
  if (/\.webp(\?|$)/i.test(url)) return 'image/webp';
  if (/\.jpe?g(\?|$)/i.test(url)) return 'image/jpeg';
  if (/\.png(\?|$)/i.test(url)) return 'image/png';
  return undefined;
}

export type BuildMetadataArgs = {
  /** Absolute site path with leading and trailing slash, e.g. '/about-us/'. */
  path: string;
  title: string;
  description: string;
  /** Keeps the page out of the index (private/utility pages, and the 404). */
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Page-specific social image; falls back to the site preview card. */
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  publishedTime?: string;
};

/**
 * Single source of truth for every public page's head metadata.
 *
 * Centralised because Next replaces (rather than deep-merges) the `openGraph`
 * and `twitter` objects per route — so each route that declares them has to
 * declare them in full, and duplicating that across six files is how tags like
 * og:locale went missing on all 141 pages.
 */
export function buildMetadata(a: BuildMetadataArgs): Metadata {
  const canonical = SITE.url + a.path;
  const image = a.image || OG_FALLBACK.url;
  // Only claim dimensions we actually measured; a wrong width/height makes
  // social platforms render a broken or badly cropped preview.
  const width = a.image ? a.imageWidth : OG_FALLBACK.width;
  const height = a.image ? a.imageHeight : OG_FALLBACK.height;
  const alt = a.imageAlt || `${a.title} – ${SITE.name}`;
  const type = mimeFor(image);

  return {
    title: a.title,
    description: a.description,
    alternates: { canonical },
    robots: a.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: a.type ?? 'website',
      siteName: SITE.name,
      locale: OG_LOCALE,
      url: canonical,
      title: a.title,
      description: a.description,
      images: [
        {
          url: image,
          ...(width ? { width } : {}),
          ...(height ? { height } : {}),
          alt,
          ...(type ? { type } : {}),
        },
      ],
      ...(a.publishedTime ? { publishedTime: a.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: a.title,
      description: a.description,
      images: [{ url: image, alt }],
    },
  };
}
