import Link from 'next/link';
import { Icon } from '@/components/icons';
import { NAV, SITE } from '@/lib/site';

export const metadata = {
  title: 'Page Not Found | BookMyTM',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="animate-blob absolute -left-10 top-0 h-96 w-96 rounded-full bg-green-300 opacity-[0.07] blur-3xl" />
        <div className="animate-blob-2 absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green-400 opacity-[0.06] blur-3xl" />
      </div>

      <div className="container-site relative z-10 flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
        <p className="bg-gradient-to-r from-green-200 via-green-100 to-white bg-clip-text text-[110px] font-extrabold leading-none tracking-tight text-transparent md:text-[160px]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">This page took an unexpected detour</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-green-100/90">
          The page you’re looking for may have moved or no longer exists. Let’s get you back on track — start with one
          of our services below.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-9 py-4 text-base font-extrabold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-[#3a6a2c]"
          >
            Back to Home
          </Link>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-9 py-4 text-base font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            Chat with an expert
          </a>
        </div>

        <div className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-5">
          {NAV.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-brand-light">
                <Icon name={iconForCat(cat.label)} className="h-5 w-5" />
              </span>
              <span className="text-[13px] font-bold leading-snug text-white">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function iconForCat(label: string): string {
  if (/startup/i.test(label)) return 'rocket';
  if (/iso/i.test(label)) return 'award';
  if (/intellectual/i.test(label)) return 'lightbulb';
  if (/compliance/i.test(label)) return 'shield';
  return 'briefcase';
}
