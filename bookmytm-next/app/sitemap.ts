import type { MetadataRoute } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { listContentSlugs, listPostSlugs, fileSlugToPath } from '@/lib/content';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Route -> last-commit date, precomputed by scrape/generate-lastmod.mjs.
 * Deployment ships a source zip with no .git, so git history isn't readable here.
 */
const LASTMOD = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'lastmod.json'), 'utf8'),
) as Record<string, string>;

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
