// Replace the About page's five stock photos with four generated ones.
//
// Two problems. The page opened with two image blocks back to back, so the
// photos rendered stacked with nothing between them - one of the pair goes.
// And all five were Unsplash stock shared with other pages: photo-1497366216548
// and photo-1450101499163 and photo-1552664730 are also the megamenu promo
// images, so the About page showed the reader nothing it had not already seen.
//
// Written from the surrounding copy, SEO filenames, own alt text, 1200x675 to
// match the max-h-[420px] centred slot the template renders.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const OUT_DIR = join(APP, 'public/images/about');
mkdirSync(OUT_DIR, { recursive: true });

const B = 'https://pikaso.cdnpk.net/private/production';
const T = (h) => `?token=exp=1788998400~hmac=${h}`;

// Keyed by the src currently in the JSON. `drop: true` removes the block instead
// of replacing it - that is the second half of the stacked pair.
const PLAN = [
  {
    match: 'photo-1497366216548',
    id: '5373932259',
    hmac: '1c33b15c37bd0b9155c559b9857377c9c964eb4380b991a285c1c354ff542a7d',
    file: 'bookmytm-advisory-team-kochi',
    alt: 'BookMyTM advisory team reviewing brand and compliance documents at the Kochi office',
  },
  { match: 'photo-1552664730', drop: true },
  {
    match: 'photo-1602216056096',
    id: '5373931831',
    hmac: 'a6192ab28f43ff71a4b65db54735fe2d253a596b1d2adfae50eb76ffae67c793',
    file: 'kerala-spice-exporter-trading-street',
    alt: 'Kerala spice exporter and shopkeeper at work in a Kochi trading street',
  },
  {
    match: 'photo-1450101499163',
    id: '5373932447',
    hmac: 'f6d1523c0265efc935230588e9fca4017d149072e96a64b2829e31783ae3f1f8',
    file: 'business-protection-ip-compliance',
    alt: 'Brand, product and compliance records arranged as a protective ring around a business',
  },
  {
    match: 'photo-1521791136064',
    id: '5373933120',
    hmac: '769b8f20ca92eba23593f88bf3354f164f8c35f3afd419b071e9239d5bff65ce',
    file: 'bookmytm-client-partnership',
    alt: 'Business owner and BookMyTM adviser shaking hands after completing a filing',
  },
];

const W = 1200;
const H = 675;

const file = join(APP, 'content/about-us.json');
const doc = JSON.parse(readFileSync(file, 'utf8'));

let replaced = 0;
let dropped = 0;

for (const p of PLAN) {
  const idx = doc.blocks.findIndex((b) => b.type === 'image' && (b.src || '').includes(p.match));
  if (idx < 0) {
    console.log(`  not found (already applied?): ${p.match}`);
    continue;
  }
  if (p.drop) {
    doc.blocks.splice(idx, 1);
    dropped++;
    console.log(`  removed the stacked duplicate: ${p.match}`);
    continue;
  }
  const res = await fetch(`${B}/${p.id}/render.png${T(p.hmac)}`);
  if (!res.ok) throw new Error(`${p.file}: HTTP ${res.status}`);
  const webp = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toBuffer();
  writeFileSync(join(OUT_DIR, p.file + '.webp'), webp);

  doc.blocks[idx].src = `/images/about/${p.file}.webp`;
  doc.blocks[idx].alt = p.alt;
  replaced++;
  console.log(`  ${p.file}.webp  <-  ${p.match}`);
}

writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
const remaining = doc.blocks.filter((b) => b.type === 'image').length;
console.log(`\nreplaced ${replaced}, dropped ${dropped}; ${remaining} image blocks remain`);

// no two image blocks may sit next to each other again
const adjacent = doc.blocks.filter((b, i) => b.type === 'image' && doc.blocks[i + 1]?.type === 'image').length;
console.log(adjacent === 0 ? 'no adjacent image blocks' : `WARNING: ${adjacent} adjacent image pairs remain`);
