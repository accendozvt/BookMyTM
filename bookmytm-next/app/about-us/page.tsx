import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Blocks, { splitHero } from '@/components/Blocks';
import CtaBand from '@/components/CtaBand';
import { loadContent, seoFor } from '@/lib/content';

export function generateMetadata(): Metadata {
  const seo = seoFor('/about-us/');
  const title = seo?.title || 'About Us | BookMyTM';
  const description =
    seo?.description ||
    'BookMyTM is India’s premier digital platform for trademark, IP protection, business registration, ISO certification, and compliance — headquartered in Kochi, Kerala.';
  const canonical = seo?.canonical || 'https://bookmytm.com/about-us/';
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'BookMyTM',
      type: 'website',
      images: [{ url: '/assets/opengraph/preview.webp', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/assets/opengraph/preview.webp'] },
  };
}

const STATS = [
  { num: '10k+', label: 'Trademarks Done' },
  { num: '15k+', label: 'End Users' },
  { num: '4.9★', label: 'Stars on Google' },
  { num: '8+', label: 'Years of Service' },
];

export default function AboutPage() {
  const content = loadContent('about-us');
  if (!content) return null;
  const { body } = splitHero(content.blocks);
  const lead =
    content.blocks.find((b) => b.type === 'paragraph' && b.text.length > 60)?.type === 'paragraph'
      ? (content.blocks.find((b) => b.type === 'paragraph' && b.text.length > 60) as { text: string }).text
      : undefined;

  return (
    <>
      <PageHero
        title={content.h1 || 'About BookMyTM'}
        lead={lead}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about-us/' },
        ]}
      />

      {/* credibility stats */}
      <section className="bg-white">
        <div className="container-site">
          <div className="relative z-20 -mt-10 grid grid-cols-2 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`p-6 text-center md:p-8 ${i < 3 ? 'md:border-r md:border-gray-100' : ''} ${i % 2 === 0 ? 'border-r border-gray-100' : ''} ${i < 2 ? 'border-b border-gray-100 md:border-b-0' : ''}`}
              >
                <div className="text-3xl font-extrabold tabular-nums text-brand md:text-4xl">{s.num}</div>
                <div className="mt-1 text-[11px] font-extrabold uppercase tracking-widest text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-site py-16 md:py-20">
          <Blocks blocks={body} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
