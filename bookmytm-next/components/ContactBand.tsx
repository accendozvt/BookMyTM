import { Icon } from '@/components/icons';
import { SITE } from '@/lib/site';

const MAPS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent('Mavelipuram, Kakkanad, Kochi, Kerala 682030');

export default function ContactBand() {
  return (
    <section className="border-t border-gray-100 bg-brand-surface">
      <div className="container-site py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-extrabold uppercase tracking-wider text-brand">Get In Touch</span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            Talk to a BookMyTM expert
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-gray-600">
            Have a question about trademarks, ISO, or company registration? Our team in Kochi &amp; New Delhi is ready
            to help — reach us however you prefer.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Call */}
          <div className="flex flex-col rounded-3xl border border-gray-200/70 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-surface text-brand">
              <Icon name="phone" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Call us</h3>
            <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-gray-400">Mon–Sat · 9:30 AM–6:30 PM</p>
            <div className="mt-4 flex flex-col gap-1.5">
              <a href={SITE.phone1Href} className="text-[15px] font-bold text-gray-800 transition-colors hover:text-brand">
                {SITE.phone1}
              </a>
              <a href={SITE.phone2Href} className="text-[15px] font-bold text-gray-800 transition-colors hover:text-brand">
                {SITE.phone2}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col rounded-3xl border border-gray-200/70 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-surface text-brand">
              <Icon name="mail" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Email us</h3>
            <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-gray-400">Replies within 24 hours</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`mailto:${SITE.email}`} className="text-[15px] font-bold text-gray-800 transition-colors hover:text-brand">
                {SITE.email}
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-[13px] font-extrabold text-white transition hover:-translate-y-0.5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Visit */}
          <div className="flex flex-col rounded-3xl border border-gray-200/70 bg-white p-7 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-surface text-brand">
              <Icon name="building" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900">Visit us</h3>
            <p className="mt-1 text-[13px] font-semibold uppercase tracking-wide text-gray-400">Registered office</p>
            <p className="mt-4 text-[14.5px] leading-relaxed text-gray-600">
              Plot No 207, Behind Onam Park,
              <br />
              Mavelipuram, Kakkanad, Kochi,
              <br />
              Kerala 682030
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-[14px] font-extrabold text-brand transition-all hover:gap-2.5"
            >
              Get directions
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
