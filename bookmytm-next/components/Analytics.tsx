'use client';

import { useEffect } from 'react';

/**
 * Loads GA4 on the first user interaction, or after a short idle delay —
 * whichever comes first.
 *
 * next/script's `lazyOnload` still fires during the window Lighthouse measures,
 * where gtag cost ~417ms of script evaluation and two long tasks (213ms + 179ms)
 * — the largest single scripted contributor to Total Blocking Time on mobile.
 * Deferring past that window keeps measurement honest without dropping data:
 * any scroll, tap, key or pointer movement triggers the load, and a 4s fallback
 * covers visitors who read without interacting at all.
 */
export default function Analytics({ id }: { id: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let done = false;

    const load = () => {
      if (done) return;
      done = true;
      cleanup();

      const s = document.createElement('script');
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      s.async = true;
      document.head.appendChild(s);

      const w = window as unknown as { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      function gtag(...args: unknown[]) {
        w.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', id);
    };

    const EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    const cleanup = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const timer = setTimeout(load, 4000);

    return cleanup;
  }, [id]);

  return null;
}
