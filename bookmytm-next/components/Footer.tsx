import Link from 'next/link';
import Image from 'next/image';
import { NAV, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="hero-bg pt-20 text-white">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Link href="/">
              <Image src="/images/bookmytm-white.png" alt="BookMyTM Logo" width={160} height={48} className="mb-2" />
            </Link>
            <p className="mb-6 text-sm text-white/50">{SITE.tagline}</p>
            <div className="flex gap-3">
              <a
                href={SITE.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={SITE.whatsapp}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={SITE.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-widest text-white/45">Solutions</p>
            <div className="flex flex-col gap-2.5">
              {NAV.map((cat) => (
                <Link key={cat.href} href={cat.href} className="text-sm text-white/65 transition hover:text-white">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-widest text-white/45">Company</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'About Us', href: '/about-us/' },
                { label: 'Knowledge Base', href: '/knowledge-base/' },
                { label: 'Contact', href: '/contact/' },
                { label: 'Trademark Registration in Kerala', href: '/intellectual-property/trademark/trademark-registration-in-kerala/' },
                { label: 'No.1 Trademark Provider in Kerala', href: '/no-1-trademark-registration-provider-in-kerala-bookmytm/' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-white/65 transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Registered Office */}
          <div>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-widest text-white/45">Registered Office</p>
            <p className="text-sm leading-7 text-white/65">
              Plot No 207, Behind Onam Park,
              <br />
              Mavelipuram, Kakkanad, Kochi,
              <br />
              Kerala 682030
            </p>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20">
                <svg className="h-4 w-4 stroke-white/70" fill="none" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.4 2 2 0 013.59 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.78a16 16 0 006 6l1.14-.93a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                  />
                </svg>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/45">Phone</p>
                <p className="text-sm text-white/80">
                  <a href={SITE.phone1Href} className="hover:text-white">{SITE.phone1}</a>
                  <br />
                  <a href={SITE.phone2Href} className="hover:text-white">{SITE.phone2}</a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/20">
                <svg className="h-4 w-4 stroke-white/70" fill="none" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-white/45">e-Mail</p>
                <a href={`mailto:${SITE.email}`} className="text-sm text-white/80 hover:text-white">
                  {SITE.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/45">© Copyrights 2026 BookMyTM | All rights reserved</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms-and-conditions/" className="text-sm text-white/45 transition hover:text-white/80">
              Terms and Conditions
            </Link>
            <Link href="/cancellation-refund-policy/" className="text-sm text-white/45 transition hover:text-white/80">
              Cancellation &amp; Refund Policy
            </Link>
            <Link href="/privacy-policy/" className="text-sm text-white/45 transition hover:text-white/80">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
