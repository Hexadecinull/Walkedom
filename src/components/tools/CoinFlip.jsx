import { useState } from "react";
import { rand } from "../../utils/random";

export default function CoinFlip() {
  const [result,   setResult]   = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [streak,   setStreak]   = useState({ heads: 0, tails: 0 });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = rand() < 0.5 ? "Heads" : "Tails";
      setResult(r);
      setStreak((s) => ({ ...s, [r.toLowerCase()]: s[r.toLowerCase()] + 1 }));
      setFlipping(false);
    }, 420);
  };

  return (
    <div className="stack stack-lg" style={{ alignItems: "flex-start" }}>
      <div className="row row-md" style={{ alignItems: "center" }}>
        <div
          className="coin"
          onClick={flip}
          role="button"
          aria-label="Flip coin"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && flip()}
          style={{
            borderColor: result === "Heads" ? "#c8b89a" : result === "Tails" ? "#8fadb8" : undefined,
            fontSize: flipping ? "1.8rem" : "2.5rem",
            transition: "all 0.2s",
          }}
        >
          {flipping ? "·" : result === "Heads" ? "H" : result === "Tails" ? "T" : "?"}
        </div>

        <div className="stack stack-sm">
          <button className="btn btn-primary" onClick={flip} disabled={flipping}>
            {flipping ? "Flipping…" : "Flip"}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setStreak({ heads: 0, tails: 0 })}
          >
            Reset streak
          </button>
        </div>
      </div>

      {result && (
        <div className="result-card anim-fade-up">
          <div className="result-label">Result</div>
          <div
            className="result-value"
            style={{ color: result === "Heads" ? "var(--c-wheel)" : "var(--c-coin)" }}
          >
            {result}
          </div>
        </div>
      )}

      <div className="row row-md">
        {["Heads", "Tails"].map((side) => (
          <div key={side} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 700,
                color: side === "Heads" ? "var(--c-wheel)" : "var(--c-coin)",
              }}
            >
              {streak[side.toLowerCase()]}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {side}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
