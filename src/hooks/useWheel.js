import { useRef, useEffect, useCallback, useState } from "react";
import { rand } from "../utils/random";
import { playTick, playWheelWin } from "../utils/sound";

export const VIBRANT_PALETTE = [
  "#FF3B3B","#FF8C00","#FFD700","#00C853","#00B0FF",
  "#AA00FF","#FF4081","#00E5FF","#76FF03","#FF6D00",
  "#E040FB","#1DE9B6","#FF1744","#2979FF","#FFEA00",
  "#69F0AE","#F50057","#00E676","#651FFF","#FF9100",
];

const IDLE_VEL   = 0.0025;
const FRICTION   = 0.9920;   // gentle — wheel coasts long
const MIN_SPIN   = 0.30;
const EXTRA_SPIN = 0.18;
const SETTLE_VEL = 0.0008;   // threshold to declare stopped

export function useWheel(entries, settings = {}) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    angle: 0, velocity: IDLE_VEL, mode: "idle", winner: null,
    lastTickAngle: 0,
  });
  const rafRef    = useRef(null);
  const [winner,   setWinner]   = useState(null);
  const [spinning, setSpinning] = useState(false);

  const sliceAt = useCallback((angle) => {
    const n = entries.length;
    if (!n) return null;
    const arc = (Math.PI * 2) / n;
    const norm = ((-angle + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    return Math.floor(norm / arc) % n;
  }, [entries]);

  const draw = useCallback((canvas) => {
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = window.devicePixelRatio || 1;
    const size = canvas.getBoundingClientRect().width;
    if (!size) return;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const r  = size / 2 - 10;
    const n  = entries.length;
    const { angle } = stateRef.current;

    ctx.clearRect(0, 0, size, size);

    // shadow ring
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur  = 24;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.fillStyle = "transparent";
    ctx.fill();
    ctx.restore();

    // outer border
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "var(--border-2)";
    ctx.lineWidth   = 2;
    ctx.stroke();

    if (n === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "var(--bg-2)";
      ctx.fill();
      ctx.fillStyle    = "var(--text-3)";
      ctx.font         = `13px "DM Mono", monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Add entries →", cx, cy);
      return;
    }

    const arc = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++) {
      const start = angle + arc * i - Math.PI / 2;
      const end   = start + arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = VIBRANT_PALETTE[i % VIBRANT_PALETTE.length];
      ctx.fill();
      if (n <= 40) {
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }

      // label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      const fs    = Math.min(14, Math.max(7, 130 / n));
      ctx.font    = `600 ${fs}px "DM Mono", monospace`;
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur  = 3;
      const maxCh = Math.max(4, Math.floor((r - 28) / (fs * 0.58)));
      const raw   = entries[i] ?? "";
      const label = raw.length > maxCh ? raw.slice(0, maxCh - 1) + "…" : raw;
      ctx.fillText(label, r - 14, 0);
      ctx.restore();
    }

    // hub
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = "var(--bg)";
    ctx.fill();
    ctx.strokeStyle = "var(--border-2)";
    ctx.lineWidth   = 2;
    ctx.stroke();

    // pointer — triangle at top pointing DOWN into wheel
    const pW = 11, pH = 22;
    ctx.beginPath();
    ctx.moveTo(cx,      cy - r + pH);   // tip points inward
    ctx.lineTo(cx - pW, cy - r - 4);
    ctx.lineTo(cx + pW, cy - r - 4);
    ctx.closePath();
    ctx.fillStyle   = "var(--text)";
    ctx.fill();
    ctx.strokeStyle = "var(--bg)";
    ctx.lineWidth   = 2;
    ctx.stroke();

    // "Click to spin" hint
    if (settings.showClickHint && stateRef.current.mode === "idle") {
      ctx.fillStyle    = "rgba(255,255,255,0.55)";
      ctx.font         = `12px "DM Mono", monospace`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Click to spin", cx, cy + r * 0.72);
    }
  }, [entries, settings.showClickHint]);

  const loop = useCallback(() => {
    const s   = stateRef.current;
    const canvas = canvasRef.current;

    if (s.mode === "idle") {
      s.angle += IDLE_VEL;
    } else if (s.mode === "spinning") {
      s.angle    += s.velocity;
      s.velocity *= FRICTION;

      // tick sound when crossing a slice boundary
      if (entries.length > 0) {
        const cur = sliceAt(s.angle);
        const prv = sliceAt(s.lastTickAngle);
        if (cur !== prv) {
          const speedRatio = Math.min(1, s.velocity / MIN_SPIN);
          playTick(0.15 + speedRatio * 0.35);
          s.lastTickAngle = s.angle;
        }
      }

      // Natural stop: velocity is tiny AND we're close to completing current slice
      if (s.velocity < SETTLE_VEL) {
        // Coast to finish the current slice cleanly
        if (entries.length > 0) {
          const arc  = (Math.PI * 2) / entries.length;
          const norm = ((-s.angle + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const posInSlice = norm % arc;
          // spin just enough to reach the MIDDLE of this slice (clean stop)
          const toMid = arc / 2 - posInSlice;
          if (toMid > 0) {
            s.angle -= toMid;   // rotate backward slightly to centre
          }
        }
        s.mode = "settled";
        setSpinning(false);
        const idx = sliceAt(s.angle);
        const win = entries[idx] ?? "";
        s.winner  = win;
        setWinner(win);
        playWheelWin();
        return; // stop loop advancing
      }
    }

    draw(canvas);
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, entries, sliceAt]);

  useEffect(() => {
    const s = stateRef.current;
    if (s.mode !== "spinning") {
      s.mode     = "idle";
      s.velocity = IDLE_VEL;
    }
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw(canvas));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const spin = useCallback(() => {
    const s = stateRef.current;
    if (s.mode === "spinning" || entries.length === 0) return;
    setWinner(null);
    s.winner   = null;
    s.velocity = MIN_SPIN + rand() * EXTRA_SPIN;
    s.mode     = "spinning";
    s.lastTickAngle = s.angle;
    setSpinning(true);
  }, [entries.length]);

  const resetWinner = useCallback(() => {
    setWinner(null);
    stateRef.current.winner = null;
    stateRef.current.mode   = "idle";
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  return { canvasRef, spin, winner, spinning, resetWinner };
}
