// Download all inventoried images into bookmytm-next/public/images and write a URL->local manifest.
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const images = JSON.parse(readFileSync(join(import.meta.dirname, 'images.json'), 'utf8'));
const OUT = join(import.meta.dirname, '..', 'bookmytm-next', 'public', 'images');
mkdirSync(OUT, { recursive: true });

function localName(url) {
  const u = new URL(url);
  let name = u.pathname.split('/').pop().split('?')[0];
  if (u.hostname === 'images.unsplash.com') {
    name = u.pathname.replace(/^\//, '') + '.jpg';
  }
  return decodeURIComponent(name).replace(/[^a-zA-Z0-9._-]/g, '-');
}

const manifest = {};
for (const img of images) {
  const name = localName(img.url);
  try {
    const res = await fetch(img.url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/126' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(OUT, name), buf);
    manifest[img.url] = '/images/' + name;
    console.log('OK ', name, (buf.length / 1024).toFixed(0) + 'kb');
  } catch (e) {
    console.log('ERR', img.url, e.message);
  }
}
writeFileSync(join(import.meta.dirname, 'image-manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Downloaded', Object.keys(manifest).length, 'of', images.length);
