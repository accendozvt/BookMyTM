'use client';

import { useEffect, useRef, useState } from 'react';

/** Fades content up when it enters the viewport. Respects prefers-reduced-motion. */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /**
   * Render visible in the server HTML instead of fading in.
   *
   * Use for anything above the fold: the fade starts at opacity-0 and only
   * clears once React has hydrated and IntersectionObserver fires, so an LCP
   * candidate inside a Reveal cannot paint until the JS bundle has run. That
   * was holding the knowledge-base LCP at ~4.5s on mobile.
   */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
