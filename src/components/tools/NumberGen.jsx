import { useState } from "react";
import { pickUnique, pickWithReplacement } from "../../utils/random";

export default function NumberGen() {
  const [min,     setMin]     = useState(1);
  const [max,     setMax]     = useState(100);
  const [qty,     setQty]     = useState(1);
  const [unique,  setUnique]  = useState(true);
  const [results, setResults] = useState([]);
  const [key,     setKey]     = useState(0);

  const generate = () => {
    const lo   = Math.min(min, max);
    const hi   = Math.max(min, max);
    const range = hi - lo + 1;

    let nums;
    if (unique) {
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      nums = pickUnique(pool, Math.min(qty, range));
    } else {
      nums = pickWithReplacement(
        Array.from({ length: range }, (_, i) => lo + i),
        qty
      );
    }
    setResults(nums);
    setKey((k) => k + 1);
  };

  return (
    <div className="stack stack-lg">
      <div className="row row-wrap row-md">
        {[
          { label: "Min", val: min, set: setMin },
          { label: "Max", val: max, set: setMax },
          { label: "Count", val: qty, set: (v) => setQty(Math.max(1, v)) },
        ].map(({ label, val, set }) => (
          <label
            key={label}
            className="row row-sm"
            style={{ color: "var(--text-2)", fontSize: "0.82rem" }}
          >
            {label}
            <input
              type="number"
              className="input input-sm"
              value={val}
              onChange={(e) => set(parseInt(e.target.value) || 0)}
              style={{ width: 80 }}
            />
          </label>
        ))}

        <label className="check-row">
          <input
            type="checkbox"
            checked={unique}
            onChange={(e) => setUnique(e.target.checked)}
          />
          Unique
        </label>
      </div>

      <button className="btn btn-primary" onClick={generate} style={{ alignSelf: "flex-start" }}>
        Generate
      </button>

      {results.length > 0 && (
        <div className="row row-wrap row-sm" key={key}>
          {results.map((r, i) => (
            <div
              key={i}
              className="die anim-pop"
              style={{
                width: "auto",
                height: "auto",
                padding: "8px 14px",
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                animationDelay: `${i * 30}ms`,
                minWidth: 52,
              }}
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
