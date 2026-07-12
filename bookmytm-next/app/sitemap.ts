import type { MetadataRoute } from 'next';
import { listContentSlugs, listPosts, fileSlugToPath } from '@/lib/content';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/about-us/', '/contact/', '/knowledge-base/', ...listContentSlugs().map(fileSlugToPath)].map((p) => ({
    url: SITE.url + p,
    changeFrequency: 'monthly' as const,
    priority: p === '/' ? 1 : p.split('/').filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
  const posts = listPosts().map((p) => ({
    url: `${SITE.url}/${p.slug}/`,
    lastModified: p.datePublished ? new Date(p.datePublished) : undefined,
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));
  return [...pages, ...posts];
}
