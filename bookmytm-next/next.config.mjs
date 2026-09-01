/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served via `next start` on Hostinger's Node.js hosting (not static export) —
  // every page is still statically pre-rendered at build time via generateStaticParams,
  // this just changes how the pre-rendered HTML is served (Node process vs. plain files).
  trailingSlash: true,
  images: { unoptimized: true },
  // Don't advertise the framework/version in a response header.
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Inline the (small, ~9 KiB) global stylesheet into the HTML instead of a
    // render-blocking <link> — removes the only critical-path network request
    // Lighthouse flags on every page.
    inlineCss: true,
  },
  async redirects() {
    return [
      {
        // Legacy WordPress landing page duplicating the home page's content, title, and
        // meta description — consolidate into the home page instead of maintaining a duplicate.
        source: '/no-1-trademark-registration-provider-in-kerala-bookmytm/',
        destination: '/',
        permanent: true,
      },
      {
        // Raw Malayalam Unicode slug didn't survive Hostinger's deploy/routing (404) —
        // renamed to an ASCII slug matching the site's other Malayalam posts.
        // Trailing slashes on both sides avoid an extra trailingSlash-normalization hop.
        source: '/%E0%B4%AC%E0%B5%8D%E0%B4%B0%E0%B4%BE%E0%B5%BB%E0%B4%A1%E0%B5%8D-%E0%B4%85%E0%B4%9F%E0%B5%8D%E0%B4%9F%E0%B4%BF%E0%B4%AE%E0%B4%B1%E0%B4%BF-%E0%B4%87%E0%B4%A8%E0%B5%8D%E0%B4%A4%E0%B5%8D%E0%B4%AF/',
        destination: '/brand-sabotage-trademark-mistakes-malayalam/',
        permanent: true,
      },
    ];
  },
  async headers() {
    // 'unsafe-inline' in script-src is deliberate. Next inlines its hydration
    // payload (self.__next_f.push) and the JSON-LD blocks into every page, so a
    // strict policy needs per-request nonces — which requires middleware and
    // forces all 141 statically prerendered pages to render dynamically. The
    // host allow-list below still blocks injection of third-party scripts, and
    // object-src/base-uri/form-action/frame-ancestors are fully locked down.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      // the /contact map facade loads maps only after the visitor asks for it
      "frame-src https://www.google.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()',
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Content-hashed build assets never change under the same URL.
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
