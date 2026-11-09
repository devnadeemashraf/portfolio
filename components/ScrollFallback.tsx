'use client';

import { useEffect } from 'react';

/**
 * Does nothing unless scroll-driven animations are unsupported (Firefox, older Safari).
 * Then it sets --fp (0..1) on each statement and `.in` on morph cards via IntersectionObserver.
 * The resting state without JS is already the finished, readable page.
 */
export function ScrollFallback() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: view()')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('js-fill');
    const steps = Array.from({ length: 41 }, (_, i) => i / 40);

    const stmtIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const top = e.boundingClientRect.top;
          const p = Math.min(1, Math.max(0, 1 - (top - innerHeight * 0.12) / (innerHeight * 0.6)));
          el.style.setProperty('--fp', String(e.isIntersecting || top < 0 ? p : 0));
        }
      },
      { threshold: steps, rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('.stmt').forEach((s) => stmtIO.observe(s));

    const cardIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            cardIO.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.morph').forEach((c) => cardIO.observe(c));

    return () => {
      stmtIO.disconnect();
      cardIO.disconnect();
      root.classList.remove('js-fill');
    };
  }, []);
  return null;
}
