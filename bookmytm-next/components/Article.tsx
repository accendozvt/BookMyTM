import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import type { Block, PageContent, PostMeta } from '@/lib/content';

function fmtDate(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

function renderBlock(b: Block, key: number) {
  switch (b.type) {
    case 'heading': {
      if (b.level <= 2)
        return (
          <h2 key={key} className="mt-10 text-2xl font-extrabold tracking-tight text-gray-900">
            {b.text}
          </h2>
        );
      return (
        <h3 key={key} className="mt-8 text-xl font-bold text-gray-900">
          {b.text}
        </h3>
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
        <img key={key} src={b.src} alt={b.alt} className="mx-auto max-h-[480px] rounded-2xl shadow-md" loading="lazy" />
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
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.featuredImage}
                alt={post.h1 || post.title}
                width={1200}
                height={675}
                className="mb-10 aspect-video w-full rounded-3xl object-cover shadow-lg"
              />
            )}
            <div className="space-y-5">{body.map((b, i) => renderBlock(b, i))}</div>
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
                          loading="lazy"
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
