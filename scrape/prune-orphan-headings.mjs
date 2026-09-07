// Fix headings that render with nothing under them, in the content JSON.
//
// Four distinct causes, each handled on its own terms:
//
//   CTA widgets.  "Register Online", "Book Now for Rs.8999", "Related Services":
//   on the old site each sat over a button or link list the scraper treated as
//   navigation and dropped. The label stayed. Removed.
//
//   Flat containers.  The company-registration pages used h2 for everything.
//   "Formulation of Company Name" (h2) is the parent of "Build a Unique Identity"
//   (h2) - an empty heading followed by its own children at the same level. The
//   children are demoted to h3 so the parent has content and the outline is true.
//
//   Sentences tagged as headings.  "It's better to select any distinctive legal
//   name which recognize partners..." is an h2 on the old site. A heading that
//   long is a paragraph; it becomes one.
//
//   Stubs.  A second FAQ title with no questions under it, and the empty
//   "Contact forms" / "Analytics" sub-headings WordPress ships in its default
//   privacy policy. Removed.
//
// Anything empty that fits none of these is reported and left alone - that
// would be a real content gap, not something to hide.
//
//   node prune-orphan-headings.mjs          dry run
//   node prune-orphan-headings.mjs --write  apply
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const APP = 'D:/Google Drive/Work/Accendoz/Projects/BookMyTM/bookmytm-next';
const WRITE = process.argv.includes('--write');

// Also: any empty heading quoting a rupee price is a price-box label ("File for
// Rs. 2800"), and "Explore Other ISO Services" sat over a link list, like
// "Related Services".
const CTA = /^(?:register|apply|book|get certified|get started|get expert advice|related services|explore other|fast (?:&|and) secure|need expert|call expert|drop a mail|available on whatsapp|request callback)\b|(?:\bonline\b|\bnow\b)!?$|^(?:register|book|apply)\s.*\b(?:online|now)\b/i;
// A heading quoting a price is never removed: splitHero reads the page's price
// from it for the hero badge, the lead form and the Service schema, and never
// renders it. Deleting these once took the price off 31 pages.
const PRICE = /(?:rs\.?|₹)\s*[\d,]{3,}/i;
// The flat-container demotion is only safe where the parent/child relationship
// was verified by reading the pages: the company-registration family. Elsewhere
// an empty heading followed by same-level headings is as likely a sibling stub
// (the privacy policy's "Contact forms") as a parent.
const CONTAINER_PAGES = /^startup__(?:registrations|special-business-entities)__/;
const CTA_TEXT = /^(?:fast (?:&|and) (?:secure|professional)(?: process)?|need expert assistance\??|available on whatsapp|request callback|fill the details below.*|expert drafting service|legal transfer service|secure filing service|iso \d+ experts|get started in minutes|.{0,40}\bservice)$/i;
const SECTION = /^documents?\s+requir|\b(?:3|three)\s+(?:easy\s+)?steps\b|^(?:the\s+)?process\b|process\s+timeline|frequently asked|faq|^benefits?\b|^why\b|^advantages?\b/i;
const FAQ = /frequently asked|faq/i;
const LEGAL = /^(privacy-policy|terms-and-conditions|cancellation-refund-policy)$/;
const words = (t) => t.trim().split(/\s+/).length;

const tally = { cta: 0, demoted: 0, sentence: 0, stub: 0, kept: 0 };
let filesTouched = 0;
const files = readdirSync(join(APP, 'content')).filter((f) => f.endsWith('.json') && f !== 'test.json');

for (const f of files) {
  const slug = f.replace(/\.json$/, '');
  const file = join(APP, 'content', f);
  const doc = JSON.parse(readFileSync(file, 'utf8'));
  let b = doc.blocks;
  let changed = false;
  const log = (what, i) => { if (!WRITE) console.log(`  ${what.padEnd(8)} ${slug}  h${b[i].level} "${b[i].text.slice(0, 70)}"`); };

  // The first heading is the page title: splitHero lifts it into the <h1>, so
  // the h2 that follows it is a sibling, not a child. Never treat it as empty.
  const titleIdx = b.findIndex((x) => x.type === 'heading');
  const isTitle = (i) => i === titleIdx || (b[i].text || '').trim() === (doc.h1 || '').trim();

  // Pass 1: containers, sentences and footnotes (change levels/types, no deletion)
  for (let i = 0; i < b.length; i++) {
    if (b[i].type !== 'heading' || b[i].level === 1 || isTitle(i)) continue;
    const L = b[i].level;
    let j = i + 1;
    while (j < b.length && !(b[j].type === 'heading' && b[j].level <= L)) j++;
    const hasContent = b.slice(i + 1, j).some((x) => !(x.type === 'paragraph' && CTA_TEXT.test(x.text.trim())) && x.type !== 'cta' && x.type !== 'form');
    if (hasContent) continue;

    // "Govt fee extra", "Based on billing": price footnotes the old site tagged h6.
    if (L >= 5) {
      log('footnote', i);
      b[i] = { type: 'paragraph', text: b[i].text };
      tally.sentence++; changed = true;
      continue;
    }
    if (words(b[i].text) >= 14 && !/\?$/.test(b[i].text.trim())) {
      log('sentence', i);
      b[i] = { type: 'paragraph', text: b[i].text };
      tally.sentence++; changed = true;
      continue;
    }
    // An empty non-CTA, non-section heading whose following same-level headings
    // carry content and are not sections themselves: those are its children.
    if (CONTAINER_PAGES.test(slug) && !CTA.test(b[i].text) && !SECTION.test(b[i].text) && b[j]?.type === 'heading' && b[j].level === L && !SECTION.test(b[j].text) && !CTA.test(b[j].text)) {
      let k = j, n = 0;
      while (k < b.length && b[k].type === 'heading' && b[k].level === L && !SECTION.test(b[k].text) && !CTA.test(b[k].text)) {
        // the child must itself have content before the next heading
        let m = k + 1;
        while (m < b.length && b[m].type !== 'heading') m++;
        if (m === k + 1) break;
        b[k].level = L + 1; n++;
        k = m;
      }
      if (n) { log('demote', i); if (!WRITE) console.log(`           -> ${n} following h${L} heading(s) demoted to h${L + 1}`); tally.demoted += n; changed = true; }
    }
  }

  // Pass 2: removals
  const drop = new Set();
  const hasFaqElsewhere = b.some((x) => x.type === 'faq') || b.filter((x) => x.type === 'heading' && FAQ.test(x.text)).length > 1;
  for (let i = 0; i < b.length; i++) {
    if (b[i].type !== 'heading' || b[i].level === 1 || drop.has(i) || isTitle(i)) continue;
    const L = b[i].level;
    let j = i + 1;
    while (j < b.length && !(b[j].type === 'heading' && b[j].level <= L)) j++;
    const between = b.slice(i + 1, j);
    const substantive = between.filter((x) => !(x.type === 'paragraph' && CTA_TEXT.test(x.text.trim())) && x.type !== 'cta' && x.type !== 'form');
    if (substantive.length) continue;
    const text = b[i].text.trim();
    if (PRICE.test(text)) continue;
    let why = null;
    if (CTA.test(text)) why = 'cta';
    else if (FAQ.test(text) && hasFaqElsewhere && !between.length) why = 'stub';
    else if (LEGAL.test(slug) && !between.length) why = 'stub';
    if (why) {
      drop.add(i); for (let k = i + 1; k < j; k++) drop.add(k);
      tally[why]++; log(why, i); changed = true;
    } else { tally.kept++; console.log(`  KEEP?    ${slug}  h${L} "${text.slice(0, 70)}"  <- empty, no rule applies`); }
  }
  if (drop.size) b = b.filter((_, i) => !drop.has(i));

  if (changed) {
    filesTouched++;
    if (WRITE) { doc.blocks = b; writeFileSync(file, JSON.stringify(doc, null, 2) + '\n'); }
  }
}
console.log(`\n${WRITE ? 'applied' : 'would apply'} on ${filesTouched} pages — CTA headings removed: ${tally.cta}, children demoted: ${tally.demoted}, sentences→paragraphs: ${tally.sentence}, stubs removed: ${tally.stub}, left for review: ${tally.kept}`);
