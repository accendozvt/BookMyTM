'use client';

import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * Branded 500 for runtime errors inside a route segment. There was no error
 * boundary at all, so any thrown error fell through to Next's unstyled default.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -left-10 top-0 h-96 w-96 rounded-full bg-green-300 opacity-[0.07] blur-3xl" />
        <div className="animate-blob-2 absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green-400 opacity-[0.06] blur-3xl" />
      </div>

      <div className="container-site relative z-10 flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
        <p className="bg-gradient-to-r from-green-200 via-green-100 to-white bg-clip-text text-[110px] font-extrabold leading-none tracking-tight text-transparent md:text-[160px]">
          500
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">Something went wrong at our end</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-green-100/90">
          This one is on us, not you. Try again in a moment — and if it keeps happening, our team is a message away and
          happy to help directly.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-9 py-4 text-base font-extrabold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-[#2f5622]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-9 py-4 text-base font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-green-100/80">
          Need help now? Call{' '}
          <a href={SITE.phone1Href} className="font-bold text-white underline underline-offset-4">
            {SITE.phone1}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${SITE.email}`} className="font-bold text-white underline underline-offset-4">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
