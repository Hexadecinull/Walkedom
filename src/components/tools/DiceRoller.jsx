import { useState } from "react";
import { randInt } from "../../utils/random";

const PRESETS = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRoller() {
  const [sides,   setSides]   = useState(6);
  const [qty,     setQty]     = useState(1);
  const [rolls,   setRolls]   = useState([]);
  const [rolling, setRolling] = useState(false);
  const [key,     setKey]     = useState(0);

  const roll = () => {
    setRolling(true);
    setRolls([]);
    setTimeout(() => {
      const r = Array.from({ length: qty }, () => randInt(1, sides));
      setRolls(r);
      setKey((k) => k + 1);
      setRolling(false);
    }, 220);
  };

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="stack stack-lg">
      {/* Sides preset */}
      <div className="stack stack-sm">
        <div style={{ fontSize: "0.72rem", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Dice type
        </div>
        <div className="row row-wrap row-sm">
          {PRESETS.map((p) => (
            <button
              key={p}
              className={`tag ${sides === p ? "active" : ""}`}
              onClick={() => setSides(p)}
            >
              d{p}
            </button>
          ))}
          <input
            type="number"
            className="input"
            min={2}
            value={sides}
            onChange={(e) => setSides(Math.max(2, parseInt(e.target.value) || 6))}
            placeholder="Custom"
            style={{ width: 80 }}
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="row row-md row-wrap">
        <label className="row row-sm" style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
          Quantity
          <input
            type="number"
            className="input input-sm"
            min={1}
            max={100}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            style={{ width: 60 }}
          />
        </label>
        <span style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>{qty}d{sides}</span>
        <button className="btn btn-primary" onClick={roll} disabled={rolling}>
          {rolling ? "Rolling…" : "Roll"}
        </button>
      </div>

      {/* Results */}
      {rolls.length > 0 && (
        <div className="stack stack-md" key={key}>
          <div className="row row-wrap row-sm">
            {rolls.map((r, i) => (
              <div
                key={i}
                className="die anim-pop"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {r}
              </div>
            ))}
          </div>

          {rolls.length > 1 && (
            <div style={{ fontSize: "0.82rem", color: "var(--text-2)" }}>
              Total{" "}
              <strong style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
                {total}
              </strong>
              {"  "}·{"  "}
              Avg {(total / rolls.length).toFixed(1)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
