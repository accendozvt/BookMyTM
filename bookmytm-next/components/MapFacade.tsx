'use client';

import { useState } from 'react';

/**
 * Click-to-load Google Maps.
 *
 * The embedded iframe pulled ~700KB of third-party JS on every visit to /contact
 * and was the page's biggest main-thread cost. Nothing renders until the visitor
 * asks for the map; the address and a direct Maps link are always available, so
 * no information is hidden behind the interaction.
 */
export default function MapFacade({
  query,
  title,
  addressLines,
}: {
  query: string;
  title: string;
  addressLines: string[];
}) {
  const [load, setLoad] = useState(false);
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (load) {
    return (
      <iframe
        title={title}
        src={embed}
        className="h-[480px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="relative flex h-[480px] w-full flex-col items-center justify-center gap-5 bg-brand-surface px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </span>
      <div>
        {addressLines.map((l) => (
          <p key={l} className="text-[15px] font-medium leading-relaxed text-gray-700">
            {l}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="min-h-[48px] rounded-full bg-brand px-7 py-3 text-sm font-bold text-white transition hover:bg-[#2f5622]"
        >
          Load interactive map
        </button>
        <a
          href={link}
          target="_blank"
          rel="noopener"
          className="min-h-[48px] rounded-full border border-brand/30 bg-white px-7 py-3 text-sm font-bold text-brand transition hover:bg-green-50"
        >
          Open in Google Maps
        </a>
      </div>
      {/* gray-700, not gray-500: this sits on bg-brand-surface (#f3f6f4) where
          gray-500 measures ~4.3:1 and fails AA for small text. */}
      <p className="text-xs text-gray-700">The map loads Google content only when you choose to.</p>
    </div>
  );
}
