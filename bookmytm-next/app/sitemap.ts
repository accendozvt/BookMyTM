import type { MetadataRoute } from 'next';
import { listContentSlugs, listPostSlugs, fileSlugToPath } from '@/lib/content';
import { SITE } from '@/lib/site';
import lastmod from '@/data/lastmod.json';

export const dynamic = 'force-static';

/**
 * Route -> last-commit date, precomputed by scrape/generate-lastmod.mjs.
 * Deployment ships a source zip with no .git, so git history isn't readable here.
 *
 * Imported rather than read with readFileSync(process.cwd()): on Hostinger that
 * read ran again at request time with a different working directory and threw,
 * making /sitemap.xml return 500 in production even though the build succeeded.
 * A static import is inlined at build time and cannot fail at runtime.
 */
const LASTMOD = lastmod as Record<string, string>;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/about-us/',
    '/contact/',
    '/knowledge-base/',
    ...listContentSlugs().map(fileSlugToPath),
    ...listPostSlugs().map((s) => `/${s}/`),
  ];

  // De-dupe defensively: a content file and a post slug must never both claim a path.
  const seen = new Set<string>();

  return routes
    .filter((p) => (seen.has(p) ? false : (seen.add(p), true)))
    .sort()
    .map((p) => ({
      url: SITE.url + p,
      // priority and changeFrequency are deliberately omitted — Google ignores both.
      ...(LASTMOD[p] ? { lastModified: new Date(LASTMOD[p]) } : {}),
    }));
}
