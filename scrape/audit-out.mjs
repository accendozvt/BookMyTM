// Audit exported HTML: form / FAQ / image / price presence per page.
import { readFileSync, readdirSync } from 'fs';
import { join, relative, sep } from 'path';

const OUT = join(import.meta.dirname, '..', 'bookmytm-next', 'out');

function* walk(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) yield* walk(p);
    else if (f.name === 'index.html') yield p;
  }
}

let total = 0, withForm = 0, withFaq = 0, withImg = 0, withPrice = 0;
const noFaq = [], noForm = [], noImg = [];
for (const p of walk(OUT)) {
  const rel = relative(OUT, p).split(sep).join('/');
  const html = readFileSync(p, 'utf8');
  total++;
  const form = html.includes('Request via WhatsApp');
  const faq = html.includes('id="faq"');
  const img = /<img[^>]+\/images\//.test(html);
  if (form) withForm++;
  if (faq) withFaq++;
  if (img) withImg++;
  if (html.includes('all inclusive')) withPrice++;
  const isLeaf = rel.split('/').length > 2;
  if (isLeaf && !faq) noFaq.push(rel);
  if (isLeaf && !form) noForm.push(rel);
  if (isLeaf && !img) noImg.push(rel);
}
console.log({ total, withForm, withFaq, withImg, withPrice });
console.log('leaf pages missing FAQ:', noFaq.length);
noFaq.forEach((x) => console.log('  ', x));
console.log('leaf pages missing form:', noForm.length);
noForm.forEach((x) => console.log('  ', x));
console.log('leaf pages missing image:', noImg.length);
noImg.forEach((x) => console.log('  ', x));
