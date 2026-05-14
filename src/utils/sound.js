/**
 * Procedural audio via Web Audio API — no external files needed.
 */

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function gain(ac, value, at = 0) {
  const g = ac.createGain();
  g.gain.setValueAtTime(value, at);
  return g;
}

/** Short tick sound used during wheel spin */
export function playTick(volume = 0.4) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const g = gain(ac, 0);
    osc.connect(g); g.connect(ac.destination);
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.start(t); osc.stop(t + 0.06);
  } catch {}
}

/** Fanfare / win sound for wheel */
export function playWheelWin(volume = 0.5) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g = gain(ac, 0);
      osc.type = "triangle";
      osc.connect(g); g.connect(ac.destination);
      osc.frequency.setValueAtTime(freq, t + i * 0.1);
      g.gain.setValueAtTime(volume * 0.6, t + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.35);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.4);
    });
  } catch {}
}

/** Heads sound — bright upward chime */
export function playHeads(volume = 0.5) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const g = gain(ac, 0);
    osc.type = "sine";
    osc.connect(g); g.connect(ac.destination);
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.15);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.start(t); osc.stop(t + 0.45);
  } catch {}
}

/** Tails sound — lower descending tone */
export function playTails(volume = 0.5) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const g = gain(ac, 0);
    osc.type = "sine";
    osc.connect(g); g.connect(ac.destination);
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.2);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.start(t); osc.stop(t + 0.5);
  } catch {}
}

/** Dice roll rumble */
export function playDiceRoll(volume = 0.4) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = ac.createOscillator();
      const g = gain(ac, 0);
      osc.type = "sawtooth";
      osc.connect(g); g.connect(ac.destination);
      const freq = 80 + Math.random() * 120;
      osc.frequency.setValueAtTime(freq, t + i * 0.04);
      g.gain.setValueAtTime(volume * 0.3, t + i * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.06);
      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.08);
    }
  } catch {}
}

/** Number generated pop */
export function playNumberPop(volume = 0.35) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    const osc = ac.createOscillator();
    const g = gain(ac, 0);
    osc.type = "sine";
    osc.connect(g); g.connect(ac.destination);
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t); osc.stop(t + 0.2);
  } catch {}
}

/** Picker result sound */
export function playPickerResult(volume = 0.4) {
  try {
    const ac = getCtx();
    const t = ac.currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g = gain(ac, 0);
      osc.type = "sine";
      osc.connect(g); g.connect(ac.destination);
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      g.gain.setValueAtTime(volume * 0.5, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.25);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.3);
    });
  } catch {}
}
