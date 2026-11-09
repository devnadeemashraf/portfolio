'use client';

import { useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

type PH = { capture: (e: string, p?: unknown) => void };
const ph = () => (window as unknown as { posthog?: PH }).posthog;

/**
 * PostHog (free tier) loads lazily after first paint, cookieless (memory persistence), and
 * only when NEXT_PUBLIC_POSTHOG_KEY is set and Do-Not-Track is off. Vercel Analytics and
 * Speed Insights are always mounted (they no-op outside Vercel).
 */
export function Analytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (key && navigator.doNotTrack !== '1') {
      const idle =
        (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ??
        ((cb: () => void) => setTimeout(cb, 1200));
      idle(async () => {
        const { default: posthog } = await import('posthog-js');
        posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
          persistence: 'memory',
          capture_pageview: 'history_change',
          autocapture: true,
          disable_session_recording: true,
          person_profiles: 'identified_only',
        });
        (window as unknown as { posthog: unknown }).posthog = posthog;
      });
    }

    // Delegated tracking for [data-track] elements and outbound links.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track], a[href^="http"]');
      const p = ph();
      if (!el || !p) return;
      if (el.dataset.track) p.capture(el.dataset.track, { label: el.dataset.label });
      else if (el instanceof HTMLAnchorElement && new URL(el.href).origin !== location.origin) {
        p.capture('outbound', { url: el.href });
      }
    };
    document.addEventListener('click', onClick);

    // Which sections do people actually reach?
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const id = (en.target as HTMLElement).id;
          if (en.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            ph()?.capture('section_view', { section: id, path: location.pathname });
          }
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));

    return () => {
      document.removeEventListener('click', onClick);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  );
}
