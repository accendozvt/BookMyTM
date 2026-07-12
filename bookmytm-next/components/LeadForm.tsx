'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

export default function LeadForm({
  service,
  price,
}: {
  service: string;
  price?: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const valid = name.trim().length > 1 && phone.trim().length >= 10;

  function submitWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const text = [
      `Hi BookMyTM! I'd like to apply for *${service}*${price ? ` (${price})` : ''}.`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() && `Email: ${email.trim()}`,
      message.trim() && `Message: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setSent(true);
  }

  const mailtoHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Enquiry: ${service}`,
  )}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n${message}`)}`;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/70">
      {/* Price header */}
      <div className="hero-bg px-7 py-6 text-white">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-light">Get Started</p>
        {price ? (
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{price}</span>
            <span className="text-sm font-medium text-white/60">all inclusive*</span>
          </p>
        ) : (
          <p className="mt-1 text-2xl font-extrabold">Free Consultation</p>
        )}
        <p className="mt-1.5 text-[13px] leading-snug text-white/70">{service}</p>
      </div>

      {sent ? (
        <div className="px-7 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-brand">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="mb-1 text-lg font-bold text-gray-900">Request sent!</h4>
          <p className="text-sm text-gray-600">
            We&apos;ve opened WhatsApp with your details. Our expert will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-5 text-sm font-bold text-brand hover:underline"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={submitWhatsApp} className="space-y-3.5 px-7 py-6">
          <div>
            <label htmlFor="lf-name" className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Name *
            </label>
            <input
              id="lf-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label htmlFor="lf-phone" className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Phone *
            </label>
            <input
              id="lf-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label htmlFor="lf-email" className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Email
            </label>
            <input
              id="lf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div>
            <label htmlFor="lf-msg" className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Message
            </label>
            <textarea
              id="lf-msg"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your requirement…"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <button
            type="submit"
            disabled={!valid}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-[#3a6a2c] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
          >
            <svg className="h-4.5 w-4.5 h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Request via WhatsApp
          </button>
          <p className="text-center text-xs text-gray-400">
            or{' '}
            <a href={mailtoHref} className="font-semibold text-brand hover:underline">
              email us
            </a>{' '}
            ·{' '}
            <a href={SITE.phone1Href} className="font-semibold text-brand hover:underline">
              {SITE.phone1}
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
