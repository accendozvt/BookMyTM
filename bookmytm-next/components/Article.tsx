import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import CardImage from '@/components/CardImage';
import type { Block, PageContent, PostMeta } from '@/lib/content';

function fmtDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Heading level to render as, so the document outline never skips a level
 * (WCAG / Lighthouse "heading-order"). Several posts open with a level-4 callout
 * such as "The BookMyTM Insight", which rendered as <h3> straight after the <h1>.
 * Only the tag changes — the visual class still follows the author's level, so
 * nothing on screen moves.
 */
function levelsFor(blocks: Block[]): number[] {
  let prev = 1; // the page <h1> lives in PageHero
  return blocks.map((b) => {
    if (b.type !== 'heading') return 0;
    const lvl = Math.min(b.level, prev + 1);
    prev = lvl;
    return lvl;
  });
}

function renderBlock(b: Block, key: number, headingLevel = 0) {
  switch (b.type) {
    case 'heading': {
      const Tag = (`h${Math.min(Math.max(headingLevel || b.level, 2), 6)}`) as 'h2';
      if (b.level <= 2)
        return (
          <Tag key={key} className="mt-10 text-2xl font-extrabold tracking-tight text-gray-900">
            {b.text}
          </Tag>
        );
      return (
        <Tag key={key} className="mt-8 text-xl font-bold text-gray-900">
          {b.text}
        </Tag>
      );
    }
    case 'paragraph':
      return (
        <p key={key} className="text-base leading-[1.8] text-gray-700">
          {b.text}
        </p>
      );
    case 'quote':
      return (
        <blockquote key={key} className="border-l-4 border-brand bg-brand-surface p-5 text-[17px] font-medium italic leading-relaxed text-gray-700 rounded-r-2xl">
          {b.text}
        </blockquote>
      );
    case 'list':
      return b.ordered ? (
        <ol key={key} className="list-decimal space-y-2 pl-6 text-base leading-relaxed text-gray-700 marker:font-bold marker:text-brand">
          {b.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={key} className="space-y-2.5">
          {b.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-base leading-relaxed text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div key={key} className="overflow-x-auto rounded-2xl ring-1 ring-gray-200">
          <table className="w-full text-left text-sm">
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? 'bg-brand text-white' : ri % 2 ? 'bg-gray-50' : 'bg-white'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-5 py-3.5 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'image':
      return b.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={b.src} alt={b.alt} className="mx-auto max-h-[480px] rounded-2xl shadow-md" loading="lazy" decoding="async" />
      ) : null;
    case 'faq':
      return (
        <div key={key} className="space-y-4">
          {b.items.map((f, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="mb-2 text-[16px] font-bold text-gray-900">{f.q}</h3>
              <p className="text-[15px] leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function Article({
  post,
  related,
}: {
  post: PageContent;
  related: PostMeta[];
}) {
  // drop leading duplicate h1
  const body = post.blocks.filter((b, i) => !(b.type === 'heading' && b.level === 1));
  const bodyLevels = levelsFor(body);

  return (
    <section className="bg-white">
      <div className="container-site py-14 md:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr),360px]">
          <article className="min-w-0">
            {post.datePublished && (
              <p className="mb-6 text-sm font-bold uppercase tracking-wider text-brand">
                Published {fmtDate(post.datePublished)}
              </p>
            )}
            {post.featuredImage && (
              /* LCP element on every post: eager, high priority, and never lazy. */
              <CardImage
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.h1 || post.title}
                sizes="(max-width: 1024px) 100vw, 760px"
                className="mb-10 aspect-video w-full rounded-3xl object-cover shadow-lg"
                priority
              />
            )}
            <div className="space-y-5">{body.map((b, i) => renderBlock(b, i, bodyLevels[i]))}</div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <LeadForm service="Expert Consultation" />
            {related.length > 0 && (
              <div className="rounded-3xl border border-gray-100 bg-brand-surface p-6">
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-gray-700">Latest Articles</h2>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/${r.slug}/`} className="group flex gap-3.5">
                      {r.featuredImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={r.featuredImage}
                          alt=""
                          width={80}
                          height={56}
                          className="h-14 w-20 flex-shrink-0 rounded-xl object-cover"
                          loading="lazy" decoding="async"
                        />
                      )}
                      <span className="text-[13.5px] font-semibold leading-snug text-gray-700 transition-colors group-hover:text-brand">
                        {r.h1.length > 70 ? r.h1.slice(0, 70) + '…' : r.h1}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
