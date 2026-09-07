import Link from 'next/link';
import type { FaqItem } from '@/components/Faq';
// Two columns, as on the home page: a service page's FAQ runs to a dozen items
// and a single column of them was most of the page's scroll height.
import FaqColumns from '@/components/FaqColumns';
import Reveal from '@/components/Reveal';
import { IconFor } from '@/components/icons';
import type { Block } from '@/lib/content';

/* Boilerplate fragments already represented in the hero / form — filtered from body */
const BOILERPLATE = [
  /^drop a mail$/i,
  /^cc@bookmytm\.com$/i,
  /^available on whatsapp$/i,
  /^request callback$/i,
  /^get expert advice$/i,
  /^fill the details below/i,
  /^get started in minutes$/i,
  /^expert guidance & support$/i,
  /^get certified now!?$/i,
  /^get certified!?$/i,
  /^apply now for rs/i,
  /^register online for rs/i,
  /^apply online for rs/i,
  /^call expert/i,
  /^need expert assistance\??$/i,
  /^fast & secure process$/i,
  /^iso \d+ experts?$/i,
  /^talk to our experts?$/i,
  /^\*?subject to govt processing time\*?$/i,
];

export function isBoilerplate(text: string): boolean {
  return BOILERPLATE.some((r) => r.test(text.trim()));
}

const PRICE_RE = /rs\.?\s*([\d,]{3,})/i;

/** Extract hero info (h1, lead paragraph, price) and return remaining body blocks. */
export function splitHero(blocks: Block[]) {
  let h1 = '';
  let lead = '';
  let price = '';
  const body: Block[] = [];

  blocks.forEach((b, i) => {
    // price: any heading/paragraph mentioning Rs. within the first 15 blocks
    if (!price && i < 15 && (b.type === 'heading' || b.type === 'paragraph')) {
      const m = b.text.match(PRICE_RE);
      // "File for Rs. 2800" and "Book Hearing for Rs. 5000" are price CTAs too;
      // without book|file they yielded no price and rendered as bare headings.
      if (m && /apply|register|online|now|get|start|book|file/i.test(b.text)) price = 'Rs. ' + m[1].replace(/,/g, ',');
    }
  });

  let heroDone = false;
  for (const b of blocks) {
    if (!heroDone) {
      if (b.type === 'heading' && b.level === 1 && !h1) { h1 = b.text; continue; }
      if (b.type === 'paragraph' && h1 && !lead && !isBoilerplate(b.text)) { lead = b.text; continue; }
      if (
        b.type === 'cta' ||
        (b.type === 'paragraph' && isBoilerplate(b.text)) ||
        (b.type === 'heading' && (isBoilerplate(b.text) || PRICE_RE.test(b.text)))
      ) {
        continue;
      }
      heroDone = true;
    }
    if ((b.type === 'paragraph' || b.type === 'heading') && isBoilerplate(b.text)) continue;
    // Every price CTA heading is consumed here - it feeds the hero badge, the
    // lead form and the Service offer, and is never body content.
    if (b.type === 'heading' && PRICE_RE.test(b.text) && /apply|register|online|book|file|now/i.test(b.text)) continue;
    if (b.type === 'cta' || b.type === 'form' || b.type === 'map') continue;
    if (b.type === 'heading' && b.level === 1) continue;
    body.push(b);
  }
  return { h1, lead, price, body };
}

type Section = { heading: string | null; blocks: Block[] };

/**
 * Does the heading at `i` open a section? Always for h2 and for an FAQ title.
 * Also for an h3 whose first following heading is deeper (h4+): that h3 is a
 * parent, not a card. Without this rule, pages that titled their sub-sections
 * with h3 — "Benefits of ISO Registration", "Document Required for ISO 9001" —
 * collapsed into one section: every h3 title rendered as a bare orphan line and
 * all the h4 cards from every sub-section merged into a single grid.
 */
function startsSection(blocks: Block[], i: number): boolean {
  const b = blocks[i];
  if (b.type !== 'heading') return false;
  if (b.level === 2) return true;
  if (b.level <= 3 && /frequently asked|faq/i.test(b.text)) return true;
  if (b.level === 3) {
    for (let j = i + 1; j < blocks.length; j++) {
      const n = blocks[j];
      if (n.type === 'heading') return n.level > 3;
    }
  }
  return false;
}

function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let cur: Section = { heading: null, blocks: [] };
  blocks.forEach((b, i) => {
    if (startsSection(blocks, i)) {
      if (cur.heading || cur.blocks.length) sections.push(cur);
      cur = { heading: (b as { text: string }).text, blocks: [] };
    } else {
      cur.blocks.push(b);
    }
  });
  if (cur.heading || cur.blocks.length) sections.push(cur);
  return sections;
}

/**
 * `items` keeps a list as a list. They used to be joined into the text with
 * " · ", which turned Day 01's six process steps into one run-on line and lost
 * the list markup that assistants and screen readers read as discrete steps.
 */
type Card = { title: string; level: number; text: string; items?: string[] };

type Segment = { kind: 'blocks'; blocks: Block[] } | { kind: 'cards'; cards: Card[] };

/**
 * Split a section's blocks, in order, into prose runs and card runs.
 *
 * A run of two or more (h3/h4 heading + paragraphs/lists) pairs becomes a card
 * grid rendered where it occurs. The earlier version pulled every card out of
 * the section and rendered them all after the prose, so a container heading
 * like "Key Clauses and Implementation Depth" ended up as a bare line with its
 * own clauses in a grid further down, mixed with cards from other containers.
 * A lone pair stays as heading and text.
 */
function segment(blocks: Block[]): Segment[] {
  const segs: Segment[] = [];
  let plain: Block[] = [];
  let run: { card: Card; src: Block[] }[] = [];
  const flushPlain = () => {
    if (plain.length) segs.push({ kind: 'blocks', blocks: plain });
    plain = [];
  };
  const flushRun = () => {
    if (run.length >= 2) {
      flushPlain();
      segs.push({ kind: 'cards', cards: run.map((r) => r.card) });
    } else if (run.length === 1) {
      plain.push(...run[0].src);
    }
    run = [];
  };
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    const next = blocks[i + 1];
    if (b.type === 'heading' && b.level >= 3 && (next?.type === 'paragraph' || next?.type === 'list')) {
      let text = '';
      const items: string[] = [];
      let j = i + 1;
      while (j < blocks.length && (blocks[j].type === 'paragraph' || blocks[j].type === 'list')) {
        const nb = blocks[j];
        if (nb.type === 'paragraph') text += (text ? ' ' : '') + nb.text;
        if (nb.type === 'list') items.push(...nb.items);
        j++;
      }
      // A heading with an intro paragraph whose next heading is deeper is a
      // container introducing its own cards, not the first card of the run.
      const after = blocks[j];
      const isContainer = after?.type === 'heading' && after.level > b.level && (blocks[j + 1]?.type === 'paragraph' || blocks[j + 1]?.type === 'list');
      if (isContainer) {
        flushRun();
        plain.push(...blocks.slice(i, j));
      } else {
        run.push({ card: { title: b.text, level: b.level, text, ...(items.length ? { items } : {}) }, src: blocks.slice(i, j) });
      }
      i = j;
    } else {
      flushRun();
      plain.push(b);
      i++;
    }
  }
  flushRun();
  flushPlain();
  return segs;
}

function toFaqItems(blocks: Block[]): FaqItem[] {
  const items: FaqItem[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'faq') {
      items.push(...b.items);
      i++;
    } else if (b.type === 'heading' && b.level >= 3) {
      let a = '';
      let j = i + 1;
      while (j < blocks.length && (blocks[j].type === 'paragraph' || blocks[j].type === 'list')) {
        const nb = blocks[j];
        if (nb.type === 'paragraph') a += (a ? ' ' : '') + nb.text;
        if (nb.type === 'list') a += (a ? ' ' : '') + nb.items.join(' · ');
        j++;
      }
      if (a) items.push({ q: b.text.replace(/^\d+\.\s*/, ''), a });
      i = j;
    } else {
      i++;
    }
  }
  return items;
}

export function collectFaqItems(blocks: Block[]): FaqItem[] {
  const sections = groupSections(blocks);
  const out: FaqItem[] = [];
  for (const s of sections) {
    if (s.heading && /frequently asked|faq/i.test(s.heading)) out.push(...toFaqItems(s.blocks));
    else out.push(...s.blocks.filter((b) => b.type === 'faq').flatMap((b) => (b as { items: FaqItem[] }).items));
  }
  return out;
}

const isTimeline = (cards: Card[]) => cards.length >= 2 && cards.every((c) => /^(day|step|week)\s*\d/i.test(c.title));

const isStepsHeading = (t: string | null) => !!t && /\b(?:3|three)\s+(?:easy\s+)?steps\b/i.test(t);
const isProcessHeading = (t: string | null) => !!t && /^(?:the\s+)?process\b|process\s+timeline|^process\s+(?:of|to)\b/i.test(t);

/**
 * Group section indices for rendering. "…in 3 Easy Steps" directly followed by
 * "The Process…" (or the reverse) becomes a pair rendered side by side on large
 * screens, which is how the old site laid the two timelines out. Everything
 * else stays a single full-width section.
 */
function pairStepsAndProcess(sections: Section[]): number[][] {
  const groups: number[][] = [];
  for (let i = 0; i < sections.length; i++) {
    const a = sections[i].heading;
    const b = sections[i + 1]?.heading ?? null;
    const pair = (isStepsHeading(a) && isProcessHeading(b)) || (isProcessHeading(a) && isStepsHeading(b));
    if (pair) {
      groups.push([i, i + 1]);
      i++;
    } else groups.push([i]);
  }
  return groups;
}

function SectionHeading({ text }: { text: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">{text}</h2>
      <div className="mt-3 h-1 w-14 rounded-full bg-brand" />
    </div>
  );
}

/** A card's body: its paragraph text, then its list as a real list. */
function CardBody({ card, className = '' }: { card: Card; className?: string }) {
  return (
    <>
      {card.text && <p className={`text-[15px] leading-relaxed text-gray-600 ${className}`}>{card.text}</p>}
      {card.items && (
        <ul className={`space-y-1.5 ${card.text ? 'mt-3' : className}`}>
          {card.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-gray-600">
              <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/**
 * `titleTag` is chosen by the section from the cards' depth, so cards that sit
 * under a container heading nest beneath it (h4 under an h3) instead of
 * reading as the container's siblings.
 */
function CardGrid({ cards, titleTag: Tag = 'h3' }: { cards: Card[]; titleTag?: HeadingTag }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((c, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-surface text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
              <IconFor text={c.title} className="h-6 w-6" />
            </div>
            <Tag className="mb-2 text-[17px] font-bold text-gray-900">{c.title}</Tag>
            <CardBody card={c} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Timeline({ cards, titleTag: Tag = 'h3' }: { cards: Card[]; titleTag?: HeadingTag }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-brand/20 pl-8">
      {cards.map((c, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white ring-4 ring-brand-surface">
            {i + 1}
          </span>
          <Tag className="text-[16px] font-bold text-gray-900">{c.title}</Tag>
          <CardBody card={c} className="mt-1" />
        </li>
      ))}
    </ol>
  );
}

type HeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Map source heading levels, in document order, to tags that never skip: the
 * first becomes `base`, a deeper source level steps one down from its parent,
 * a shallower one returns to the tag its own level last had.
 */
function clampLevels(levels: number[], base: number): HeadingTag[] {
  const out: HeadingTag[] = [];
  const stack: { level: number; tag: number }[] = [];
  for (const lv of levels) {
    while (stack.length && stack[stack.length - 1].level >= lv) stack.pop();
    const tag = stack.length ? Math.min(6, stack[stack.length - 1].tag + 1) : base;
    stack.push({ level: lv, tag });
    out.push(`h${tag}` as HeadingTag);
  }
  return out;
}

function renderBasicBlock(b: Block, key: number, headingTag: HeadingTag = 'h3') {
  switch (b.type) {
    case 'heading': {
      // The tag is decided by the caller from the heading's depth within its
      // section, so a container and the sub-headings under it keep their
      // relationship without ever skipping a level.
      const Tag = headingTag;
      return (
        <Tag key={key} className="pt-2 text-lg font-bold text-gray-900 md:text-xl">
          {b.text}
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p key={key} className="text-base leading-[1.75] text-gray-600">
          {b.text}
        </p>
      );
    case 'list':
      return (
        <ul key={key} className={`grid gap-2.5 ${b.items.length > 5 ? 'sm:grid-cols-2' : ''}`}>
          {b.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[15px] leading-relaxed text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={key} className="overflow-x-auto rounded-2xl ring-1 ring-gray-200">
          <table className="w-full text-left text-sm">
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? 'bg-brand text-white' : ri % 2 ? 'bg-gray-50' : 'bg-white'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-5 py-3.5 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'image':
      return b.src ? (
        <div key={key} className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.src} alt={b.alt} className="max-h-[420px] rounded-2xl shadow-lg" loading="lazy" decoding="async" />
        </div>
      ) : null;
    case 'imageBox':
      return (
        <div
          key={key}
          className="group h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-xl"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-surface text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
            <IconFor text={b.title + ' ' + b.text} className="h-6 w-6" />
          </div>
          <h3 className="mb-1.5 text-[16px] font-bold text-gray-900">{b.title}</h3>
          <p className="text-sm leading-relaxed text-gray-600">{b.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function Blocks({
  blocks,
  sectionImage,
}: {
  blocks: Block[];
  sectionImage?: { src: string; alt: string };
}) {
  const sections = groupSections(blocks);

  const renderSection = (section: Section, si: number) => {
        const isFaq = section.heading && /frequently asked|faq/i.test(section.heading);

        if (isFaq) {
          const items = toFaqItems(section.blocks);
          // Only the first FAQ section carries the anchor id — a few pages have
          // two FAQ-titled sections, which produced a duplicate id="faq".
          const isFirstFaq =
            sections.findIndex((s) => s.heading && /frequently asked|faq/i.test(s.heading)) === si;
          return (
            <section key={si} {...(isFirstFaq ? { id: 'faq' } : {})}>
              <SectionHeading text={section.heading!} />
              {items.length ? <FaqColumns items={items} /> : <div className="space-y-4">{section.blocks.map((b, i) => renderBasicBlock(b, i, section.heading ? 'h3' : 'h2'))}</div>}
            </section>
          );
        }

        const imageBoxes = section.blocks.filter((b) => b.type === 'imageBox');
        const nonBoxes = section.blocks.filter((b) => b.type !== 'imageBox' && b.type !== 'faq');
        const inlineFaqs = section.blocks.filter((b) => b.type === 'faq') as Extract<Block, { type: 'faq' }>[];
        const segments = segment(nonBoxes);
        const showImage = si === 0 && sectionImage;
        // Heading tags are assigned in document order and clamped so no heading
        // sits more than one level below the one before it: the first heading
        // goes directly under the section title, a deeper source level nests one
        // step down, a shallower one returns to its parent's step. Assigning from
        // the section's shallowest level instead let an h4 card grid that came
        // before the section's first h3 render as h4 straight after the h2.
        const base = section.heading ? 3 : 2;
        const order: number[] = [];
        for (const s of segments) {
          if (s.kind === 'blocks') {
            for (const b of s.blocks) if (b.type === 'heading') order.push(b.level);
          } else {
            order.push(s.cards[0].level);
          }
        }
        const tags = clampLevels(order, base);
        let hi = 0;
        const segTags = segments.map((s) => (s.kind === 'blocks' ? s.blocks.map((b) => (b.type === 'heading' ? tags[hi++] : 'h3')) : [tags[hi++]]));

        return (
          <section key={si}>
            {section.heading && <SectionHeading text={section.heading} />}

            {showImage && (
              <Reveal className="mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sectionImage.src}
                  alt={sectionImage.alt}
                  width={1200}
                  height={450}
                  className="aspect-[16/6] w-full rounded-2xl object-cover shadow-md ring-1 ring-gray-200/60"
                  loading="lazy" decoding="async"
                />
              </Reveal>
            )}
            <div className="space-y-8">
              {segments.map((seg, gi) =>
                seg.kind === 'blocks' ? (
                  <div key={gi} className="space-y-4">
                    {seg.blocks.map((b, i) => renderBasicBlock(b, i, segTags[gi][i]))}
                  </div>
                ) : isTimeline(seg.cards) ? (
                  <div key={gi} className="rounded-3xl bg-brand-surface p-8">
                    <Timeline cards={seg.cards} titleTag={segTags[gi][0]} />
                  </div>
                ) : (
                  <CardGrid key={gi} cards={seg.cards} titleTag={segTags[gi][0]} />
                ),
              )}
            </div>

            {imageBoxes.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {imageBoxes.map((b, i) => (
                  <Reveal key={i} delay={i * 60}>
                    {renderBasicBlock(b, i + 1000)}
                  </Reveal>
                ))}
              </div>
            )}

            {inlineFaqs.length > 0 && (
              <div className="mt-8">
                <FaqColumns items={inlineFaqs.flatMap((f) => f.items)} />
              </div>
            )}
          </section>
        );
  };

  return (
    <div className="space-y-14">
      {pairStepsAndProcess(sections).map((g) =>
        g.length === 2 ? (
          <div key={g[0]} className="grid gap-10 lg:grid-cols-2 lg:items-start">
            {renderSection(sections[g[0]], g[0])}
            {renderSection(sections[g[1]], g[1])}
          </div>
        ) : (
          renderSection(sections[g[0]], g[0])
        ),
      )}
    </div>
  );
}
