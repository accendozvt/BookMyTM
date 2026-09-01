/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served via `next start` on Hostinger's Node.js hosting (not static export) —
  // every page is still statically pre-rendered at build time via generateStaticParams,
  // this just changes how the pre-rendered HTML is served (Node process vs. plain files).
  trailingSlash: true,
  images: { unoptimized: true },
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
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
