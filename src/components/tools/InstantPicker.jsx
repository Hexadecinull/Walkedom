import { useState } from "react";
import { pickUnique } from "../../utils/random";

export default function InstantPicker() {
  const [text, setText]     = useState("");
  const [count, setCount]   = useState(1);
  const [results, setResults] = useState([]);
  const [key, setKey]       = useState(0); // force re-animation

  const items = text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pick = () => {
    if (items.length === 0) return;
    setResults([]);
    // tiny delay so animation re-triggers
    requestAnimationFrame(() => {
      setResults(pickUnique(items, Math.min(count, items.length)));
      setKey((k) => k + 1);
    });
  };

  return (
    <div className="stack stack-lg">
      <textarea
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Alice\nBob\nCharlie\n\nor comma-separated: Alice, Bob, Charlie"}
        rows={8}
      />

      <div className="row row-wrap row-md">
        <label className="row row-sm" style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
          Pick
          <input
            type="number"
            className="input input-sm"
            min={1}
            max={items.length || 1}
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 60 }}
          />
          from {items.length} entries
        </label>

        <button
          className="btn btn-primary"
          onClick={pick}
          disabled={items.length === 0}
        >
          Pick now
        </button>
      </div>

      {results.length > 0 && (
        <div className="stack stack-sm" key={key}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Selected
          </div>
          {results.map((r, i) => (
            <div
              key={i}
              className="pick-item anim-slide-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="pick-num">#{i + 1}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
