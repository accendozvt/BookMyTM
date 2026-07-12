import Link from 'next/link';
import Faq, { FaqItem } from '@/components/Faq';
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
      if (m && /apply|register|online|now|get|start/i.test(b.text)) price = 'Rs. ' + m[1].replace(/,/g, ',');
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
    if (b.type === 'heading' && PRICE_RE.test(b.text) && /apply|register|online/i.test(b.text)) continue;
    if (b.type === 'cta' || b.type === 'form' || b.type === 'map') continue;
    if (b.type === 'heading' && b.level === 1) continue;
    body.push(b);
  }
  return { h1, lead, price, body };
}

type Section = { heading: string | null; blocks: Block[] };

function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let cur: Section = { heading: null, blocks: [] };
  for (const b of blocks) {
    const isFaqHeading = b.type === 'heading' && b.level <= 3 && /frequently asked|faq/i.test(b.text);
    if (b.type === 'heading' && (b.level === 2 || isFaqHeading)) {
      if (cur.heading || cur.blocks.length) sections.push(cur);
      cur = { heading: b.text, blocks: [] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.heading || cur.blocks.length) sections.push(cur);
  return sections;
}

type Card = { title: string; text: string };

/** Detect runs of (h3/h4 heading + paragraphs) pairs → card grids */
function detectCards(blocks: Block[]): { cards: Card[]; rest: Block[] } | null {
  const cards: Card[] = [];
  const rest: Block[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    const next = blocks[i + 1];
    if (b.type === 'heading' && b.level >= 3 && (next?.type === 'paragraph' || next?.type === 'list')) {
      let text = '';
      let j = i + 1;
      while (j < blocks.length && (blocks[j].type === 'paragraph' || blocks[j].type === 'list')) {
        const nb = blocks[j];
        if (nb.type === 'paragraph') text += (text ? ' ' : '') + nb.text;
        if (nb.type === 'list') text += (text ? ' ' : '') + nb.items.join(' · ');
        j++;
      }
      cards.push({ title: b.text, text });
      i = j;
    } else {
      rest.push(b);
      i++;
    }
  }
  return cards.length >= 2 ? { cards, rest } : null;
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

function SectionHeading({ text }: { text: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">{text}</h2>
      <div className="mt-3 h-1 w-14 rounded-full bg-brand" />
    </div>
  );
}

function CardGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((c, i) => (
        <Reveal key={i} delay={i * 60}>
          <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-surface text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
              <IconFor text={c.title} className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-[17px] font-bold text-gray-900">{c.title}</h3>
            <p className="text-[15px] leading-relaxed text-gray-600">{c.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Timeline({ cards }: { cards: Card[] }) {
  return (
    <ol className="relative space-y-8 border-l-2 border-brand/20 pl-8">
      {cards.map((c, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white ring-4 ring-brand-surface">
            {i + 1}
          </span>
          <h3 className="text-[16px] font-bold text-gray-900">{c.title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-gray-600">{c.text}</p>
        </li>
      ))}
    </ol>
  );
}

function renderBasicBlock(b: Block, key: number) {
  switch (b.type) {
    case 'heading':
      return (
        <h3 key={key} className="pt-2 text-lg font-bold text-gray-900 md:text-xl">
          {b.text}
        </h3>
      );
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
          <img src={b.src} alt={b.alt} className="max-h-[420px] rounded-2xl shadow-lg" loading="lazy" />
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

  return (
    <div className="space-y-14">
      {sections.map((section, si) => {
        const isFaq = section.heading && /frequently asked|faq/i.test(section.heading);

        if (isFaq) {
          const items = toFaqItems(section.blocks);
          return (
            <section key={si} id="faq">
              <SectionHeading text={section.heading!} />
              {items.length ? <Faq items={items} /> : <div className="space-y-4">{section.blocks.map((b, i) => renderBasicBlock(b, i))}</div>}
            </section>
          );
        }

        const imageBoxes = section.blocks.filter((b) => b.type === 'imageBox');
        const nonBoxes = section.blocks.filter((b) => b.type !== 'imageBox' && b.type !== 'faq');
        const inlineFaqs = section.blocks.filter((b) => b.type === 'faq') as Extract<Block, { type: 'faq' }>[];
        const cardDetect = detectCards(nonBoxes);
        const showImage = si === 0 && sectionImage;

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
                  loading="lazy"
                />
              </Reveal>
            )}
            <div className="space-y-4">{(cardDetect ? cardDetect.rest : nonBoxes).map((b, i) => renderBasicBlock(b, i))}</div>

            {cardDetect &&
              (isTimeline(cardDetect.cards) ? (
                <div className="mt-8 rounded-3xl bg-brand-surface p-8">
                  <Timeline cards={cardDetect.cards} />
                </div>
              ) : (
                <div className="mt-8">
                  <CardGrid cards={cardDetect.cards} />
                </div>
              ))}

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
                <Faq items={inlineFaqs.flatMap((f) => f.items)} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
