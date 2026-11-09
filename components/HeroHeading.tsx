'use client';

import { useEffect, useState } from 'react';

type Role = { word: string; title: string; headline: string; dim: string };

/**
 * Hero eyebrow + headline with a role flip. Each role carries its own headline (customer calls belong to the FDE variant only).
 * All variants are stacked in one grid cell, so the slot never changes size (no layout shift).
 * Screen readers get one static sentence; the animated copy is aria-hidden.
 * Without JS, or under reduced motion, the first role simply stays.
 */
export function HeroHeading({
  name,
  city,
  roles,
}: {
  name: string;
  city: string;
  roles: Role[];
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

  const stack = (key: 'title' | 'headline') =>
    roles.map((r, k) => (
      <span
        key={r.word}
        className="flip-item"
        data-active={k === i || undefined}
        data-leaving={k === prev && k !== i ? true : undefined}
      >
        {key === 'title' ? (
          r.title
        ) : (
          <>
            <span className="hero-h-word">{r.word}</span>
            <span className="hero-h-rest">
              {r.headline} <span className="dim">{r.dim}</span>
            </span>
          </>
        )}
      </span>
    ));

  return (
    <>
      <p className="label hero-eyebrow">
        {name} · {city} · <span className="flip flip-title" data-anim={prev !== null || undefined} aria-hidden="true">{stack('title')}</span>
        <span className="sr-only">{roles[0]?.title}</span>
      </p>
      <h1 className="display" id="hero-title">
        <span className="sr-only">{`${roles[0]?.word} ${roles[0]?.headline} ${roles[0]?.dim}`}</span>
        <span aria-hidden="true" className="hero-h flip flip-word" data-anim={prev !== null || undefined}>{stack('headline')}</span>
      </h1>
    </>
  );
}
