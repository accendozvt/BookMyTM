// Polished infographic-style Instagram poster (1080x1440) inspired by reference layout:
// header band with real logo + trust badge, bold two-tone headline, vector shield/seal
// emblem, stamp graphic, highlight card, CTA link box, secondary banner, footer contact bar.
// Built entirely from vector shapes + the site's real logo asset (no photo/3D-render assets used).
import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'social-posts');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1080;
const H = 1440;

const BRAND = '#497E38';
const BRAND_DARK = '#052e16';
const BRAND_DEEP = '#0a351f';
const BRAND_LIGHT = '#86efac';
const SURFACE = '#f3f6f4';

const logoPath = join(import.meta.dirname, '..', 'bookmytm-next', 'public', 'images', 'logo.png');
const logoB64 = readFileSync(logoPath).toString('base64');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- content (well-known trademark post) ----
const slug = 'well-known-trademark-status-india';

const headlineParts = [
  { text: 'What Makes a', color: BRAND_DARK, size: 46 },
  { text: 'Trademark', color: BRAND, size: 58 },
  { text: '"Well-Known"', color: BRAND, size: 58 },
  { text: 'Under Indian Law?', color: BRAND_DARK, size: 46 },
];

const highlights = [
  { icon: 'shieldCheck', text: 'Protection extends across ALL classes of goods & services.' },
  { icon: 'gavel', text: "No court case needed to get it — not since 2017." },
  { icon: 'search', text: 'See exactly how the Registrar decides "well-known" status.' },
];

const ICONS = {
  shieldCheck:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  gavel:
    '<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  document:
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  phone:
    '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.4 1.2l-.465.355a1 1 0 0 0-.303 1.213 14 14 0 0 0 6 6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
};

function icon(name, x, y, size, color, strokeWidth = 2) {
  return `<g transform="translate(${x - size / 2},${y - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;
}

// ---------------------------------------------------------------------------
// Layout budget (top to bottom), computed with a running cursor so nothing overflows.
const HEADER_H = 168;
const FOOTER_H = 118;
const MARGIN_X = 90;
const CONTENT_W = W - MARGIN_X * 2; // 900

let y = HEADER_H + 62; // top of headline block

// headline
let headlineY = y;
const headlineSvg = headlineParts
  .map((part) => {
    const t = `<text x="${MARGIN_X}" y="${headlineY}" font-family="Arial, Helvetica, sans-serif" font-size="${part.size}" font-weight="900" fill="${part.color}">${esc(part.text)}</text>`;
    headlineY += part.size + 12;
    return t;
  })
  .join('');
const headlineBottom = headlineY - 12;

// shield emblem (right column) — sized to sit beside the headline
const shieldCenterX = 800;
const shieldTopY = y - 20;
const shieldScale = 0.78;
const shieldSvg = `
  <g transform="translate(${shieldCenterX}, ${shieldTopY + 170 * shieldScale}) scale(${shieldScale})">
    <ellipse cx="0" cy="235" rx="150" ry="20" fill="${BRAND_DARK}" opacity="0.10"/>
    <path d="M0,-30 L150,20 V110 C150,220 75,270 0,300 C-75,270 -150,220 -150,110 V20 Z" fill="url(#shieldGrad)"/>
    <path d="M0,-30 L150,20 V110 C150,220 75,270 0,300 C-75,270 -150,220 -150,110 V20 Z" fill="url(#badgeGlow)"/>
    <circle cx="0" cy="90" r="82" fill="none" stroke="#eafff1" stroke-width="6" opacity="0.9"/>
    <text x="0" y="118" text-anchor="middle" font-family="Georgia, serif" font-size="104" font-weight="700" fill="#eafff1">R</text>
  </g>`;
const shieldBottom = shieldTopY + 300 * shieldScale;

// ink stamp, tucked under the shield
const stampCx = shieldCenterX - 10;
const stampCy = shieldBottom + 110;
const stampR = 74;
const stampSvg = `
  <g transform="translate(${stampCx}, ${stampCy}) rotate(-10)">
    <circle cx="0" cy="0" r="${stampR}" fill="none" stroke="${BRAND}" stroke-width="4" opacity="0.5"/>
    <circle cx="0" cy="0" r="${stampR - 14}" fill="none" stroke="${BRAND}" stroke-width="2" opacity="0.5"/>
    <text x="0" y="-6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" fill="${BRAND}" opacity="0.65">WELL-KNOWN</text>
    <text x="0" y="16" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" fill="${BRAND}" opacity="0.65">TRADEMARK</text>
    <g fill="${BRAND}" opacity="0.55">
      <path transform="translate(-32,36) scale(0.8)" d="M0,-8 L2.4,-2.6 L8,-1.9 L3.8,2.1 L5,7.8 L0,5 L-5,7.8 L-3.8,2.1 L-8,-1.9 L-2.4,-2.6 Z"/>
      <path transform="translate(0,42) scale(0.8)" d="M0,-8 L2.4,-2.6 L8,-1.9 L3.8,2.1 L5,7.8 L0,5 L-5,7.8 L-3.8,2.1 L-8,-1.9 L-2.4,-2.6 Z"/>
      <path transform="translate(32,36) scale(0.8)" d="M0,-8 L2.4,-2.6 L8,-1.9 L3.8,2.1 L5,7.8 L0,5 L-5,7.8 L-3.8,2.1 L-8,-1.9 L-2.4,-2.6 Z"/>
    </g>
  </g>`;
const stampBottom = stampCy + stampR;

y = Math.max(headlineBottom, stampBottom) + 44;

// highlight card — one row per highlight, fixed row height, no overflow risk
const cardTop = y;
const rowH = 98;
const cardPadY = 28;
const cardH = cardPadY * 2 + rowH * highlights.length;
const rowsSvg = highlights
  .map((h, i) => {
    const cy = cardTop + cardPadY + rowH * i + rowH / 2;
    const divider =
      i < highlights.length - 1
        ? `<line x1="${MARGIN_X + 40}" y1="${cy + rowH / 2}" x2="${MARGIN_X + CONTENT_W - 40}" y2="${cy + rowH / 2}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-dasharray="4 6"/>`
        : '';
    return `
    <g transform="translate(${MARGIN_X + 74}, ${cy})">
      <circle cx="0" cy="0" r="34" fill="rgba(255,255,255,0.15)"/>
      ${icon(h.icon, 0, 0, 30, '#ffffff', 2)}
      <text x="60" y="9" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="600" fill="#eafff1">${esc(h.text)}</text>
    </g>
    ${divider}`;
  })
  .join('');
y = cardTop + cardH + 26;

// CTA link box
const ctaTop = y;
const ctaH = 136;
const ctaSvg = `
  <g transform="translate(${MARGIN_X}, ${ctaTop})">
    <rect x="0" y="0" width="${CONTENT_W}" height="${ctaH}" rx="26" fill="#ffffff" stroke="${BRAND_LIGHT}" stroke-width="2"/>
    <g transform="translate(50, 44)">
      <circle cx="0" cy="0" r="26" fill="${BRAND}"/>
      ${icon('document', 0, 0, 24, '#ffffff', 2)}
    </g>
    <text x="96" y="36" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="${BRAND_DARK}">Full guide to well-known trademarks</text>
    <text x="96" y="68" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="800" fill="${BRAND_DARK}">in India.</text>
    <g transform="translate(50, 108)">
      <circle cx="0" cy="0" r="18" fill="${BRAND_LIGHT}"/>
      ${icon('link', 0, 0, 18, BRAND_DARK, 2.2)}
    </g>
    <rect x="84" y="90" width="${CONTENT_W - 124}" height="38" rx="10" fill="${SURFACE}"/>
    <text x="100" y="115" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="600" fill="${BRAND}">bookmytm.com/${slug}/</text>
  </g>`;
y = ctaTop + ctaH + 20;

// secondary CTA banner
const bannerTop = y;
const bannerH = 88;
const bannerSvg = `
  <g transform="translate(${MARGIN_X}, ${bannerTop})">
    <rect x="0" y="0" width="${CONTENT_W}" height="${bannerH}" rx="22" fill="${BRAND_LIGHT}" opacity="0.35"/>
    <g transform="translate(52, 48)">
      <circle cx="0" cy="0" r="26" fill="${BRAND}"/>
      ${icon('target', 0, 0, 24, '#ffffff', 2)}
    </g>
    <text x="96" y="38" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="${BRAND_DARK}">Building a strong brand?</text>
    <text x="96" y="68" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="${BRAND}">Let's talk long-term trademark strategy.</text>
  </g>`;
y = bannerTop + bannerH;

// sanity: y must stay comfortably above the footer band
const footerTop = H - FOOTER_H;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND_DEEP}"/>
      <stop offset="100%" stop-color="${BRAND_DARK}"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5fa346"/>
      <stop offset="55%" stop-color="${BRAND}"/>
      <stop offset="100%" stop-color="${BRAND_DEEP}"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_DEEP}"/>
      <stop offset="100%" stop-color="${BRAND_DARK}"/>
    </linearGradient>
    <radialGradient id="badgeGlow" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- base -->
  <rect width="${W}" height="${H}" fill="${SURFACE}"/>

  <!-- header band -->
  <rect x="0" y="0" width="${W}" height="${HEADER_H}" fill="url(#headerGrad)"/>
  <circle cx="960" cy="10" r="160" fill="#ffffff" opacity="0.03"/>

  <!-- real logo -->
  <image x="${MARGIN_X}" y="${(HEADER_H - 72) / 2}" width="228" height="72" href="data:image/png;base64,${logoB64}" preserveAspectRatio="xMinYMid meet"/>

  <!-- trust badge (generic — not a reproduction of any third-party trademark) -->
  <g transform="translate(700, ${(HEADER_H - 82) / 2})">
    <rect x="0" y="0" width="290" height="82" rx="18" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <text x="145" y="32" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="1" fill="#ffffff">5-STAR RATED</text>
    <g transform="translate(145, 54)">
      ${[-96, -48, 0, 48, 96]
        .map(
          (dx) =>
            `<path transform="translate(${dx},0)" d="M0,-11 L3.2,-3.6 L11,-2.6 L5.3,2.9 L6.8,10.6 L0,6.8 L-6.8,10.6 L-5.3,2.9 L-11,-2.6 L-3.2,-3.6 Z" fill="#facc15"/>`,
        )
        .join('')}
    </g>
  </g>

  <!-- decorative shield / seal emblem -->
  ${shieldSvg}

  <!-- headline -->
  ${headlineSvg}

  <!-- rotated ink stamp -->
  ${stampSvg}

  <!-- highlight card -->
  <rect x="${MARGIN_X}" y="${cardTop}" width="${CONTENT_W}" height="${cardH}" rx="32" fill="url(#cardGrad)"/>
  ${rowsSvg}

  <!-- CTA link box -->
  ${ctaSvg}

  <!-- secondary CTA banner -->
  ${bannerSvg}

  <!-- footer contact bar -->
  <rect x="0" y="${footerTop}" width="${W}" height="${FOOTER_H}" fill="url(#headerGrad)"/>
  <g transform="translate(70, ${footerTop + 40})" fill="#ffffff">
    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.15)"/>
    ${icon('phone', 0, 0, 18, '#ffffff', 2)}
    <text x="34" y="-8" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#bbf7d0" font-weight="600">Call / WhatsApp</text>
    <text x="34" y="16" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" fill="#ffffff">+91 809 809 0880</text>
  </g>
  <line x1="330" y1="${footerTop + 18}" x2="330" y2="${footerTop + 66}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <g transform="translate(360, ${footerTop + 40})" fill="#ffffff">
    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.15)"/>
    ${icon('mail', 0, 0, 18, '#ffffff', 2)}
    <text x="34" y="-8" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#bbf7d0" font-weight="600">Email</text>
    <text x="34" y="16" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" fill="#ffffff">cc@bookmytm.com</text>
  </g>
  <line x1="640" y1="${footerTop + 18}" x2="640" y2="${footerTop + 66}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <g transform="translate(670, ${footerTop + 40})" fill="#ffffff">
    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.15)"/>
    ${icon('globe', 0, 0, 18, '#ffffff', 2)}
    <text x="34" y="-8" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#bbf7d0" font-weight="600">Website</text>
    <text x="34" y="16" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="800" fill="#ffffff">www.bookmytm.com</text>
  </g>
  <g transform="translate(70, ${footerTop + 92})" fill="#ffffff">
    ${icon('pin', 8, -6, 16, '#bbf7d0', 2)}
    <text x="24" y="0" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="600" fill="#eafff1">Kakkanad, Kochi, Kerala</text>
  </g>
</svg>`;

console.log('Content bottom y:', y, '/ footer starts at', footerTop, '(must be <=)');
if (y > footerTop) console.warn('WARNING: content overflows into footer band, reduce sizes.');

const out = join(OUT_DIR, `${slug}-poster.png`);
await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(out);
console.log('Created', out);
