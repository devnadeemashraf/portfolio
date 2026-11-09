'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RumiSprite, Paw } from './RumiSprite';
import { meow } from '@/lib/meow';
import { track } from '../analytics/track';

/**
 * Rumi roams the page. He is clingy (he keeps coming back to wherever your cursor is) but he does
 * not want to be touched: get within ~70px, or click or tap him, and he is already somewhere else.
 * Catching him is impossible by design. Everything is decorative (aria-hidden) and is skipped
 * entirely under prefers-reduced-motion; the footer still shows a static Rumi.
 */

const W = 17 * 4; // walk sprite width in px
const H = 10 * 4;
const SAY_DODGE = ['Nope.', 'Hmph.', 'Not today.', 'Rude.', 'Mrp!', 'Too slow.'];
const SAY_IDLE = ['Mrrrow?', 'Mrrp.', 'MEOW.', '*stares*', 'Mew!', 'I am here. Obviously.'];
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]!;

export function Rumi() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [bubble, setBubble] = useState<string | null>(null);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paws, setPaws] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const [rain, setRain] = useState<{ id: number; x: number; d: number; s: number }[]>([]);

  const st = useRef({
    x: -200, y: 0, pointer: { x: -1, y: -1 }, dodgeAt: 0, active: false, voice: false,
    timers: [] as ReturnType<typeof setTimeout>[], pawId: 0, bubbleT: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const s = st.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      s.timers.push(t);
      return t;
    };
    s.voice = localStorage.getItem('rumi-voice') === 'on';

    const say = (text: string, ms = 1800) => {
      clearTimeout(s.bubbleT);
      setBubble(text);
      s.bubbleT = setTimeout(() => setBubble(null), ms);
    };

    const layPaw = (x: number, y: number, r: number) => {
      const id = ++s.pawId;
      setPaws((p) => [...p.slice(-40), { id, x, y, r }]);
      setTimeout(() => setPaws((p) => p.filter((q) => q.id !== id)), 4200);
    };

    const place = (x: number, y: number) => {
      s.x = x; s.y = y;
      const h = hostRef.current;
      if (h) h.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const clampX = (x: number) => Math.min(innerWidth - W - 8, Math.max(8, x));
    const clampY = (y: number) => Math.min(innerHeight - H - 8, Math.max(72, y));

    /** Trot to (x, y) in `ms`, leaving paw prints along the way. */
    const moveTo = (x: number, y: number, ms: number, trail = true) => {
      const h = hostRef.current;
      if (!h) return;
      const fx = s.x, fy = s.y;
      const dx = x - fx, dy = y - fy;
      const dist = Math.hypot(dx, dy);
      setFacing(dx >= 0 ? 1 : -1);
      setWalking(true);
      h.style.transition = `transform ${ms}ms cubic-bezier(.3,.6,.3,1)`;
      place(x, y);
      if (trail) {
        const n = Math.min(14, Math.floor(dist / 38));
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        for (let i = 1; i <= n; i++) {
          const f = i / (n + 1);
          const side = i % 2 ? 6 : -6;
          const nx = -dy / (dist || 1), ny = dx / (dist || 1);
          later(() => layPaw(fx + dx * f + W / 2 + nx * side, fy + dy * f + H - 4 + ny * side, angle + 90), ms * f);
        }
      }
      later(() => setWalking(false), ms);
    };

    const spotNear = (px: number, py: number, min: number, max: number) => {
      for (let i = 0; i < 8; i++) {
        const a = rand(0, Math.PI * 2), d = rand(min, max);
        const x = px + Math.cos(a) * d - W / 2, y = py + Math.sin(a) * d - H / 2;
        if (x > 8 && x < innerWidth - W - 8 && y > 72 && y < innerHeight - H - 8) return { x, y };
      }
      return { x: clampX(px + (px < innerWidth / 2 ? max : -max)), y: clampY(py) };
    };

    const dodge = () => {
      const now = performance.now();
      if (now - s.dodgeAt < 420) return;
      s.dodgeAt = now;
      const p = s.pointer.x >= 0 ? s.pointer : { x: s.x + W / 2, y: s.y + H / 2 };
      const to = spotNear(p.x, p.y, 260, 420);
      moveTo(to.x, to.y, 260);
      if (Math.random() < 0.35) {
        say(pick(SAY_DODGE), 1100);
        if (s.voice && Math.random() < 0.4) meow(0.1);
      }
      track('easter_egg', { name: 'rumi_dodge' });
    };

    const onMove = (e: PointerEvent) => {
      s.pointer = { x: e.clientX, y: e.clientY };
      if (!s.active) return;
      // Measure where he visibly is (he may be mid-trot), not where he is headed.
      const r = hostRef.current?.getBoundingClientRect();
      if (r && Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < 72) dodge();
    };
    addEventListener('pointermove', onMove, { passive: true });

    /** Clingy loop: keep drifting back toward the cursor, but never close enough to touch. */
    const cling = () => {
      if (!s.active) return;
      if (s.pointer.x >= 0) {
        const to = spotNear(s.pointer.x, s.pointer.y, 120, 190);
        const dist = Math.hypot(to.x - s.x, to.y - s.y);
        moveTo(to.x, to.y, Math.max(700, dist * 5));
      }
      if (Math.random() < 0.35) later(() => {
        say(pick(SAY_IDLE));
        if (s.voice) meow(0.1);
      }, 900);
      later(cling, rand(2600, 4800));
    };

    let shows = 0;
    const show = (from?: { x: number; y: number }) => {
      if (s.active) return;
      s.active = true;
      shows++;
      setVisible(true);
      const h = hostRef.current;
      if (h) h.style.transition = 'none';
      const y0 = from ? from.y : innerHeight - H - 24;
      place(from ? from.x : -W - 20, y0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        moveTo(clampX(rand(innerWidth * 0.25, innerWidth * 0.7)), clampY(y0 - rand(0, 40)), from ? 700 : 2600);
        later(cling, 3400);
        later(leave, rand(40000, 70000));
      }));
      track('easter_egg', { name: 'rumi_walk' });
    };

    const leave = () => {
      if (!s.active) return;
      s.active = false;
      moveTo(innerWidth + 40, s.y, 2600);
      later(() => setVisible(false), 2700);
      if (shows < 3) later(() => show(), rand(60000, 120000));
    };

    // First appearance: random, a little while after load.
    const first = later(() => show(), rand(9000, 24000));

    const onSummon = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      clearTimeout(first);
      show({ x: d.x, y: d.y });
    };
    const onVoice = (e: Event) => { s.voice = (e as CustomEvent<boolean>).detail; };
    const onRain = () => pawRain();

    const pawRain = () => {
      const items = Array.from({ length: 26 }, (_, i) => ({ id: ++s.pawId, x: rand(2, 96), d: rand(0, 900), s: rand(0.8, 1.6) + i * 0 }));
      setRain(items);
      track('easter_egg', { name: 'paw_rain' });
      setTimeout(() => setRain([]), 3600);
      if (s.voice) meow(0.12);
    };

    let buf: string[] = [];
    let word = '';
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      buf = [...buf, k].slice(-KONAMI.length);
      if (buf.join() === KONAMI.join()) pawRain();
      word = (word + k).slice(-4);
      if (word === 'rumi' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) pawRain();
    };

    const original = document.title;
    const onVis = () => { document.title = document.hidden ? 'Rumi misses you…' : original; };

    addEventListener('rumi:summon', onSummon);
    addEventListener('rumi:voice', onVoice);
    addEventListener('rumi:rain', onRain);
    addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);

    const stop = () => {
      s.timers.forEach(clearTimeout);
      s.timers = [];
      s.active = false;
      setVisible(false);
    };
    const onReduce = () => { if (reduce.matches) stop(); };
    reduce.addEventListener('change', onReduce);
    if (reduce.matches) stop(); // no roaming under reduced motion

    return () => {
      stop();
      removeEventListener('pointermove', onMove);
      removeEventListener('rumi:summon', onSummon);
      removeEventListener('rumi:voice', onVoice);
      removeEventListener('rumi:rain', onRain);
      removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
      reduce.removeEventListener('change', onReduce);
      document.title = original;
    };
  }, [mounted]);

  function onActorPress() {
    meow(0.18);
    setBubble('Mrrrow!');
    setTimeout(() => setBubble(null), 900);
    // He decides when contact happens, not you.
    const r = hostRef.current?.getBoundingClientRect();
    if (r) dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
    track('easter_egg', { name: 'rumi_click' });
  }

  if (!mounted) return null;

  return createPortal(
    <div className="rumi-layer" aria-hidden="true">
      {paws.map((p) => (
        <span key={p.id} className="rumi-paw" style={{ left: p.x, top: p.y, transform: `rotate(${p.r}deg)` }}>
          <Paw />
        </span>
      ))}
      {rain.map((p) => (
        <span key={p.id} className="rumi-rain" style={{ left: `${p.x}%`, animationDelay: `${p.d}ms`, scale: p.s }}>
          <Paw px={4} />
        </span>
      ))}
      <div ref={hostRef} className="rumi-host" style={{ display: visible ? 'block' : 'none' }}>
        <button type="button" tabIndex={-1} className="rumi-actor" onPointerDown={onActorPress} data-walking={walking || undefined}>
          {bubble && <span className="rumi-bubble mono">{bubble}</span>}
          <RumiSprite pose="walk" flip={facing === -1} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
