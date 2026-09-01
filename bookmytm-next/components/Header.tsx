import Link from 'next/link';
import Image from 'next/image';
import { NAV } from '@/lib/site';
import MobileMenu from '@/components/MobileMenu';

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
  return (
    <header className="hero-bg sticky top-0 z-50 border-b border-white/10">
      <div className="mx-auto flex h-20 max-w-[1300px] items-center justify-between px-5">
        <Link href="/" aria-label="BookMyTM Home" className="flex-shrink-0">
          <Image src="/images/logo.webp" alt="BookMyTM Logo" width={150} height={45} priority />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-8">
            {NAV.map((cat, catIndex) => {
              const anchorLeft = catIndex === 0;
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
                      anchorLeft ? 'left-0' : anchorRight ? 'right-0' : 'left-1/2 -translate-x-1/2 group-hover:-translate-x-1/2'
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
                        <img src={cat.promo.image} alt="" width={224} height={320} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
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

        <MobileMenu />
      </div>

    </header>
  );
}
