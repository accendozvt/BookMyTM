'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV, SITE } from '@/lib/site';

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 flex-shrink-0 stroke-current transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      fill="none"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [openCol, setOpenCol] = useState<string | null>(null);

  return (
    <header className="hero-bg sticky top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex h-20 max-w-[1300px] items-center justify-between px-5">
        <Link href="/" aria-label="BookMyTM Home" className="flex-shrink-0">
          <Image src="/images/bookmytm-white.png" alt="BookMyTM Logo" width={150} height={45} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-8">
            {NAV.map((cat, catIndex) => {
              const anchorRight = catIndex >= NAV.length - 2;
              const singleCol = cat.columns.length === 1;
              return (
                <li key={cat.label} className="group relative">
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1.5 whitespace-nowrap py-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-80"
                  >
                    {cat.label}
                    <span className="text-white group-hover:rotate-180 transition-transform duration-300">
                      <Chevron />
                    </span>
                  </Link>
                  {/* Megamenu */}
                  <div
                    className={`invisible absolute top-full z-50 w-max max-w-[92vw] translate-y-1 overflow-hidden rounded-2xl border border-gray-200/70 bg-white opacity-0 shadow-[0_24px_60px_rgba(2,26,15,0.18)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                      anchorRight ? 'right-0' : 'left-1/2 -translate-x-1/2 group-hover:-translate-x-1/2'
                    }`}
                  >
                    <div className="flex">
                      {/* link columns */}
                      <div className="flex gap-8 p-7">
                        {cat.columns.map((col) => (
                          <div key={col.title} className={singleCol ? 'w-80' : 'w-52'}>
                            <Link
                              href={col.href}
                              className="group/col mb-3 flex items-center gap-1.5 border-b-2 border-brand/70 pb-2 text-[12px] font-extrabold uppercase tracking-wider text-brand transition-colors hover:text-brand-dark"
                            >
                              {col.title}
                              <svg className="h-3 w-3 opacity-0 transition-opacity group-hover/col:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                            <div className={singleCol ? 'grid grid-cols-2 gap-x-4 gap-y-0.5' : 'flex flex-col gap-0.5'}>
                              {col.links.map((l) => (
                                <Link
                                  key={l.href}
                                  href={l.href}
                                  className="rounded-md px-2 py-1.5 text-[13.5px] font-medium text-gray-600 transition-colors hover:bg-brand-surface hover:text-brand"
                                >
                                  {l.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* promo panel */}
                      <Link
                        href={cat.href}
                        className="relative hidden w-56 flex-shrink-0 overflow-hidden xl:block"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cat.promo.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#021a0f] via-[#0a351f]/80 to-[#0a351f]/30" />
                        <div className="relative flex h-full flex-col justify-end p-6 text-white">
                          <p className="text-[15px] font-extrabold leading-snug">{cat.promo.title}</p>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-green-100/80">{cat.promo.text}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider text-brand-light">
                            View all
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden flex-shrink-0 lg:block">
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand shadow transition hover:-translate-y-0.5 hover:bg-green-50"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-1 text-3xl text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="hero-bg absolute left-0 right-0 top-full z-40 max-h-[85vh] overflow-y-auto border-t border-white/10 shadow-2xl lg:hidden">
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
                        >
                          {col.title}
                          <span>{openCol === col.title ? '−' : '+'}</span>
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
    </header>
  );
}
