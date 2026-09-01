import type { MetadataRoute } from 'next';

/**
 * Emitted at /manifest.webmanifest. Icons live in public/icons rather than app/,
 * so their URLs stay stable — Next content-hashes icons placed in app/.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BookMyTM',
    short_name: 'BookMyTM',
    description:
      'Trademark registration, ISO certification, company registration and statutory compliance for Indian businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3d6f2e',
    lang: 'en-IN',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
