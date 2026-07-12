/** @type {import('next').NextConfig} */
const nextConfig = {
  // Served via `next start` on Hostinger's Node.js hosting (not static export) —
  // every page is still statically pre-rendered at build time via generateStaticParams,
  // this just changes how the pre-rendered HTML is served (Node process vs. plain files).
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
