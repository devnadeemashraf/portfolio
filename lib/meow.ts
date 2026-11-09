/**
 * A synthesized cat meow (WebAudio): a gliding sawtooth through moving formant filters with a
 * little vibrato. Original and generated at runtime, so there is no audio file or licence to track.
 * Browsers only allow it after a user gesture, which is exactly when we call it.
 */
let ctx: AudioContext | null = null;

export function meow(volume = 0.16) {
  if (typeof window === 'undefined') return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx ??= new AC();
  if (ctx.state === 'suspended') void ctx.resume();

  const t = ctx.currentTime;
  const dur = 0.5 + Math.random() * 0.3;
  const base = 380 + Math.random() * 180;

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(base, t);
  osc.frequency.linearRampToValueAtTime(base * 1.9, t + dur * 0.35);
  osc.frequency.linearRampToValueAtTime(base * 1.05, t + dur);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 6 + Math.random() * 3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 14;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const formant = ctx.createBiquadFilter();
  formant.type = 'bandpass';
  formant.Q.value = 5;
  formant.frequency.setValueAtTime(650, t);
  formant.frequency.linearRampToValueAtTime(1700, t + dur * 0.4);
  formant.frequency.linearRampToValueAtTime(900, t + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(formant);
  formant.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + dur + 0.05);
  lfo.stop(t + dur + 0.05);
}
