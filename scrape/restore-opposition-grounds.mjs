// Restore "Grounds for Applying for Opposition" to the trademark opposition page.
//
// The WordPress page listed the five statutory grounds. The rebuild kept only a
// one-line mention inside Documents Required ("Detailed reasons why the mark
// should not be registered (similarity, bad faith, etc)") - the grounds
// themselves, including the Emblem and Names Act 1950 and the religious-sentiment
// ground, appear nowhere on the site.
//
// Text is copied from the old page, not rewritten. Placed where it sat there:
// after Documents Required, before the three-step section.
import { readFileSync, writeFileSync } from 'fs';

const FILE =
  'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next/content/intellectual-property__trademark__trademark-opposition.json';

const GROUNDS = [
  'If the applied trademark is similar or identical to an earlier or existing registered trademark.',
  'If the mark is devoid of any distinctive character or is descriptive.',
  'The trademark is likely to cause confusion or deceive the public.',
  'If the mark is contrary to the law or prohibited under the Emblem and Names Act, 1950.',
  'If the mark contains matters that are likely to hurt religious sentiments of any class or section of people.',
];

const doc = JSON.parse(readFileSync(FILE, 'utf8'));
if (JSON.stringify(doc).includes('Emblem and Names Act')) {
  console.log('already present — nothing to do');
  process.exit(0);
}

const at = doc.blocks.findIndex((b) => b.type === 'heading' && /File Opposition in 3 Easy Steps/i.test(b.text || ''));
if (at < 0) throw new Error('anchor heading not found');

doc.blocks.splice(
  at,
  0,
  { type: 'heading', level: 2, text: 'Grounds for Applying for Opposition' },
  { type: 'list', items: GROUNDS },
);

writeFileSync(FILE, JSON.stringify(doc, null, 2) + '\n');
console.log(`inserted the grounds list at block ${at} (${GROUNDS.length} items)`);
