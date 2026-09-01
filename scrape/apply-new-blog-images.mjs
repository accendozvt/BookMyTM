// Download the generated headers, convert to WebP at 1200x630, and repoint the
// 20 posts that were sharing 5 stock images onto their own topical image.
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const OUT_DIR = join(APP, 'public/images/blog');
mkdirSync(OUT_DIR, { recursive: true });

const B = 'https://pikaso.cdnpk.net/private/production';
const T = (h) => `?token=exp=1788480000~hmac=${h}`;

// slug -> [cdn id, token hmac], one generated image per post
export const MAP = {
  'brand-sabotage-7-common-trademark-filing-mistakes-indian-entrepreneurs-make-and-how-to-avoid-them': ['5320430137', 'f0cbbd66ab594540faaca6020b147e689d38eb577451a938cfa1d961124e5ff6'],
  'ccfs-2026-save-90-on-mca-late-fees': ['5320432007', 'db5d335d8a4d4fa23b5d9d4e79df3952dad012a0207e83781eb6c8cae30d0295'],
  'feb-2026-bis-exemption-for-imports-customs-clearance': ['5320432929', '2af1282f173679c51fb9d653c8832540df7ea23b177aaedcb23a28270229fe95'],
  'gst-rule-31d-mrp-based-tax-valuation-from-feb-2026': ['5320434099', 'ff216d701650dc55ed0958508124e5bbd819dc995205eecab0f7db218119f367'],
  'january-2026-regulatory-round-up': ['5320435107', 'd579bae40456f885960eae23527c0d0a395be35b29d3be6200263702d3d3e511'],
  'the-non-isi-ban-on-furniture-is-active-are-you-compliant': ['5320436332', '83068115333337615405fd3fa366d3027d035d6f25d454f783724e435aa05bda'],
  'trademark-registry-warns-against-unauthorized-portals': ['5320437585', 'bca512f4f0cb1440170390330418a7d6f94cb2cdd9427e5ecd4042b574bf58b6'],
  'brand-sabotage-trademark-mistakes-malayalam': ['5320438586', '37d75e44d4bdd2d4c2360d75a53c0dece03187f9a09f75577592b76755d68d42'],
  'fssai-license-explained-the-complete-guide-for-restaurants-cloud-kitchens-and-home-bakers-in-india': ['5320441958', 'c7e95c9e3a2497d5f909ac3d8d67d85565592812a6affed1508f977ca7a332e7'],
  'guide-to-filing-a-strong-reply-to-a-trademark-objection': ['5320444350', 'c98a389cb8c06ebcc47371a30f9913bf272a007099aa386d2cb97d9e9f9a7fc0'],
  'received-a-trademark-objection-dont-panic-heres-how-to-file-a-winning-reply': ['5320444604', '735bfb1da86a14eea2e1fd1575e28883a9588c7ef0efd4a9ed7e673a930c8296'],
  'starting-an-e-commerce-business-in-india-the-2025-legal-guide-to-gst-trademarks-and-policies': ['5320445932', '88bcffa2d10aae8db1729016472b1bc434af10f823769f96b725d2f2f69d2521'],
  'the-2025-legal-checklist-for-indian-startups-12-essential-registrations-compliances': ['5320447359', '4a20d5b4bccfa81ad6fb156e6e36e47a91901dee2fcaf60ec86aa5b5917d80b7'],
  'trademark-objection-appeal-malayalam': ['5320448631', 'b2911c6fdad2489ac7e8d014579cfb2993872fa020279d2f3a33ae5134eef822'],
  'guide-to-what-you-can-and-cant-trademark-in-india': ['5320451302', '44c3d10ddd891418ac0e052f74247216c7c024221cc0002f3abf9ecfb0150f5b'],
  'the-complete-list-of-45-trademark-classes-in-malayalam': ['5320452526', '2190a78477bf8eed9c7be49ef0d0207071b51ca3dafba4e1243852b0c4e472cb'],
  'protecting-brand-digital-age': ['5320454287', '900769aa92956e10dde12c94b8ba7fb070f3d10759441cad6bdb2746dcf7c096'],
  'why-every-kerala-startup-needs-a-trademark-in-2026': ['5320454857', 'c79969bc029196d9aeee4326a4652d76e94c96e7722d36d94edf03eb11b66007'],
  'the-complete-list-of-45-trademark-classes': ['5320456092', '9f85bc2e8c563b1a02f26df3031242527210ca0011108bcc327d1e191b6bb7e2'],
  'what-all-can-be-and-cant-be-trademarked-in-india': ['5320457613', '2e5a104fee3f4f96b9fe9ff68e059d83fa103b2a4d1d8dd4cfbecf234b1f1afb'],
};

const idxPath = join(APP, 'data/posts-index.json');
const idx = JSON.parse(readFileSync(idxPath, 'utf8'));
const bySlug = Object.fromEntries(idx.map((p) => [p.slug, p]));

let done = 0;
for (const [slug, [id, hmac]] of Object.entries(MAP)) {
  const res = await fetch(`${B}/${id}/render.jpg${T(hmac)}`);
  if (!res.ok) { console.log(`FAIL download ${slug}: ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());

  const rel = `/images/blog/hdr-${slug}.webp`;
  await sharp(buf).resize(1200, 630, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(join(APP, 'public', rel.replace(/^\//, '')));

  // content-posts JSON
  const cp = join(APP, 'content-posts', slug + '.json');
  const j = JSON.parse(readFileSync(cp, 'utf8'));
  j.featuredImage = rel;
  j.featuredImageWidth = 1200;
  j.featuredImageHeight = 630;
  writeFileSync(cp, JSON.stringify(j, null, 2) + '\n');

  // posts-index entry
  if (bySlug[slug]) {
    bySlug[slug].featuredImage = rel;
    bySlug[slug].featuredImageWidth = 1200;
    bySlug[slug].featuredImageHeight = 630;
  }
  done++;
}

writeFileSync(idxPath, JSON.stringify(idx, null, 2) + '\n');
console.log(`applied ${done} new header images (1200x630 webp)`);
