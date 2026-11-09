'use client';

import { useEffect } from 'react';

/**
 * A constant, very soft purr under the whole site: low-passed noise, amplitude-modulated at about 25 Hz (a cat's purr rate).
 * Browsers only allow sound after a gesture, so it fades in on the first tap, key or click.
 * It pauses when the tab is hidden and stops entirely when Rumi is resting (rumi:rest).
 */
const LEVEL = 0.018; // very quiet on purpose

export function RumiPurr() {
  useEffect(() => {
    let ctx: AudioContext | null = null;
    let master: GainNode | null = null;
    let nodes: AudioNode[] = [];
    let sources: AudioScheduledSourceNode[] = [];
    let resting = localStorage.getItem('rumi-rest') === 'on';
    let armed = false;

    const build = () => {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const len = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.04 * w) / 1.04; // brown-ish noise: soft and low
        d[i] = last * 3.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;

      const low = ctx.createBiquadFilter();
      low.type = 'lowpass';
      low.frequency.value = 320;
      const body = ctx.createBiquadFilter();
      body.type = 'peaking';
      body.frequency.value = 110;
      body.gain.value = 6;

      const pulse = ctx.createGain();
      pulse.gain.value = 0.55;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 25;
      const depth = ctx.createGain();
      depth.gain.value = 0.45;
      lfo.connect(depth).connect(pulse.gain);

      // a slow swell, so it breathes
      const swell = ctx.createOscillator();
      swell.frequency.value = 0.12;
      const swellDepth = ctx.createGain();
      swellDepth.gain.value = LEVEL * 0.25;

      master = ctx.createGain();
      master.gain.value = 0;
      swell.connect(swellDepth).connect(master.gain);

      noise.connect(low).connect(body).connect(pulse).connect(master).connect(ctx.destination);
      noise.start();
      lfo.start();
      swell.start();
      nodes = [low, body, pulse, depth, swellDepth, master];
      sources = [noise, lfo, swell];
    };

    const fade = (to: number, secs: number) => {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(to, t + secs);
    };

    const play = async () => {
      if (resting || document.hidden) return;
      if (!ctx) build();
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
      fade(LEVEL, 4);
    };

    const stop = () => {
      fade(0, 0.8);
      const c = ctx;
      if (c) setTimeout(() => { if (resting || document.hidden) c.suspend().catch(() => {}); }, 900);
    };

    const arm = () => {
      if (armed) return;
      armed = true;
      removeEventListener('pointerdown', arm);
      removeEventListener('keydown', arm);
      void play();
    };
    addEventListener('pointerdown', arm, { passive: true });
    addEventListener('keydown', arm);

    const onRest = (e: Event) => {
      resting = (e as CustomEvent<boolean>).detail;
      if (resting) stop();
      else if (armed) void play();
    };
    const onVis = () => {
      if (!armed) return;
      if (document.hidden) stop();
      else void play();
    };
    addEventListener('rumi:rest', onRest);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      removeEventListener('pointerdown', arm);
      removeEventListener('keydown', arm);
      removeEventListener('rumi:rest', onRest);
      document.removeEventListener('visibilitychange', onVis);
      sources.forEach((s) => { try { s.stop(); } catch {} });
      nodes.forEach((n) => n.disconnect());
      ctx?.close().catch(() => {});
    };
  }, []);

  return null;
}
