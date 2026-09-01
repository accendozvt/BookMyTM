// Build the favicon / app-icon set from the BookMyTM logo.
//
// The full wordmark plus "Click. Start Business!" is about 4:1 and mostly empty
// space in a square; at 16px it is an unreadable smudge. So the small icons use
// the "oo" ligature - the two overlapping rings, the one distinctive shape in
// the mark - white on brand green, which stays legible in a browser tab.
//
// Source is images/bookmytm-white.png (white on transparent, the header
// variant). The green original was never in the repo, and white-on-brand-green
// is the same identity inverted, so nothing is invented here.
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const SRC = join(APP, 'public/images/bookmytm-white.png');
const BRAND = '#3d6f2e'; // app/layout.tsx themeColor

// "oo" bounding box, measured from the alpha channel rather than eyeballed:
// wordmark rows only (the tagline sits below 112), second glyph cluster.
const MARK = { left: 94, top: 0, width: 137, height: 112 };

/** The mark, centred on brand green, at `size` px with breathing room. */
async function icon(size) {
  const inner = Math.round(size * 0.72);
  const mark = await sharp(readFileSync(SRC))
    .extract(MARK)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BRAND } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();
}

/**
 * Minimal ICO writer. sharp cannot emit .ico, and rather than add a dependency
 * for a 22-byte-per-entry container: 6-byte header, one 16-byte directory entry
 * per image, then the PNG payloads. PNG-compressed entries are understood by
 * every browser in use.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const dir = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...images.map((i) => i.data)]);
}

const icoSizes = [16, 32, 48];
const entries = [];
for (const size of icoSizes) entries.push({ size, data: await icon(size) });
writeFileSync(join(APP, 'app/favicon.ico'), ico(entries));
console.log(`app/favicon.ico        ${icoSizes.join('/')} px`);

// Next's App Router picks these up by filename and emits the <link> tags itself.
writeFileSync(join(APP, 'app/apple-icon.png'), await icon(180));
console.log('app/apple-icon.png     180 px');

// The manifest needs stable URLs, so the PWA icons live in public/ rather than
// app/, where Next would hash the filenames.
mkdirSync(join(APP, 'public/icons'), { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(join(APP, `public/icons/icon-${size}.png`), await icon(size));
  console.log(`public/icons/icon-${size}.png`);
}

// The old favicon at public/favicon.ico would compete with app/favicon.ico.
const old = join(APP, 'public/favicon.ico');
if (existsSync(old)) { unlinkSync(old); console.log('removed superseded public/favicon.ico'); }
