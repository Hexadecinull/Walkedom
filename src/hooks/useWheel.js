import { useRef, useEffect, useCallback, useState } from "react";
import { rand } from "../utils/random";

const PALETTE = [
  "#c8b89a", "#8fadb8", "#a8b88f", "#b89e8f",
  "#9e8fb8", "#b8a88f", "#8fb8a8", "#b88f9e",
  "#a89e8f", "#8f9eb8", "#b8b88f", "#9eb88f",
];

const IDLE_VELOCITY = 0.003; // rad/frame — slow ambient drift
const FRICTION      = 0.9875;
const MIN_SPIN_VEL  = 0.22;
const EXTRA_SPIN    = 0.14;

export function useWheel(entries) {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({
    angle:    0,
    velocity: IDLE_VELOCITY,
    mode:     "idle",   // "idle" | "spinning" | "settled"
    winner:   null,
  });
  const rafRef      = useRef(null);
  const [winner, setWinner]   = useState(null);
  const [spinning, setSpinning] = useState(false);

  // ── Draw ────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = window.devicePixelRatio || 1;
    const size = canvas.getBoundingClientRect().width;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r  = size / 2 - 6;
    const n  = entries.length;
    const { angle } = stateRef.current;

    ctx.clearRect(0, 0, size, size);

    // outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth   = 1;
    ctx.stroke();

    if (n === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#161616";
      ctx.fill();
      ctx.fillStyle   = "#555";
      ctx.font        = `13px "DM Mono", monospace`;
      ctx.textAlign   = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Add entries →", cx, cy);
      return;
    }

    const arc = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const start = angle + arc * i - Math.PI / 2;
      const end   = start + arc;

      // slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();

      // divider
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + 0.004);
      ctx.strokeStyle = "#0f0f0f";
      ctx.lineWidth   = n > 20 ? 1 : 2;
      ctx.stroke();

      // label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign    = "right";
      ctx.textBaseline = "middle";
      const fontSize   = Math.min(13, Math.max(8, 120 / n));
      ctx.font         = `500 ${fontSize}px "DM Mono", monospace`;
      ctx.fillStyle    = "#0f0f0f";
      const maxLen     = Math.floor(r * 0.55 / (fontSize * 0.55));
      const raw        = entries[i] ?? "";
      const label      = raw.length > maxLen ? raw.slice(0, maxLen - 1) + "…" : raw;
      ctx.fillText(label, r - 10, 0);
      ctx.restore();
    }

    // center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle   = "#0f0f0f";
    ctx.fill();
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // ── Pointer at 12 o'clock (top) pointing DOWN into wheel ──
    // The wheel is indexed from 12 o'clock, so the pointer lives at top.
    const pTipX = cx;
    const pTipY = cy - r - 2;     // just outside rim at top
    const pW    = 9;
    const pH    = 18;

    ctx.beginPath();
    ctx.moveTo(pTipX, pTipY + pH);            // base centre
    ctx.lineTo(pTipX - pW, pTipY);            // left corner
    ctx.lineTo(pTipX + pW, pTipY);            // right corner
    ctx.closePath();
    ctx.fillStyle   = "#f0f0f0";
    ctx.fill();
    ctx.strokeStyle = "#0f0f0f";
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  }, [entries]);

  // ── Animation loop ───────────────────────────────────────────
  const loop = useCallback(() => {
    const s = stateRef.current;

    if (s.mode === "idle") {
      s.angle += IDLE_VELOCITY;
    } else if (s.mode === "spinning") {
      s.angle    += s.velocity;
      s.velocity *= FRICTION;

      if (s.velocity < 0.002) {
        s.mode = "settled";
        setSpinning(false);

        // Determine winner: pointer at top = angle offset 0 from -π/2.
        // Slice i starts at angle + arc*i - π/2.
        // We want which slice bracket contains 0 (top of canvas).
        // Normalise: find angle such that we know which slice is at top.
        const n   = entries.length;
        const arc = (Math.PI * 2) / n;

        // Top of wheel is at -π/2 in canvas coords (our start offset).
        // A slice i occupies [angle + arc*i - π/2, angle + arc*(i+1) - π/2].
        // We want the slice whose range contains 0 + 2kπ.
        // Equivalently: which i satisfies (0 - (angle - π/2)) mod 2π in [arc*i, arc*(i+1))
        const normalised = ((-s.angle + Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const idx  = Math.floor(normalised / arc) % n;
        const win  = entries[idx] ?? "";
        s.winner   = win;
        setWinner(win);
      }
    }
    // "settled" — wheel is still, no angle change

    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, entries]);

  // start loop on mount / entries change
  useEffect(() => {
    stateRef.current.mode = "idle";
    stateRef.current.velocity = IDLE_VELOCITY;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  // resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const spin = useCallback(() => {
    const s = stateRef.current;
    if (s.mode === "spinning" || entries.length === 0) return;
    setWinner(null);
    s.winner   = null;
    s.velocity = MIN_SPIN_VEL + rand() * EXTRA_SPIN;
    s.mode     = "spinning";
    setSpinning(true);
  }, [entries.length]);

  return { canvasRef, spin, winner, spinning };
}
