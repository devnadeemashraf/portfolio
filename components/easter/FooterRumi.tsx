'use client';

import { useEffect, useRef, useState } from 'react';
import { RumiSprite } from './RumiSprite';
import { meow } from '@/lib/meow';
import { track } from '../analytics/track';

const LINES = ['mew', 'mrrp?', 'oh?', 'prrt.'];

/** Estimated date of birth (the owner's real date wins once known). Age follows real calendar time. */
const BORN = { y: 2024, m: 12, d: 9 };

function ageNow(now = new Date()) {
  let y = now.getUTCFullYear() - BORN.y;
  let m = now.getUTCMonth() + 1 - BORN.m;
  let d = now.getUTCDate() - BORN.d;
  if (d < 0) {
    d += new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)).getUTCDate();
    m -= 1;
  }
  if (m < 0) { m += 12; y -= 1; }
  const part = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  return `${part(y, 'year')}, ${part(m, 'month')}, ${part(d, 'day')}`;
}

const CARE = [
  ['Let him notice you.', 'Move calmly and give him a moment to come over.'],
  ['Offer, don’t force.', 'Hold still near him and let him choose to lean in.'],
  ['Watch his signals.', 'A raised tail is a greeting. A lashing tail or a turned head means space, please.'],
  ['Let him leave.', 'Walking away is communication, not rejection.'],
  ['Play fair.', 'A wiggle means a pounce is coming. Let him win.'],
] as const;

/** Static Rumi in the footer: the only Rumi under reduced motion. Click and he runs off. */
export function FooterRumi() {
  const ref = useRef<HTMLButtonElement>(null);
  const [line, setLine] = useState<string | null>(null);
  const [gone, setGone] = useState(false);
  const [voice, setVoice] = useState(false);
  const n = useRef(0);
  const [age, setAge] = useState('');
  useEffect(() => setAge(ageNow()), []);

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
      <details className="rumi-care">
        <summary className="mono">Rumi{age ? `, ${age} old (estimated)` : ''}</summary>
        <p className="rumi-care-intro">A young Siamese. Affectionate, curious and independent, and he decides when.</p>
        <ol>
          {CARE.map(([t, x]) => <li key={t}><strong>{t}</strong> {x}</li>)}
        </ol>
      </details>
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
