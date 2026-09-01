import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // Googlebot must be able to fetch the CSS and JS bundles to render the
          // page; the previous blanket "Disallow: /_next/" hid them and risked
          // Google seeing an unstyled, half-rendered site.
          '/_next/static/',
          '/_next/image',
        ],
        disallow: ['/api/', '/_next/'],
      },
      {
        // Explicit AI-crawler policy: allowed, as agreed for a marketing site.
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'anthropic-ai',
          'Claude-User',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
          'Applebot-Extended',
        ],
        allow: '/',
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
