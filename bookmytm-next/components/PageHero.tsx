import type { ReactNode } from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

type Crumb = { label: string; href: string };

export default function PageHero({
  title,
  lead,
  price,
  crumbs,
  aside,
  points,
}: {
  title: string;
  lead?: string;
  price?: string;
  crumbs: Crumb[];
  /**
   * Rendered to the right of the title on large screens, beneath it on small,
   * and entirely within the hero. The service pages put their lead form here so
   * the body below can run the full width instead of sharing it with a sidebar.
   * The title column is centred against it, so a form taller than the text
   * leaves even space above and below rather than a band at the bottom.
   */
  aside?: ReactNode;
  /** Short trust points, laid out under the buttons to fill the title column. */
  points?: string[];
}) {
  return (
    <section className="hero-bg relative overflow-hidden rounded-b-[3rem]">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -left-4 top-0 h-96 w-96 rounded-full bg-green-300 opacity-5 blur-3xl" />
        <div className="animate-blob-2 absolute right-0 top-1/4 h-72 w-72 rounded-full bg-green-400 opacity-5 blur-3xl" />
      </div>

      {/* With a form beside the title the form sets the height, so the hero's own
          padding is trimmed on large screens to keep the whole block compact. */}
      <div className={`container-site relative z-10 py-16 md:py-24 ${aside ? 'lg:py-12' : ''}`}>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className={aside ? 'mb-4' : 'mb-6'}>
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {i === crumbs.length - 1 ? (
                  <span className="text-brand-light">{c.label}</span>
                ) : (
                  <Link href={c.href} className="transition hover:text-white">
                    {c.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className={aside ? 'grid gap-10 lg:grid-cols-[minmax(0,1fr),440px] lg:items-center lg:gap-16' : ''}>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
          {lead && <p className="mt-5 text-lg leading-relaxed text-green-100/90 md:text-xl">{lead}</p>}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {price && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping-dot absolute inset-0 rounded-full bg-green-400 opacity-75" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                Starting at {price}
              </span>
            )}
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-[#2f5622]"
            >
              Apply Now
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href={SITE.phone1Href}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l1.14-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {SITE.phone1}
            </a>
          </div>

          {points && points.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-brand-light">Why BookMyTM?</p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {points.map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-[15px] font-medium text-green-50/90">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-light">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {aside && <div className="relative z-10">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
