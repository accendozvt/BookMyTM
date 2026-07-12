import type { Metadata } from 'next';
import Link from 'next/link';
import FaqColumns from '@/components/FaqColumns';
import CtaBand from '@/components/CtaBand';
import Reveal from '@/components/Reveal';
import { Icon, IconFor } from '@/components/icons';
import { seoFor, loadContent, listPosts } from '@/lib/content';
import { SITE } from '@/lib/site';

export function generateMetadata(): Metadata {
  const seo = seoFor('/');
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      siteName: 'BookMyTM',
      type: 'website',
      images: [{ url: '/assets/opengraph/preview.webp', width: 1200, height: 630, alt: seo.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/assets/opengraph/preview.webp'],
    },
  };
}

const QUICK_PICKS = [
  { label: 'Trademark ®', href: '/intellectual-property/trademark/trademark-registration-in-kerala/' },
  { label: 'ISO Certificate', href: '/iso-certification/' },
  { label: 'Company Registration', href: '/startup/registrations/private-limited-company-registration/' },
  { label: 'GST', href: '/statutory-compliance/basic-compliances/gst-registration/' },
  { label: 'Patent', href: '/intellectual-property/patent/' },
];

const STEPS = [
  { title: 'Register & Pay', text: 'Select your package, fill the form and make payment online.', icon: 'document' },
  { title: 'We Draft & File', text: 'Consultation, drafting, document review and filing with the registry.', icon: 'users' },
  { title: 'Track to Certificate', text: 'We track your application status until the certificate reaches you.', icon: 'shield' },
];

const WHY = [
  { title: '100% Digital Services', text: 'Fully digital process — access our services from home or office.' },
  { title: 'Fast & Reliable Support', text: 'Dedicated teams in Kerala & New Delhi with prompt responses.' },
  { title: 'Timely Updates', text: 'Regular updates at every stage of your application.' },
  { title: 'Expert Advisory', text: 'Experienced consultants with personalized guidance.' },
];

const TESTIMONIALS = [
  { quote: 'Successful pitch deck can help in growing the business to a new level. BookmyTM is a brave initiative.', name: 'Ravi N Hari', role: 'Hallmark Financial Services, Bangalore' },
  { quote: 'This will be really helpful for startups who need support to complete the paperwork related to setting up a business.', name: 'Mr. Rajesh Jha', role: 'CEO, Adani Ports' },
  { quote: 'Sending you the heartiest congratulations on the new business venture that you have started.', name: 'Mr. Unni Mukundan', role: 'South Indian Film Actor' },
];

const INDIA_COLS = [
  {
    label: 'Protect',
    text: 'Trademark registration in India is essential to protect your business name, logo, or symbol. It grants you the exclusive legal right to prevent others from using or imitating your brand identity. The process begins with a detailed trademark search to ensure the availability of your name or logo. At BookMyTM, we specialize in assisting you through every step of the trademark registration process across Kerala, Haryana, New Delhi, Rajasthan, and Uttar Pradesh.',
  },
  {
    label: 'File & Track',
    text: 'Our experienced team helps you file your trademark application with IP India, a division of the Government of India. We handle all the required documentation and guide you in selecting the appropriate trademark class from the 45 available categories. Once the application is filed, we meticulously track the trademark status until you receive your trademark certificate. Your registered trademark will enjoy protection for ten years, with an easy renewal option to maintain its validity.',
  },
  {
    label: 'Go Global',
    text: 'If you require global brand protection, BookMyTM facilitates international trademark registration under the Madrid Protocol, simplifying the process of securing your trademark in multiple countries. We also manage the Power of Attorney required for trademark filing and provide additional services such as tax filing. Furthermore, you can display the ™ symbol to indicate your brand is protected.',
  },
];

function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0 stroke-brand-light" fill="none" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function fmtMonth(iso?: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

export default function Home() {
  const faqItems = homeFaqItems();
  const latestPosts = listPosts().slice(0, 3);

  return (
    <>
      {/* ── 1 · HERO ── */}
      <section className="hero-bg relative rounded-b-[3rem]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[3rem]" aria-hidden>
          <div className="animate-blob absolute -left-4 top-0 h-96 w-96 rounded-full bg-green-300 opacity-5 blur-3xl" />
          <div className="animate-blob-2 absolute right-0 top-1/4 h-72 w-72 rounded-full bg-green-400 opacity-5 blur-3xl" />
          <div className="animate-blob-3 absolute -bottom-8 left-20 h-80 w-80 rounded-full bg-brand opacity-10 blur-3xl" />
        </div>

        <div className="container-site relative z-10 pt-16 md:pt-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping-dot absolute inset-0 rounded-full bg-green-400 opacity-75" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/90">
                  Trusted by 15,000+ Enterprises
                </span>
              </div>

              <h1 className="mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-[64px]">
                Apply
                <br />
                <span className="bg-gradient-to-r from-green-200 via-green-100 to-white bg-clip-text pb-1 pr-1 text-transparent">
                  Trademark Registration
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-green-100">
                Secure your brand identity with India&apos;s most trusted legal platform. Seamless trademark
                registration and intellectual property solutions in Kerala and Tamil Nadu.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/intellectual-property/trademark/trademark-registration-in-kerala/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-9 py-4 text-lg font-extrabold text-white shadow-xl shadow-brand/30 transition hover:-translate-y-0.5 hover:bg-[#3a6a2c]"
                >
                  Apply Online
                  <ArrowIcon />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-9 py-4 text-lg font-extrabold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Explore Services
                </a>
              </div>

              {/* quick picker */}
              <div className="mb-11 mt-8 flex flex-wrap items-center gap-2.5">
                <span className="mr-1 text-xs font-extrabold uppercase tracking-widest text-white/55">I need:</span>
                {QUICK_PICKS.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13.5px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* advisor image + pills */}
            <div className="relative hidden self-end lg:block" aria-hidden>
              <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-brand/35 to-transparent blur-3xl" />
              <a
                href={SITE.phone2Href}
                className="animate-floaty absolute -left-3 top-[38%] z-30 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-[11.5px] font-extrabold text-white shadow-lg backdrop-blur transition hover:scale-105"
              >
                {SITE.phone2}
              </a>
              <a
                href={SITE.phone1Href}
                className="animate-floaty absolute -right-2 top-[16%] z-30 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-[11.5px] font-extrabold text-white shadow-lg backdrop-blur transition hover:scale-105 [animation-delay:0.9s]"
              >
                {SITE.phone1}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="animate-floaty absolute -right-4 bottom-[24%] z-30 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-2 text-[11.5px] font-extrabold text-white shadow-lg backdrop-blur transition hover:scale-105 [animation-delay:1.7s]"
              >
                {SITE.email}
              </a>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/smiling-happy-businesswoman-black-suit-pointing-hand-left-statistics-diagram-with-pleased-face-having-business-meeting-introduce-product-graph-standing-white-background.webp"
                alt=""
                width={640}
                height={800}
                className="relative z-10 mx-auto w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>

          {/* stats ribbon — overlaps into the next section */}
          <div className="relative z-20 -mb-14 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur-xl md:grid-cols-4">
            {[
              { num: '10k+', label: 'Trademarks Done' },
              { num: '15k+', label: 'End Users' },
              { num: '4.9★', label: 'Stars on Google' },
              { num: '8+', label: 'Years of Service' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`p-6 transition hover:bg-white/5 md:p-7 ${i < 3 ? 'md:border-r md:border-white/10' : ''} ${i % 2 === 0 ? 'border-r border-white/10 md:border-r' : ''} ${i < 2 ? 'border-b border-white/10 md:border-b-0' : ''}`}
              >
                <div className="text-3xl font-extrabold tabular-nums md:text-4xl">{s.num}</div>
                <div className="mt-0.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2 · SERVICES BENTO ── */}
      <section className="bg-white pt-32" id="services">
        <div className="container-site pb-20">
          <div className="text-center">
            <span className="text-sm font-extrabold uppercase tracking-wider text-brand">What We Do?</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              One platform for every business filing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Trademark registration &amp; ISO certification with offices in Kerala &amp; New Delhi — hassle-free,
              efficient, and fully digital.
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* featured trademark card */}
            <Reveal className="lg:row-span-2">
              <Link
                href="/intellectual-property/trademark/trademark-registration-in-kerala/"
                className="hero-bg group flex h-full flex-col rounded-[28px] p-8 text-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 bg-white/10 text-brand-light">
                  <Icon name="tag" className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-extrabold">Trademark Registration</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-green-100/90">
                  Protect your brand name, logo &amp; tagline under Trademark Act 1999. Search to certificate, we
                  handle everything.
                </p>
                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">Rs. 6400</span>
                  <span className="text-[13px] text-white/60">all inclusive*</span>
                </p>
                <ul className="mb-7 mt-4 space-y-2.5">
                  {['Free trademark search & class advice', 'Filed with IP India in 4–5 working days', 'Use ™ from day one of filing'].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-green-100/90">
                      <CheckIcon />
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-extrabold text-brand shadow-xl transition group-hover:gap-3">
                  Apply Now <ArrowIcon />
                </span>
              </Link>
            </Reveal>

            <Reveal delay={60}>
              <Link
                href="/iso-certification/"
                className="group flex h-full flex-col rounded-[28px] border border-gray-200/80 bg-brand-surface p-8 transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name="award" className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">ISO Certification</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                  Globally recognized ISO 9001, 14001, 22000, 27001 &amp; 45001 with full documentation support.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand transition-all group-hover:gap-3">
                  Learn More <ArrowIcon />
                </span>
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <Link
                href="/intellectual-property/"
                className="group flex h-full flex-col rounded-[28px] bg-brand-dark p-8 text-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-light">
                  <Icon name="lightbulb" className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold">Intellectual Property</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-300">
                  Patents, copyright &amp; design registration to protect your ideas and innovations.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand-light transition-all group-hover:gap-3">
                  Learn More <ArrowIcon />
                </span>
              </Link>
            </Reveal>

            <Reveal delay={90}>
              <Link
                href="/startup/"
                className="group flex h-full flex-col rounded-[28px] border border-gray-200/80 bg-brand-surface p-8 transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name="rocket" className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900">Startup</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
                  Company, LLP &amp; firm registration, legal docs and advisory for new ventures.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-brand transition-all group-hover:gap-3">
                  Learn More <ArrowIcon />
                </span>
              </Link>
            </Reveal>

            {/* quick-help card fills the empty grid slot */}
            <Reveal delay={120}>
              <div className="hero-bg flex h-full flex-col justify-center rounded-[28px] p-8 text-white">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-light">
                  <Icon name="headset" className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold">Not sure where to start?</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-green-100/90">
                  Talk to a BookMyTM expert — free consultation, no obligation.
                </p>
                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={SITE.whatsapp}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
                  >
                    Chat on WhatsApp
                  </a>
                  <a
                    href={SITE.phone1Href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-white/20"
                  >
                    {SITE.phone1}
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150} className="lg:col-span-2">
              <Link
                href="/statutory-compliance/"
                className="group flex h-full flex-col items-start gap-5 rounded-[28px] border border-gray-200/80 bg-brand-surface p-8 transition duration-300 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-2xl sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-brand shadow-sm transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon name="scale" className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-gray-900">Statutory Compliance &amp; Other Services</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-gray-600">
                    GST, PAN, PF &amp; ESI, ROC filings, entity conversions, winding up — the complete suite.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-extrabold text-brand transition-all group-hover:gap-3">
                  Explore <ArrowIcon />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3 · HOW IT WORKS ── */}
      <section className="bg-white">
        <div className="container-site pb-20">
          <div className="rounded-[2.75rem] bg-brand-surface px-6 py-16 md:px-14 md:py-20">
            <div className="text-center">
              <span className="text-sm font-extrabold uppercase tracking-wider text-brand">How It Works</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                Registered in 3 easy steps
              </h2>
            </div>
            <div className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-5">
              <div
                className="absolute left-[16%] right-[16%] top-11 hidden h-0.5 opacity-40 md:block"
                style={{ background: 'repeating-linear-gradient(90deg,#497E38 0 10px,transparent 10px 20px)' }}
                aria-hidden
              />
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 100}>
                  <div className="group relative text-center">
                    <div className="relative z-10 mx-auto mb-5 flex h-[88px] w-[88px] items-center justify-center rounded-[28px] border border-gray-200/80 bg-white text-brand shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:-rotate-3 group-hover:bg-brand group-hover:text-white">
                      <Icon name={s.icon} className="h-9 w-9" />
                    </div>
                    <span className="mb-3 inline-block rounded-full border border-gray-200/80 bg-white px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-brand">
                      Step {i + 1}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900">{s.title}</h3>
                    <p className="mx-auto mt-2 max-w-[30ch] text-[14.5px] leading-relaxed text-gray-600">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 · WHY CHOOSE ── */}
      <section className="bg-white">
        <div className="container-site pb-20">
          <div className="grid items-stretch gap-14 lg:grid-cols-[0.9fr,1.1fr]">
            <Reveal className="h-full">
              <div className="relative h-full min-h-[420px] overflow-hidden rounded-[28px] shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/why-consultation.jpg"
                  alt="BookMyTM consultants celebrating a successful trademark filing with a client"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-5 bottom-5 flex items-center gap-4 rounded-2xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
                  <div>
                    <span className="text-[15px] tracking-[2px] text-amber-500">★★★★★</span>
                    <p className="text-[15px] font-extrabold text-gray-900">4.9 on Google</p>
                  </div>
                  <p className="ml-auto text-right text-[12.5px] leading-snug text-gray-500">
                    from 15,000+
                    <br />
                    happy clients
                  </p>
                </div>
              </div>
            </Reveal>
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-brand">Our Specialties</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                Why choose BookMyTM?
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
                Registering your trademark is essential to protect your brand identity. We make it simple, reliable,
                and accessible.
              </p>
              <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {WHY.map((w, i) => (
                  <Reveal key={w.title} delay={i * 60}>
                    <div className="group h-full rounded-2xl border border-gray-200/80 bg-brand-surface p-5.5 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/35 hover:bg-white hover:shadow-xl">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                        <IconFor text={w.title} className="h-5 w-5" />
                      </div>
                      <h3 className="text-[15.5px] font-extrabold text-gray-900">{w.title}</h3>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-gray-600">{w.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 · TRADEMARK IN INDIA ── */}
      <section className="bg-white">
        <div className="container-site pb-20">
          <div className="hero-bg rounded-[2.75rem] px-6 py-16 text-white md:px-14 md:py-18 md:py-20">
            <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl">
              Trademark Registration in India
            </h2>
            <div className="mt-10 grid gap-9 md:grid-cols-3">
              {INDIA_COLS.map((c) => (
                <div key={c.label} className="border-t-2 border-brand-light/35 pt-5">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-brand-light">{c.label}</p>
                  <p className="text-[15px] leading-[1.85] text-[#cfe0d5]">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 · TESTIMONIALS ── */}
      <section className="bg-white">
        <div className="container-site pb-20">
          <div className="text-center">
            <span className="text-sm font-extrabold uppercase tracking-wider text-brand">Testimonials</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              What our clients say
            </h2>
          </div>
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="h-full rounded-[28px] border border-gray-200/80 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <span className="text-sm tracking-[2.5px] text-amber-500">★★★★★</span>
                  <p className="mt-4 text-5xl font-extrabold leading-[0] text-brand/25" aria-hidden>
                    &ldquo;
                  </p>
                  <p className="mb-5 mt-3 text-[15px] leading-relaxed text-gray-700">{t.quote}</p>
                  <p className="text-[14.5px] font-extrabold text-gray-900">{t.name}</p>
                  <p className="text-[11.5px] uppercase tracking-wider text-gray-500">{t.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 · LATEST INSIGHTS ── */}
      <section className="bg-white">
        <div className="container-site pb-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wider text-brand">Knowledge Base</span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Latest insights</h2>
            </div>
            <Link href="/knowledge-base/" className="inline-flex items-center gap-2 font-extrabold text-brand hover:gap-3 transition-all">
              View all articles <ArrowIcon />
            </Link>
          </div>
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {latestPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  href={`/${p.slug}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-gray-200/80 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
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
                        loading="lazy"
                      />
                    ) : (
                      <div className="hero-bg h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {p.datePublished && (
                      <p className="text-[11.5px] font-extrabold uppercase tracking-widest text-brand">{fmtMonth(p.datePublished)}</p>
                    )}
                    <h3 className="mt-2 flex-1 text-[17px] font-extrabold leading-snug text-gray-900">
                      {p.h1.length > 80 ? p.h1.slice(0, 80) + '…' : p.h1}
                    </h3>
                    <span className="mt-4 text-sm font-extrabold text-brand">Read Article →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · FAQ — two columns ── */}
      {faqItems.length > 0 && (
        <section className="bg-white">
          <div className="container-site pb-20">
            <div className="rounded-[2.75rem] bg-brand-surface px-5 py-16 md:px-14 md:py-20">
              <div className="text-center">
                <span className="text-sm font-extrabold uppercase tracking-wider text-brand">FAQ</span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="mt-11">
                <FaqColumns items={faqItems} />
              </div>
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqItems.slice(0, 12).map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }),
            }}
          />
        </section>
      )}

      <CtaBand />
    </>
  );
}

/** Pull FAQ q/a pairs verbatim from the scraped home page content. */
function homeFaqItems(): { q: string; a: string }[] {
  const home = loadContent('__home');
  if (!home) return [];
  const items: { q: string; a: string }[] = [];
  const blocks = home.blocks;
  let inFaq = false;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'heading' && b.level === 2 && /frequently asked/i.test(b.text)) {
      inFaq = true;
      continue;
    }
    if (!inFaq) continue;
    if (b.type === 'heading' && b.level === 2) break;
    if (b.type === 'faq') items.push(...b.items);
    if (b.type === 'heading' && b.level >= 3) {
      let a = '';
      let j = i + 1;
      while (j < blocks.length && (blocks[j].type === 'paragraph' || blocks[j].type === 'list')) {
        const nb = blocks[j];
        if (nb.type === 'paragraph') a += (a ? ' ' : '') + nb.text;
        if (nb.type === 'list') a += (a ? ' ' : '') + nb.items.join(' ');
        j++;
      }
      if (a && !/^[A-C]\.\s/.test(b.text)) items.push({ q: b.text.replace(/^\d+\.\s*/, ''), a });
      i = j - 1;
    }
  }
  return items;
}
