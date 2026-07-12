import Link from 'next/link';
import { SITE } from '@/lib/site';

type Crumb = { label: string; href: string };

export default function PageHero({
  title,
  lead,
  price,
  crumbs,
}: {
  title: string;
  lead?: string;
  price?: string;
  crumbs: Crumb[];
}) {
  return (
    <section className="hero-bg relative overflow-hidden rounded-b-[3rem]">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -left-4 top-0 h-96 w-96 rounded-full bg-green-300 opacity-5 blur-3xl" />
        <div className="animate-blob-2 absolute right-0 top-1/4 h-72 w-72 rounded-full bg-green-400 opacity-5 blur-3xl" />
      </div>

      <div className="container-site relative z-10 py-16 md:py-24">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
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
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-[#3a6a2c]"
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
        </div>
      </div>
    </section>
  );
}
