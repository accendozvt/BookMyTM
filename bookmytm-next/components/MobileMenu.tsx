'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV } from '@/lib/site';

/**
 * The only interactive part of the header.
 *
 * Split out so Header itself can stay a server component: the desktop megamenu
 * is pure CSS hover with no state, but marking the whole header 'use client'
 * meant ~250 nav nodes (67 categories, 79 links, 5 promo panels) hydrated on
 * every one of the 141 pages for the sake of this one toggle.
 *
 * The panel is `absolute`, and the nearest positioned ancestor is the sticky
 * <header>, so it still anchors to the header bar from inside this component.
 */
function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 flex-shrink-0 stroke-current transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function MobileMenu() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [openCol, setOpenCol] = useState<string | null>(null);

  return (
    <>
      <button
        className="flex h-12 w-12 items-center justify-center p-1 text-3xl text-white lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Menu"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="hero-bg absolute left-0 right-0 top-full z-40 max-h-[85vh] overflow-y-auto border-t border-white/10 shadow-2xl lg:hidden"
        >
          <ul>
            {NAV.map((cat) => (
              <li key={cat.label} className="border-b border-white/10">
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-[15px] font-semibold text-white"
                  onClick={() => setOpenCat(openCat === cat.label ? null : cat.label)}
                  aria-expanded={openCat === cat.label}
                >
                  {cat.label}
                  <Chevron open={openCat === cat.label} />
                </button>
                {openCat === cat.label && (
                  <div className="bg-black/20">
                    {cat.columns.map((col) => (
                      <div key={col.title} className="border-b border-white/5 px-5 py-4">
                        <button
                          className="flex w-full items-center justify-between text-sm font-bold text-brand-light"
                          onClick={() => setOpenCol(openCol === col.title ? null : col.title)}
                          aria-expanded={openCol === col.title}
                        >
                          {col.title}
                          <span aria-hidden>{openCol === col.title ? '−' : '+'}</span>
                        </button>
                        {(openCol === col.title || cat.columns.length === 1) && (
                          <div className="mt-2 flex flex-col">
                            {col.links.map((l) => (
                              <Link
                                key={l.href}
                                href={l.href}
                                className="py-2.5 text-sm text-white/75 hover:text-white"
                                onClick={() => setMobileOpen(false)}
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li className="p-5">
              <Link
                href="/contact/"
                className="block rounded-full bg-white py-3 text-center text-sm font-bold text-brand"
                onClick={() => setMobileOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
