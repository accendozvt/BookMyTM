// Generate branded header images (1200x630, matching OG dimensions) for the 20 new blog posts.
// Same visual language as the existing site: dark green radial gradient, Manrope-style bold type, brand icon.
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'bookmytm-next', 'public', 'images', 'blog');
mkdirSync(OUT_DIR, { recursive: true });

// Subset of icon paths (24x24 viewBox) matching components/icons.tsx, ported to raw SVG.
const ICONS = {
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  chart: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  infinity: '<path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>',
  pen: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  bank: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  transfer: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="white"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  document: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
};

const POSTS = [
  { slug: 'new-labour-codes-2026-employer-guide', title: 'New Labour Codes 2026', sub: 'What Every Employer Needs to Know', icon: 'users' },
  { slug: 'dpdp-act-compliance-small-business-guide', title: 'DPDP Act Compliance', sub: 'What Small Businesses Must Do', icon: 'shield' },
  { slug: 'msme-udyam-classification-2026-limits', title: 'MSME Udyam Classification 2026', sub: 'New Investment & Turnover Limits', icon: 'chart' },
  { slug: 'trademark-renewal-deadlines-india', title: 'Trademark Renewal Deadlines', sub: 'What Happens If You Miss Yours', icon: 'infinity' },
  { slug: 'design-registration-india-guide', title: 'Design Registration in India', sub: "Protecting Your Product's Look", icon: 'pen' },
  { slug: 'patent-filing-process-india-explained', title: 'Patent Filing in India', sub: 'The Complete Search-to-Grant Process', icon: 'lightbulb' },
  { slug: 'section-8-company-vs-trust-vs-society', title: 'Section 8 vs Trust vs Society', sub: 'Choosing the Right Non-Profit Structure', icon: 'users' },
  { slug: 'nidhi-company-registration-pros-cons', title: 'Nidhi Company Registration', sub: 'Pros, Cons & Who Should Register', icon: 'bank' },
  { slug: 'trademark-assignment-vs-licensing', title: 'Assignment vs Licensing', sub: "What's the Difference for Your Trademark", icon: 'transfer' },
  { slug: 'gs1-barcode-registration-india-guide', title: 'GS1 Barcode Registration', sub: 'Why Retailers & Manufacturers Need One', icon: 'tag' },
  { slug: 'llp-vs-private-limited-company-2026', title: 'LLP vs Private Limited', sub: 'A 2026 Comparison for Founders', icon: 'scale' },
  { slug: 'one-person-company-opc-rule-changes', title: 'One Person Company (OPC)', sub: 'Recent Rule Relaxations for Founders', icon: 'briefcase' },
  { slug: 'company-name-rejected-run-spice-reasons', title: 'Company Name Rejected?', sub: 'Top Reasons RUN/SPICe+ Applications Fail', icon: 'document' },
  { slug: 'ai-generated-logo-copyright-trademark-ownership', title: 'Who Owns an AI Logo?', sub: 'Copyright & Trademark in the AI Era', icon: 'lightbulb' },
  { slug: 'well-known-trademark-status-india', title: 'Well-Known Trademarks', sub: 'How Brands Get That Status in India', icon: 'award' },
  { slug: 'kswift-kerala-single-window-clearance', title: 'K-SWIFT Kerala', sub: 'Single Window Clearance for Startups', icon: 'building' },
  { slug: 'iso-14001-kerala-exporters-guide', title: 'ISO 14001 for Kerala Exporters', sub: 'Spice, Coir & Seafood Businesses', icon: 'globe' },
  { slug: 'halal-export-certification-kerala', title: 'Halal & Export Certification', sub: "Kerala's Seafood & Spice Industry", icon: 'check' },
  { slug: 'professional-tax-kerala-explained', title: 'Professional Tax in Kerala', sub: 'Who Pays, How Much, and When', icon: 'bank' },
  { slug: 'gst-eway-bill-rules-kerala-mistakes', title: 'GST E-Way Bill Rules', sub: 'Common Mistakes Kerala Businesses Make', icon: 'document' },
];

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

async function makeImage(post) {
  const titleLines = wrapText(post.title, 22);
  const titleTspans = titleLines
    .map((line, i) => `<tspan x="100" dy="${i === 0 ? 0 : 66}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="12%" cy="10%" r="120%">
      <stop offset="0%" stop-color="#1e5e3f"/>
      <stop offset="45%" stop-color="#0a351f"/>
      <stop offset="100%" stop-color="#021a0f"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1080" cy="90" r="240" fill="#4ade80" opacity="0.07"/>
  <circle cx="80" cy="560" r="200" fill="#86efac" opacity="0.05"/>

  <!-- icon badge -->
  <rect x="100" y="90" width="76" height="76" rx="20" fill="#497E38"/>
  <g transform="translate(124,114)" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    ${ICONS[post.icon]}
  </g>

  <text x="100" y="290" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="800" fill="#ffffff">${titleTspans}</text>
  <text x="100" y="${290 + titleLines.length * 66 + 44}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="500" fill="#bbf7d0">${escapeXml(post.sub)}</text>

  <rect x="100" y="540" width="220" height="46" rx="23" fill="rgba(255,255,255,0.1)"/>
  <text x="130" y="570" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff">BookMyTM</text>
</svg>`;

  const out = join(OUT_DIR, `blog-${post.slug}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(out);
  return out;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

for (const post of POSTS) {
  const file = await makeImage(post);
  console.log('Created', file.split(/[\\/]/).pop());
}
console.log(`\nDone: ${POSTS.length} images generated`);
