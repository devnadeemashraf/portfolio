/**
 * Rumi's voice: synthesized cat sounds (WebAudio). Original and generated at runtime, so there is no
 * audio file or licence to track. Browsers only allow audio after a user gesture.
 *
 * Each `kind` is a personality: a pitch contour, formant sweep, vibrato and loudness, so the sound
 * matches what he is doing (greeting, demanding, annoyed, playing, sleepy, curious, smug, purring).
 */
export type MeowKind = 'greet' | 'demand' | 'annoyed' | 'playful' | 'sleepy' | 'curious' | 'smug' | 'purr';

type Voice = {
  dur: [number, number];
  base: [number, number];
  contour: [number, number][]; // [t 0..1, pitch multiplier]
  formant: [number, number, number]; // start, peak, end (Hz)
  vib: [number, number]; // rate Hz, depth Hz
  vol: number;
  q: number;
};

const VOICES: Record<Exclude<MeowKind, 'purr' | 'playful'>, Voice> = {
  greet: { dur: [0.38, 0.5], base: [520, 640], contour: [[0, 1], [0.35, 1.5], [1, 1.2]], formant: [800, 1900, 1200], vib: [7, 10], vol: 1, q: 5 },
  demand: { dur: [0.9, 1.15], base: [430, 520], contour: [[0, 1], [0.25, 1.6], [0.55, 1.35], [0.8, 1.7], [1, 1.1]], formant: [750, 1700, 950], vib: [6, 18], vol: 1.3, q: 4 },
  annoyed: { dur: [0.26, 0.36], base: [300, 380], contour: [[0, 1.3], [1, 0.8]], formant: [600, 1100, 700], vib: [0, 0], vol: 1.15, q: 7 },
  sleepy: { dur: [0.7, 0.95], base: [250, 300], contour: [[0, 1], [0.4, 1.25], [1, 0.85]], formant: [500, 1000, 600], vib: [4, 6], vol: 0.55, q: 3 },
  curious: { dur: [0.28, 0.36], base: [480, 540], contour: [[0, 0.9], [1, 1.65]], formant: [700, 1600, 1400], vib: [8, 6], vol: 0.9, q: 5 },
  smug: { dur: [0.75, 0.9], base: [430, 480], contour: [[0, 1.4], [0.5, 1.2], [1, 0.7]], formant: [900, 1500, 700], vib: [5, 10], vol: 0.9, q: 4 },
};

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function voiceAt(c: AudioContext, v: Voice, at: number, volume: number, pitch = 1, durScale = 1) {
  const dur = rand(...v.dur) * durScale;
  const base = rand(...v.base) * pitch;

  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  v.contour.forEach(([t, m], i) => {
    const f = base * m;
    if (i === 0) osc.frequency.setValueAtTime(f, at + t * dur);
    else osc.frequency.linearRampToValueAtTime(f, at + t * dur);
  });

  if (v.vib[0] > 0) {
    const lfo = c.createOscillator();
    lfo.frequency.value = v.vib[0] + Math.random() * 2;
    const lg = c.createGain();
    lg.gain.value = v.vib[1];
    lfo.connect(lg);
    lg.connect(osc.frequency);
    lfo.start(at);
    lfo.stop(at + dur + 0.05);
  }

  const formant = c.createBiquadFilter();
  formant.type = 'bandpass';
  formant.Q.value = v.q;
  formant.frequency.setValueAtTime(v.formant[0], at);
  formant.frequency.linearRampToValueAtTime(v.formant[1], at + dur * 0.4);
  formant.frequency.linearRampToValueAtTime(v.formant[2], at + dur);

  const g = c.createGain();
  const peak = 0.16 * volume * v.vol;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + Math.min(0.07, dur * 0.2));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(formant);
  formant.connect(g);
  g.connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
  return dur;
}

function purr(c: AudioContext, volume: number, seconds = 3) {
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 52;
  const low = c.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 380;
  const am = c.createGain();
  am.gain.value = 0;
  const lfo = c.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 24;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 0.5;
  lfo.connect(lfoGain);
  lfoGain.connect(am.gain);
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.22 * volume, t + 0.4);
  out.gain.setValueAtTime(0.22 * volume, t + seconds - 0.7);
  out.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
  osc.connect(low);
  low.connect(am);
  am.connect(out);
  out.connect(c.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + seconds + 0.05);
  lfo.stop(t + seconds + 0.05);
}

export function meow(kind: MeowKind = 'greet', volume = 1) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  if (kind === 'purr') return purr(c, volume);
  if (kind === 'playful') {
    // a quick trill of three rising chirps
    const chirp: Voice = { dur: [0.1, 0.13], base: [680, 820], contour: [[0, 0.9], [1, 1.5]], formant: [900, 1900, 1500], vib: [0, 0], vol: 0.8, q: 5 };
    voiceAt(c, chirp, t, volume);
    voiceAt(c, chirp, t + 0.15, volume, 1.1);
    voiceAt(c, chirp, t + 0.3, volume, 1.22);
    return;
  }
  voiceAt(c, VOICES[kind], t, volume);
}
