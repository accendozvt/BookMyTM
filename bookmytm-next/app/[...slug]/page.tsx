import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Blocks, { splitHero, collectFaqItems } from '@/components/Blocks';
import PageHero from '@/components/PageHero';
import CtaBand from '@/components/CtaBand';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
import { IconFor } from '@/components/icons';
import Article from '@/components/Article';
import { listContentSlugs, listPostSlugs, listPosts, loadContent, loadPost, pathToFileSlug, seoFor } from '@/lib/content';
import { childrenFor, NAV } from '@/lib/site';

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return [
    ...listContentSlugs().map((s) => ({ slug: s.split('__') })),
    ...listPostSlugs().map((s) => ({ slug: [s] })),
  ];
}

export const dynamicParams = false;

/** Trim page text to a description of <=158 chars at a word boundary. */
function toDescription(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= 158) return t;
  const cut = t.slice(0, 158);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

/** Description from CSV, else derived from the page's own lead content. */
function descriptionFor(slug: string[], seoDesc: string): string {
  if (seoDesc) return seoDesc;
  const post = slug.length === 1 ? loadPost(slug[0]) : null;
  const content = post || loadContent(pathToFileSlug(slug));
  if (!content) return '';
  const para = content.blocks.find(
    (b) => b.type === 'paragraph' && b.text.length > 60 && !/drop a mail|whatsapp|request callback/i.test(b.text),
  );
  if (para && para.type === 'paragraph') return toDescription(para.text);
  // hub pages have no prose of their own — describe them by the services they list
  const path = '/' + slug.join('/') + '/';
  const children = childrenFor(path);
  if (children.length) {
    const label = crumbsFor(slug).slice(-1)[0].label;
    return toDescription(
      `${label} services from BookMyTM: ${children.map((c) => c.label).join(', ')}. Expert support across India.`,
    );
  }
  return '';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.map((s) => decodeURIComponent(s));
  const path = '/' + slug.join('/') + '/';
  const seo = seoFor(path);
  if (!seo) return {};
  const post = slug.length === 1 ? loadPost(slug[0]) : null;
  const ogImage = post?.featuredImage || '/assets/opengraph/preview.webp';
  const description = descriptionFor(slug, seo.description);
  return {
    title: seo.title,
    description,
    alternates: { canonical: seo.canonical },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo.title,
      description,
      url: seo.canonical,
      siteName: 'BookMyTM',
      type: post ? 'article' : 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: seo.title }],
      ...(post?.datePublished ? { publishedTime: post.datePublished } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description,
      images: [ogImage],
    },
  };
}

function titleCase(s: string) {
  return s
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(Llp|Opc|Iso|Gst|Pan|Tan|Pf|Esi|Iec|Roc|Kyc|Inc|Dir|Ip|Fssai|Dsc)\b/gi, (m) => m.toUpperCase());
}

function crumbsFor(segments: string[]) {
  const crumbs = [{ label: 'Home', href: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    const href = acc + '/';
    const navLabel =
      NAV.find((c) => c.href === href)?.label ||
      NAV.flatMap((c) => c.columns.flatMap((col) => col.links)).find((l) => l.href === href)?.label;
    crumbs.push({ label: navLabel || titleCase(seg), href });
  }
  return crumbs;
}

/* Category → contextual image for the intro section (SEO) */
const CATEGORY_IMAGES: [RegExp, string][] = [
  [/trademark/, '/images/blog_06_trademark_objection.webp'],
  [/iso-certification/, '/images/blog_05_iso_quality_seal_1765545624585.webp'],
  [/patent|other-ip/, '/images/photo-1602216056096-3b40cc0c9944.jpg'],
  [/startup\/registrations/, '/images/photo-1497366216548-37526070297c.jpg'],
  [/special-business|other-registrations/, '/images/photo-1521791136064-7986c2920216.jpg'],
  [/statutory-compliance/, '/images/photo-1450101499163-c8848c66ca85.jpg'],
  [/winding-up/, '/images/photo-1556761175-5973dc0f32e7.jpg'],
  [/other-services/, '/images/photo-1552664730-d307ca884978.jpg'],
];

function imageForPath(path: string): string {
  for (const [re, src] of CATEGORY_IMAGES) if (re.test(path)) return src;
  return '/images/kerala_startup_trademark_16x9_v2.webp';
}

const NO_FORM = new Set(['privacy-policy', 'terms-and-conditions', 'cancellation-refund-policy', 'about-us']);

export default async function Page({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.map((s) => decodeURIComponent(s));
  const fileSlug = pathToFileSlug(slug);

  // blog posts live at root level
  if (slug.length === 1) {
    const post = loadPost(slug[0]);
    if (post) {
      const related = listPosts().filter((p) => p.slug !== slug[0]).slice(0, 5);
      const seo = seoFor('/' + slug[0] + '/');
      return (
        <>
          <PageHero
            title={post.h1 || post.title}
            crumbs={[
              { label: 'Home', href: '/' },
              { label: 'Knowledge Base', href: '/knowledge-base/' },
              { label: post.h1 || post.title, href: '/' + slug[0] + '/' },
            ]}
          />
          <Article post={post} related={related} />
          <CtaBand />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.h1 || post.title,
                description: seo?.description || undefined,
                image: post.featuredImage ? `https://bookmytm.com${post.featuredImage}` : undefined,
                datePublished: post.datePublished || undefined,
                author: { '@type': 'Organization', name: 'BookMyTM', url: 'https://bookmytm.com' },
                publisher: {
                  '@type': 'Organization',
                  name: 'BookMyTM',
                  logo: { '@type': 'ImageObject', url: 'https://bookmytm.com/images/bookmytm-white.png' },
                },
                mainEntityOfPage: seo?.canonical || `https://bookmytm.com/${slug[0]}/`,
              }),
            }}
          />
        </>
      );
    }
  }

  const content = loadContent(fileSlug);
  if (!content) notFound();

  const path = '/' + slug.join('/') + '/';
  const seo = seoFor(path);
  const crumbs = crumbsFor(slug);
  const { h1, lead, price, body } = splitHero(content.blocks);
  const children = childrenFor(path);
  const isHub = body.length === 0 && children.length > 0;
  const isLegal = NO_FORM.has(fileSlug);

  const title = h1 || content.h1 || crumbs[crumbs.length - 1].label;
  const heroLead = lead || (isHub && seo?.description) || undefined;
  const faqItems = collectFaqItems(body);

  return (
    <>
      <PageHero title={title} lead={heroLead || undefined} price={price || undefined} crumbs={crumbs} />

      {isHub ? (
        <section className="bg-white">
          <div className="container-site py-16 md:py-20">
            <div className="mb-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">Our Services</h2>
              <div className="mt-3 h-1 w-14 rounded-full bg-brand" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((c, i) => (
                <Reveal key={c.href} delay={i * 50}>
                  <Link
                    href={c.href}
                    className="group flex h-full flex-col rounded-3xl border border-gray-100 bg-brand-surface p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand/25 hover:bg-white hover:shadow-2xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-sm transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                      <IconFor text={c.label} className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-gray-900">{c.label}</h3>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-brand transition-all group-hover:gap-3">
                      Learn More
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : isLegal ? (
        <section className="bg-white">
          <div className="container-site py-16 md:py-20">
            <div className="mx-auto max-w-3xl">
              <Blocks blocks={body} />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white">
          <div className="container-site py-16 md:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr),380px]">
              <Blocks blocks={body} sectionImage={{ src: imageForPath(path), alt: `${title} – BookMyTM` }} />
              <aside className="lg:sticky lg:top-28">
                <LeadForm service={title} price={price || undefined} />
                <div className="mt-5 rounded-3xl border border-gray-100 bg-brand-surface p-6">
                  <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gray-700">Why BookMyTM?</h3>
                  <ul className="space-y-2.5">
                    {['10,000+ trademarks filed', '100% digital process', 'Expert support at every step', 'Transparent pricing'].map((t) => (
                      <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                        <svg className="h-4 w-4 flex-shrink-0 stroke-brand" fill="none" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      <CtaBand />

      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
