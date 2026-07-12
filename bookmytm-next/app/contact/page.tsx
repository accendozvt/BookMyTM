import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import { seoFor } from '@/lib/content';
import { SITE } from '@/lib/site';

export function generateMetadata(): Metadata {
  const seo = seoFor('/contact/');
  const title = seo?.title || 'Contact Us | BookMyTM';
  const description =
    seo?.description ||
    'Reach the BookMyTM team in Kochi, Kerala for trademark registration, ISO certification, and business compliance. Call +91 809 809 0880 or write to cc@bookmytm.com.';
  const canonical = seo?.canonical || 'https://bookmytm.com/contact/';
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

const cards = [
  {
    label: 'Registered Office',
    lines: ['Plot No 207, Behind Onam Park,', 'Mavelipuram, Kakkanad, Kochi,', 'Kerala 682030'],
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    lines: [],
    links: [
      { text: SITE.phone1, href: SITE.phone1Href },
      { text: SITE.phone2, href: SITE.phone2Href },
    ],
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l1.14-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'e-Mail',
    lines: [],
    links: [{ text: SITE.email, href: `mailto:${SITE.email}` }],
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    lines: [],
    links: [{ text: 'Chat with us on WhatsApp', href: SITE.whatsapp }],
    icon: (
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        lead="We're here to help you start, protect, and grow your business. Reach out to our team in Kochi, Kerala."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact/' },
        ]}
      />

      <section className="bg-white">
        <div className="container-site py-16 md:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-3xl bg-brand-surface p-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
                  {c.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">{c.label}</h3>
                {c.lines?.map((l) => (
                  <p key={l} className="text-sm leading-relaxed text-gray-600">
                    {l}
                  </p>
                ))}
                {c.links?.map((l) => (
                  <p key={l.href}>
                    <a href={l.href} className="text-sm font-semibold text-brand hover:underline">
                      {l.text}
                    </a>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-surface">
        <div className="container-site py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr),400px]">
            <div>
              <h2 className="mb-8 text-2xl font-extrabold text-gray-900 md:text-3xl">
                Registered Office – Kochi, Kerala
              </h2>
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <iframe
                  title="BookMyTM Office Location"
                  src="https://www.google.com/maps?q=Mavelipuram%2C%20Kakkanad%2C%20Kochi%2C%20Kerala%20682030&output=embed"
                  className="h-[480px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <aside className="lg:sticky lg:top-28">
              <LeadForm service="General Enquiry" />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
