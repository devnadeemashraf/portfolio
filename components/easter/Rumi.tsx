'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RumiSprite, Paw, type RumiPose } from './RumiSprite';
import { meow, type MeowKind } from '@/lib/meow';
import { track } from '../analytics/track';

/**
 * Rumi roams the page. Everything is his idea, not yours:
 *  - He is clingy: he keeps drifting back to your cursor, but dodges if you get close.
 *  - If you hold still for a while he comes to nap next to the cursor. Move, and he wakes and follows.
 *  - Touch him while he sleeps and he decides: a purr and a pet, or a grumpy dash away.
 *  - Toss him a cotton ball and he decides whether it's worth his time. If it is, he plays.
 * His meows have personalities (greeting, demanding, annoyed, playful, sleepy, curious, smug, purring).
 * Decorative and skipped entirely under prefers-reduced-motion; the footer still shows a static Rumi.
 */

const W = 68;
const H = 40;
const BALL = 18;

const SAY_DODGE = ['Nope.', 'Hmph.', 'Not today.', 'Rude.', 'Mrp!', 'Too slow.'];
const SAY_IDLE = ['Mrrrow?', 'Mrrp.', '*stares*', 'Mew!', 'I am here. Obviously.'];
const SAY_IGNORE = ['…no.', '*yawns*', 'Boring.', 'I saw it. I chose not to.', '*looks away*'];
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]!;

type Mode = 'off' | 'follow' | 'sleep' | 'purr' | 'play';
type Api = { press: () => void; toss: (x?: number, y?: number) => void };

export function Rumi() {
  const hostRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const api = useRef<Api>({ press() {}, toss() {} });

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pose, setPose] = useState<RumiPose>('sit');
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hearts, setHearts] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [ball, setBall] = useState(false);
  const [armed, setArmed] = useState(false);
  const [paws, setPaws] = useState<{ id: number; x: number; y: number; r: number }[]>([]);
  const [rain, setRain] = useState<{ id: number; x: number; d: number; s: number }[]>([]);

  const st = useRef({ armed: false });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const s = {
      x: -200, y: 0, active: false, mode: 'off' as Mode, epoch: 0, asleep: false, voice: false,
      pointer: { x: -1, y: -1 }, lastMove: performance.now(), sleepAnchor: { x: -1, y: -1 },
      dodgeAt: 0, petAt: 0, pawId: 0, shows: 0,
      ball: { x: 0, y: 0, vx: 0, vy: 0, on: false },
      timers: [] as ReturnType<typeof setTimeout>[],
      bubbleT: undefined as ReturnType<typeof setTimeout> | undefined,
    };
    s.voice = localStorage.getItem('rumi-voice') === 'on';

    /* ---------- helpers ---------- */
    const later = (fn: () => void, ms: number, bound = true) => {
      const e = s.epoch;
      const t = setTimeout(() => { if (!bound || e === s.epoch) fn(); }, ms);
      s.timers.push(t);
      return t;
    };
    const wait = (ms: number) => new Promise<void>((r) => s.timers.push(setTimeout(r, ms)));
    const setMode = (m: Mode) => { s.epoch++; s.mode = m; };
    /** Direct interactions always get a voice; ambient ones only if the footer toggle is on. */
    const sound = (kind: MeowKind, direct = false, vol = 1) => { if (direct || s.voice) meow(kind, vol); };
    const say = (text: string, ms = 1800) => {
      clearTimeout(s.bubbleT);
      setBubble(text);
      if (ms > 0) s.bubbleT = setTimeout(() => setBubble(null), ms);
    };
    const hush = () => { clearTimeout(s.bubbleT); setBubble(null); };

    const clampX = (x: number) => Math.min(innerWidth - W - 8, Math.max(8, x));
    const clampY = (y: number) => Math.min(innerHeight - H - 8, Math.max(72, y));
    const rect = () => hostRef.current?.getBoundingClientRect();
    const center = () => {
      const r = rect();
      return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: s.x + W / 2, y: s.y + H / 2 };
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
          later(() => layPaw(fx + dx * f + W / 2 + nx * side, fy + dy * f + H - 4 + ny * side, angle + 90), ms * f, false);
        }
      }
      later(() => setWalking(false), ms, false);
    };

    const spotNear = (px: number, py: number, min: number, max: number) => {
      for (let i = 0; i < 8; i++) {
        const a = rand(0, Math.PI * 2), d = rand(min, max);
        const x = px + Math.cos(a) * d - W / 2, y = py + Math.sin(a) * d - H / 2;
        if (x > 8 && x < innerWidth - W - 8 && y > 72 && y < innerHeight - H - 8) return { x, y };
      }
      return { x: clampX(px + (px < innerWidth / 2 ? max : -max)), y: clampY(py) };
    };

    /* ---------- behaviours ---------- */
    const follow = () => {
      setMode('follow');
      s.asleep = false;
      setPose('sit');
      setHearts(false);
      hush();
      const loop = () => {
        if (!s.active) return;
        const idle = performance.now() - s.lastMove;
        if (s.pointer.x >= 0 && idle > 5500) return goSleep();
        if (s.pointer.x >= 0) {
          const to = spotNear(s.pointer.x, s.pointer.y, 120, 190);
          const dist = Math.hypot(to.x - s.x, to.y - s.y);
          moveTo(to.x, to.y, Math.max(700, dist * 5));
        }
        if (Math.random() < 0.3) later(() => { say(pick(SAY_IDLE)); sound('curious'); }, 900);
        later(loop, rand(2600, 4800));
      };
      later(loop, 1200);
    };

    const goSleep = () => {
      setMode('sleep');
      s.asleep = false;
      const p = s.pointer;
      const to = spotNear(p.x, p.y, 70, 100);
      const ms = Math.max(800, Math.hypot(to.x - s.x, to.y - s.y) * 5);
      moveTo(to.x, to.y, ms);
      later(() => {
        s.asleep = true;
        s.sleepAnchor = { ...s.pointer };
        setPose('sleep');
        say('Zzz…', 0);
        sound('sleepy');
        track('easter_egg', { name: 'rumi_sleep' });
      }, ms + 60);
    };

    const wake = () => {
      s.asleep = false;
      say('Mrrp!', 1400);
      sound('sleepy');
      follow();
    };

    const dash = () => {
      const p = s.pointer.x >= 0 ? s.pointer : center();
      const to = spotNear(p.x, p.y, 260, 420);
      moveTo(to.x, to.y, 260);
    };

    const dodge = () => {
      const now = performance.now();
      if (now - s.dodgeAt < 420) return;
      s.dodgeAt = now;
      dash();
      if (Math.random() < 0.35) {
        say(pick(SAY_DODGE), 1100);
        sound('annoyed', false, 0.7);
      }
      track('easter_egg', { name: 'rumi_dodge' });
    };

    /** Someone touched him while he slept. He decides, not you. */
    const pet = () => {
      const now = performance.now();
      if (now - s.petAt < 2500) return;
      s.petAt = now;
      if (Math.random() < 0.5) {
        setMode('purr');
        setPose('happy');
        setHearts(true);
        say('prrrrr…', 3200);
        sound('purr', true);
        track('easter_egg', { name: 'rumi_pet_allowed' });
        later(() => {
          setHearts(false);
          setMode('sleep');
          s.asleep = true;
          s.sleepAnchor = { ...s.pointer };
          setPose('sleep');
          say('Zzz…', 0);
        }, 3500);
      } else {
        s.asleep = false;
        setPose('sit');
        setHearts(false);
        say('MROW!', 1400);
        sound('annoyed', true);
        track('easter_egg', { name: 'rumi_pet_refused' });
        setMode('follow');
        dash();
        later(follow, 1600, false);
      }
    };

    /* ---------- cotton ball ---------- */
    const setBallPos = (x: number, y: number) => {
      s.ball.x = x; s.ball.y = y;
      const b = ballRef.current;
      if (b) b.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const batBall = () =>
      new Promise<void>((resolve) => {
        const c = center();
        const base = Math.atan2(s.ball.y - c.y, s.ball.x - c.x) + rand(-1.1, 1.1);
        const speed = rand(380, 640);
        s.ball.vx = Math.cos(base) * speed;
        s.ball.vy = Math.sin(base) * speed;
        let last = performance.now();
        const step = (t: number) => {
          const dt = Math.min(0.04, (t - last) / 1000);
          last = t;
          const b = s.ball;
          b.x += b.vx * dt; b.y += b.vy * dt;
          const k = Math.exp(-2.4 * dt);
          b.vx *= k; b.vy *= k;
          if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.7; }
          if (b.x > innerWidth - BALL) { b.x = innerWidth - BALL; b.vx = -Math.abs(b.vx) * 0.7; }
          if (b.y < 72) { b.y = 72; b.vy = Math.abs(b.vy) * 0.7; }
          if (b.y > innerHeight - BALL) { b.y = innerHeight - BALL; b.vy = -Math.abs(b.vy) * 0.7; }
          setBallPos(b.x, b.y);
          if (Math.hypot(b.vx, b.vy) < 24) return resolve();
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

    const runToBall = async () => {
      const x = clampX(s.ball.x - W / 2), y = clampY(s.ball.y - H + 8);
      const ms = Math.max(380, Math.hypot(x - s.x, y - s.y) * 2.2);
      moveTo(x, y, ms);
      await wait(ms + 60);
    };

    const play = async () => {
      setMode('play');
      const e = s.epoch;
      s.asleep = false;
      setPose('sit');
      setHearts(false);
      say('Mrp!', 1200);
      sound('curious', true);
      track('easter_egg', { name: 'rumi_plays' });
      const bats = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < bats; i++) {
        await runToBall();
        if (e !== s.epoch) return;
        setPlaying(true);
        await wait(520); // the butt wiggle
        setPlaying(false);
        if (e !== s.epoch) return;
        sound('playful', true);
        await batBall();
        if (e !== s.epoch) return;
        await wait(250);
        if (e !== s.epoch) return;
      }
      await runToBall();
      if (e !== s.epoch) return;
      say('Mine.', 2400);
      sound('smug', true);
      await wait(2800);
      if (e !== s.epoch) return;
      setBall(false);
      s.ball.on = false;
      follow();
    };

    const decide = () => {
      if (!s.active) return;
      if (Math.random() < 0.55) return void play();
      // He saw it. He chose not to.
      say(pick(SAY_IGNORE), 2200);
      sound(s.asleep ? 'sleepy' : 'smug', true, 0.8);
      track('easter_egg', { name: 'rumi_ignores_ball' });
      later(() => setBall(false), 9000, false);
    };

    const toss = (tx?: number, ty?: number) => {
      if (!s.active) return;
      const target = {
        x: Math.min(innerWidth - BALL - 8, Math.max(8, (tx ?? rand(innerWidth * 0.2, innerWidth * 0.8)) - BALL / 2)),
        y: Math.min(innerHeight - BALL - 8, Math.max(80, (ty ?? rand(innerHeight * 0.3, innerHeight * 0.75)) - BALL / 2)),
      };
      const sx = innerWidth - 60, sy = innerHeight - 70;
      const b = ballRef.current;
      if (!b) return;
      s.ball = { ...target, vx: 0, vy: 0, on: true };
      setBall(true);
      track('easter_egg', { name: 'cotton_ball' });
      requestAnimationFrame(() => {
        const a = b.animate(
          [
            { transform: `translate3d(${sx}px, ${sy}px, 0) scale(0.8)` },
            { transform: `translate3d(${(sx + target.x) / 2}px, ${Math.min(sy, target.y) - 120}px, 0) scale(1.25)`, offset: 0.5 },
            { transform: `translate3d(${target.x}px, ${target.y}px, 0) scale(1)` },
          ],
          { duration: 560, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' },
        );
        a.finished.then(() => { a.cancel(); setBallPos(target.x, target.y); decide(); }).catch(() => {});
      });
    };

    api.current = {
      press() {
        sound('greet', true);
        if (s.mode === 'sleep' && s.asleep) return pet();
        setBubble('Mrrrow!');
        setTimeout(() => setBubble(null), 900);
        if (s.mode === 'follow') dodge();
      },
      toss,
    };

    /* ---------- pointer ---------- */
    const onMove = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - s.pointer.x, e.clientY - s.pointer.y);
      s.pointer = { x: e.clientX, y: e.clientY };
      s.lastMove = performance.now();
      if (!s.active) return;
      const c = center();
      const d = Math.hypot(e.clientX - c.x, e.clientY - c.y);
      if (s.mode === 'sleep') {
        if (!s.asleep) { if (moved > 6) wake(); return; }
        if (d < 46) return pet(); // you touched him
        if (Math.hypot(e.clientX - s.sleepAnchor.x, e.clientY - s.sleepAnchor.y) > 8) wake();
        return;
      }
      if (s.mode === 'follow' && d < 72) dodge(); // awake: he is never where you reach
    };
    addEventListener('pointermove', onMove, { passive: true });

    /* ---------- lifecycle ---------- */
    const show = (from?: { x: number; y: number }) => {
      if (s.active) return;
      s.active = true;
      s.shows++;
      setVisible(true);
      const h = hostRef.current;
      if (h) h.style.transition = 'none';
      const y0 = from ? from.y : innerHeight - H - 24;
      place(from ? from.x : -W - 20, y0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        moveTo(clampX(rand(innerWidth * 0.25, innerWidth * 0.7)), clampY(y0 - rand(0, 40)), from ? 700 : 2600);
        later(follow, from ? 900 : 3000, false);
        later(leave, rand(60000, 90000), false);
      }));
      track('easter_egg', { name: 'rumi_walk' });
    };

    const leave = () => {
      if (!s.active || s.mode === 'play') return;
      setMode('off');
      s.active = false;
      s.asleep = false;
      hush();
      setPose('sit');
      moveTo(innerWidth + 40, s.y, 2600);
      later(() => { setVisible(false); setBall(false); }, 2700, false);
      if (s.shows < 3) later(() => show(), rand(60000, 120000), false);
    };

    const first = later(() => show(), rand(9000, 24000), false);

    const onSummon = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      clearTimeout(first);
      show({ x: d.x, y: d.y });
    };
    const onVoice = (e: Event) => { s.voice = (e as CustomEvent<boolean>).detail; };

    const pawRain = () => {
      const items = Array.from({ length: 26 }, () => ({ id: ++s.pawId, x: rand(2, 96), d: rand(0, 900), s: rand(0.8, 1.6) }));
      setRain(items);
      track('easter_egg', { name: 'paw_rain' });
      setTimeout(() => setRain([]), 3600);
      sound('playful', true, 0.8);
    };

    let buf: string[] = [];
    let word = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && st.current.armed) { st.current.armed = false; setArmed(false); }
      const k = e.key.toLowerCase();
      buf = [...buf, k].slice(-KONAMI.length);
      if (buf.join() === KONAMI.join()) pawRain();
      word = (word + k).slice(-4);
      if (word === 'rumi' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) pawRain();
    };

    /** Armed cotton-ball mode: the next click anywhere throws the ball there. */
    const onThrow = (e: MouseEvent) => {
      if (!st.current.armed) return;
      if ((e.target as Element | null)?.closest('.rumi-ball-btn')) return;
      e.preventDefault();
      e.stopPropagation();
      st.current.armed = false;
      setArmed(false);
      toss(e.clientX, e.clientY);
    };

    const original = document.title;
    const onVis = () => { document.title = document.hidden ? 'Rumi misses you…' : original; };

    addEventListener('rumi:summon', onSummon);
    addEventListener('rumi:voice', onVoice);
    addEventListener('keydown', onKey);
    addEventListener('click', onThrow, true);
    document.addEventListener('visibilitychange', onVis);

    const stop = () => {
      s.timers.forEach(clearTimeout);
      s.timers = [];
      s.epoch++;
      s.active = false;
      setVisible(false);
      setBall(false);
      st.current.armed = false;
      setArmed(false);
    };
    const onReduce = () => { if (reduce.matches) stop(); };
    reduce.addEventListener('change', onReduce);
    if (reduce.matches) stop();

    return () => {
      stop();
      removeEventListener('pointermove', onMove);
      removeEventListener('rumi:summon', onSummon);
      removeEventListener('rumi:voice', onVoice);
      removeEventListener('keydown', onKey);
      removeEventListener('click', onThrow, true);
      document.removeEventListener('visibilitychange', onVis);
      reduce.removeEventListener('change', onReduce);
      document.title = original;
    };
  }, [mounted]);

  function onBallButton() {
    if (st.current.armed) {
      st.current.armed = false;
      setArmed(false);
      api.current.toss(); // pressed twice (or by keyboard): toss somewhere
    } else {
      st.current.armed = true;
      setArmed(true);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <>
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
        <div ref={ballRef} className="rumi-ball" style={{ display: ball ? 'block' : 'none' }} />
        <div ref={hostRef} className="rumi-host" style={{ display: visible ? 'block' : 'none' }}>
          <button
            type="button"
            tabIndex={-1}
            className="rumi-actor"
            onPointerDown={() => api.current.press()}
            data-walking={walking || undefined}
            data-play={playing || undefined}
          >
            {bubble && <span className="rumi-bubble mono">{bubble}</span>}
            {hearts && <span className="rumi-hearts">♥ ♥</span>}
            <RumiSprite pose={walking ? 'walk' : pose} flip={facing === -1} />
          </button>
        </div>
      </div>

      {visible && (
        <button
          type="button"
          className="rumi-ball-btn"
          aria-pressed={armed}
          aria-label={armed ? 'Cotton ball ready. Click anywhere to throw it, or press again to toss it somewhere.' : 'Toss Rumi a cotton ball'}
          onClick={onBallButton}
        >
          <span className="rumi-ball-icon" aria-hidden="true" />
          <span className="rumi-ball-hint mono" aria-hidden="true">{armed ? 'click anywhere' : 'toss a cotton ball'}</span>
        </button>
      )}
    </>,
    document.body,
  );
}
