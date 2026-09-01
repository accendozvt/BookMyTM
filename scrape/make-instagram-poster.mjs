// Attractive modern Instagram poster (1080x1440) for social promotion.
// Same brand language as the blog header images: dark green radial gradient + bold type.
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'social-posts');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1080;
const H = 1440;

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxCharsPerLine) {
      lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const headline = 'WHO OWNS YOUR AI-GENERATED LOGO?';
const headlineLines = wrapText(headline, 15);
const headlineFontSize = 92;
const headlineLineHeight = 100;
const headlineStartY = 560;

const headlineTspans = headlineLines
  .map((line, i) => `<tspan x="90" dy="${i === 0 ? 0 : headlineLineHeight}">${esc(line)}</tspan>`)
  .join('');

const highlights = [
  'Copyright law in India is still unsettled for AI art',
  'But trademark protection is available right now',
  "Don't leave your brand identity unprotected",
];

const highlightsSvg = highlights
  .map((t, i) => {
    const y = 900 + i * 74;
    return `
    <g transform="translate(90, ${y})">
      <circle cx="16" cy="0" r="16" fill="#4ade80"/>
      <path d="M9 0.5 L14 5.5 L23 -5" stroke="#052e16" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="46" y="7" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="#e7fbe9">${esc(t)}</text>
    </g>`;
  })
  .join('');

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="18%" cy="8%" r="115%">
      <stop offset="0%" stop-color="#1e6b46"/>
      <stop offset="42%" stop-color="#0a351f"/>
      <stop offset="100%" stop-color="#021a0f"/>
    </radialGradient>
    <linearGradient id="ctaGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.09)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>

  <!-- background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- decorative glows -->
  <circle cx="980" cy="60" r="320" fill="#4ade80" opacity="0.10"/>
  <circle cx="60" cy="740" r="260" fill="#86efac" opacity="0.06"/>
  <circle cx="960" cy="1300" r="300" fill="#16a34a" opacity="0.12"/>

  <!-- subtle dot grid texture -->
  <g fill="#ffffff" opacity="0.05">
    ${Array.from({ length: 10 }, (_, r) =>
      Array.from({ length: 14 }, (_, c) => `<circle cx="${40 + c * 78}" cy="${40 + r * 78}" r="2.2"/>`).join(''),
    ).join('')}
  </g>

  <!-- top eyebrow badge -->
  <g transform="translate(90, 92)">
    <rect x="0" y="0" width="330" height="56" rx="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <circle cx="30" cy="28" r="9" fill="#4ade80"/>
    <text x="52" y="36" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="1.5" fill="#eafff1">AI &amp; TRADEMARKS</text>
  </g>

  <!-- sparkle / AI motif icon -->
  <g transform="translate(880, 70)" fill="#4ade80" opacity="0.9">
    <path d="M40 0 L48 30 L78 38 L48 46 L40 76 L32 46 L2 38 L32 30 Z"/>
    <path d="M92 60 L96 74 L110 78 L96 82 L92 96 L88 82 L74 78 L88 74 Z" opacity="0.7"/>
  </g>

  <!-- headline -->
  <text x="90" y="${headlineStartY}" font-family="Arial, Helvetica, sans-serif" font-size="${headlineFontSize}" font-weight="900" fill="#ffffff" letter-spacing="-1">${headlineTspans}</text>

  <!-- subheadline -->
  <text x="90" y="850" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="500" fill="#bbf7d0">A question every founder using AI tools should ask</text>

  <!-- highlight checklist -->
  ${highlightsSvg}

  <!-- CTA pill -->
  <g transform="translate(90, 1150)">
    <rect x="0" y="0" width="540" height="92" rx="46" fill="url(#ctaGrad)"/>
    <text x="44" y="58" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="#052e16">READ THE FULL GUIDE</text>
    <g transform="translate(468, 32)">
      <line x1="0" y1="14" x2="28" y2="14" stroke="#052e16" stroke-width="4" stroke-linecap="round"/>
      <polyline points="16,2 30,14 16,26" fill="none" stroke="#052e16" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- divider -->
  <line x1="90" y1="1290" x2="${W - 90}" y2="1290" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>

  <!-- footer: brand + contact -->
  <g transform="translate(90, 1330)">
    <rect x="0" y="0" width="182" height="46" rx="23" fill="rgba(255,255,255,0.12)"/>
    <text x="24" y="30" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" fill="#ffffff">BookMyTM</text>
  </g>
  <text x="90" y="1408" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600" fill="#d1fae5">bookmytm.com  •  +91 809 809 0880  •  Kochi, Kerala</text>
</svg>`;

const out = join(OUT_DIR, 'ai-generated-logo-copyright-trademark-ownership-poster.png');
await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(out);
console.log('Created', out);
