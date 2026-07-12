'use client';

import { useState } from 'react';
import type { FaqItem } from '@/components/Faq';

function Column({ items, defaultOpen }: { items: FaqItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  return (
    <div className="grid content-start gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
              isOpen ? 'border-brand/30 shadow-lg shadow-brand/5' : 'border-gray-200 shadow-sm hover:border-brand/30'
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={`text-[15px] font-bold leading-snug ${isOpen ? 'text-brand' : 'text-gray-900'}`}>
                {item.q}
              </span>
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen ? 'rotate-180 bg-brand text-white' : 'bg-brand-surface text-brand'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4.5 pb-5 text-[14.5px] leading-relaxed text-gray-600">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Two-column FAQ accordion — one item open per column. */
export default function FaqColumns({ items }: { items: FaqItem[] }) {
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);
  return (
    <div className="grid items-start gap-3 lg:grid-cols-2 lg:gap-x-5">
      <Column items={left} defaultOpen={0} />
      <Column items={right} />
    </div>
  );
}
