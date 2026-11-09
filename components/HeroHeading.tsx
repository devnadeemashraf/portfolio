'use client';

import { useEffect, useState } from 'react';

type Role = { word: string; title: string };

/**
 * Hero eyebrow + headline with a role flip: "Forward deployed" / "Full-stack" / "Software".
 * All variants are stacked in one grid cell, so the slot never changes size (no layout shift).
 * Screen readers get one static sentence; the animated copy is aria-hidden.
 * Without JS, or under reduced motion, the first role simply stays.
 */
export function HeroHeading({
  name,
  city,
  roles,
  headline,
  dim,
}: {
  name: string;
  city: string;
  roles: Role[];
  headline: string;
  dim: string;
}) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (roles.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cur = 0;
    const tick = () => {
      const next = (cur + 1) % roles.length;
      setPrev(cur);
      setI(next);
      cur = next;
    };
    const start = setTimeout(() => {
      tick();
      timer = setInterval(tick, 3200);
    }, 2600);
    let timer: ReturnType<typeof setInterval> | undefined;
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [roles.length]);

  const spoken = roles.map((r) => r.word.toLowerCase()).reduce((a, w, k, all) => (k === 0 ? w : k === all.length - 1 ? `${a} and ${w}` : `${a}, ${w}`), '');

  const stack = (key: 'word' | 'title') =>
    roles.map((r, k) => (
      <span
        key={r.word}
        className="flip-item"
        data-active={k === i || undefined}
        data-leaving={k === prev && k !== i ? true : undefined}
      >
        {r[key]}
      </span>
    ));

  return (
    <>
      <p className="label hero-eyebrow">
        {name} · {city} · <span className="flip flip-title" data-anim={prev !== null || undefined} aria-hidden="true">{stack('title')}</span>
        <span className="sr-only">{roles[0]?.title}</span>
      </p>
      <h1 className="display" id="hero-title">
        <span className="sr-only">{`${spoken} ${headline} ${dim}`}</span>
        <span aria-hidden="true" className="hero-h">
          <span className="flip flip-word" data-anim={prev !== null || undefined}>{stack('word')}</span>
          <span className="hero-h-rest">
            {headline} <span className="dim">{dim}</span>
          </span>
        </span>
      </h1>
    </>
  );
}
