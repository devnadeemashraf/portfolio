'use client';

import { useEffect, useState } from 'react';

export function Toc({ headings, label = 'On this page' }: { headings: { text: string; id: string }[]; label?: string }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-120px 0px -65% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [headings]);

  return (
    <nav aria-label={label} className="toc">
      <p className="label">{label}</p>
      <ol>
        {headings.map((h, i) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={active === h.id ? 'true' : undefined}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span> {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
