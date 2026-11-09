'use client';

import { useEffect, useRef, useState } from 'react';
import { RumiSprite } from './RumiSprite';
import { meow } from '@/lib/meow';
import { track } from '../analytics/track';

const LINES = [
  'Mrrrow! (He wants you to know he is very busy.)',
  'He will sit exactly where you were about to click.',
  'Do not try to pick him up. He has filed a complaint.',
  'Rumi is vocal. Rumi is clingy. Rumi is not a lap cat.',
];

/** Static Rumi in the footer: the only Rumi under reduced motion. Click and he runs off. */
export function FooterRumi() {
  const ref = useRef<HTMLButtonElement>(null);
  const [line, setLine] = useState<string | null>(null);
  const [gone, setGone] = useState(false);
  const [voice, setVoice] = useState(false);
  const n = useRef(0);

  useEffect(() => setVoice(localStorage.getItem('rumi-voice') === 'on'), []);

  function onClick() {
    meow(n.current % 2 ? 'demand' : 'greet');
    track('easter_egg', { name: 'footer_rumi' });
    setLine(LINES[n.current++ % LINES.length]!);
    setTimeout(() => setLine(null), 3200);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const r = ref.current!.getBoundingClientRect();
      dispatchEvent(new CustomEvent('rumi:summon', { detail: { x: r.left, y: r.top + 8 } }));
      setGone(true);
      setTimeout(() => setGone(false), 60000);
    }
  }

  function toggleVoice() {
    const next = !voice;
    setVoice(next);
    localStorage.setItem('rumi-voice', next ? 'on' : 'off');
    dispatchEvent(new CustomEvent('rumi:voice', { detail: next }));
    if (next) meow('greet');
  }

  return (
    <div className="footer-rumi">
      <button type="button" className="rumi-voice mono" aria-pressed={voice} onClick={toggleVoice}>
        Rumi&apos;s voice: {voice ? 'on' : 'off'}
      </button>
      <p className="rumi-line mono" role="status">{line}</p>
      <button
        ref={ref}
        type="button"
        className="rumi-perch"
        aria-label="Rumi, a Siamese cat. Press to say hello. He will not be caught."
        onClick={onClick}
        style={{ visibility: gone ? 'hidden' : 'visible' }}
      >
        <RumiSprite pose="sit" px={4} />
      </button>
    </div>
  );
}
