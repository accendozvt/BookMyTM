import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';
import { listPosts, seoFor } from '@/lib/content';

export function generateMetadata(): Metadata {
  const seo = seoFor('/knowledge-base/');
  const title = seo?.title || 'Knowledge Base | BookMyTM';
  const description =
    seo?.description ||
    'Insights on trademark registration, ISO certification, intellectual property, and business compliance in India from the BookMyTM team.';
  return {
    title,
    description,
    alternates: { canonical: seo?.canonical || 'https://bookmytm.com/knowledge-base/' },
    openGraph: {
      title,
      description,
      url: 'https://bookmytm.com/knowledge-base/',
      siteName: 'BookMyTM',
      type: 'website',
      images: [{ url: '/assets/opengraph/preview.webp', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/opengraph/preview.webp'] },
  };
}

function fmtDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function KnowledgeBase() {
  const posts = listPosts();

  return (
    <>
      <PageHero
        title="Knowledge Base"
        lead="Insights and updates on trademarks, ISO certification, intellectual property, and business compliance in India."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Knowledge Base', href: '/knowledge-base/' },
        ]}
      />

      <section className="bg-white">
        <div className="container-site py-16 md:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 60}>
                <Link
                  href={`/${p.slug}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-brand-surface">
                    {p.featuredImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.featuredImage}
                        alt={p.h1}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={i < 6 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="hero-bg h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {p.datePublished && (
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">{fmtDate(p.datePublished)}</p>
                    )}
                    <h2 className="mb-3 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-brand">
                      {p.h1}
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-brand transition-all group-hover:gap-3">
                      Read Article
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
