// Generate the 1200x630 OpenGraph preview image with brand styling.
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'bookmytm-next', 'public', 'assets', 'opengraph');
mkdirSync(OUT_DIR, { recursive: true });

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="10%" cy="10%" r="120%">
      <stop offset="0%" stop-color="#1e5e3f"/>
      <stop offset="45%" stop-color="#0a351f"/>
      <stop offset="100%" stop-color="#021a0f"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="80" r="260" fill="#4ade80" opacity="0.06"/>
  <circle cx="120" cy="560" r="220" fill="#86efac" opacity="0.05"/>
  <text x="90" y="330" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Trademark Registration</text>
  <text x="90" y="405" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="#bbf7d0">&amp; ISO Certification</text>
  <text x="90" y="480" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500" fill="#d1fae5">India's trusted platform for trademarks, IP &amp; business compliance</text>
  <rect x="90" y="520" width="340" height="56" rx="28" fill="#497E38"/>
  <text x="120" y="557" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff">bookmytm.com</text>
</svg>`;

const logo = await sharp(join(import.meta.dirname, '..', 'bookmytm-next', 'public', 'images', 'bookmytm-white.png'))
  .resize({ height: 90 })
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: 90, left: 90 }])
  .webp({ quality: 90 })
  .toFile(join(OUT_DIR, 'preview.webp'));

console.log('Wrote preview.webp');
