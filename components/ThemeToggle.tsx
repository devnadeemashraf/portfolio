'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from './Icons';
import { track } from './analytics/track';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  function apply(next: 'dark' | 'light') {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
    track('theme_toggle', { theme: next });
  }

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    const next = theme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition;
    if (reduce || !start) return apply(next);

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.documentElement.classList.add('theme-vt');
    const t = start.call(document, () => apply(next)) as { ready: Promise<void>; finished: Promise<void> };
    t.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 350, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => {});
    t.finished.finally(() => document.documentElement.classList.remove('theme-vt'));
  }

  return (
    <button type="button" className="btn-icon" onClick={onClick} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
