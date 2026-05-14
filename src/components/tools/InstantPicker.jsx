import { useState } from "react";
import { pickUnique } from "../../utils/random";
import { playPickerResult } from "../../utils/sound";
import EntryPanel from "../ui/EntryPanel";

const DEFAULT = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry"];

export default function InstantPicker({ settings }) {
  const [entries, setEntries] = useState(DEFAULT);
  const [count,   setCount]   = useState(1);
  const [results, setResults] = useState([]);
  const [key,     setKey]     = useState(0);

  const pick = () => {
    if (!entries.length) return;
    const picked = pickUnique(entries, Math.min(count, entries.length));
    setResults(picked);
    setKey(k => k + 1);
    if (settings?.soundEnabled !== false) playPickerResult();
  };

  return (
    <div className="picker-layout">
      {/* Left: input */}
      <div className="stack stack-md">
        <EntryPanel entries={entries} onChange={setEntries} rows={16} />
        <div className="row row-wrap row-md">
          <label className="row row-sm" style={{ color:"var(--text-2)", fontSize:"0.82rem" }}>
            Pick
            <input type="number" className="input input-sm" min={1} max={entries.length || 1}
              value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value)||1))}
              style={{ width:70 }} />
            of {entries.length}
          </label>
          <button className="btn btn-primary" onClick={pick} disabled={!entries.length}>
            Pick now
          </button>
        </div>
      </div>

      {/* Right: results panel */}
      <div className="stack stack-sm">
        <div style={{ fontSize:"0.7rem", color:"var(--text-3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          Results {results.length > 0 ? `(${results.length})` : ""}
        </div>
        <div
          style={{
            minHeight:380, background:"var(--bg-2)", border:"1px solid var(--border)",
            borderRadius:"var(--radius-lg)", padding:"14px", display:"flex",
            flexDirection:"column", gap:8,
          }}
          key={key}
        >
          {results.length === 0 ? (
            <div style={{ color:"var(--text-3)", fontSize:"0.82rem", margin:"auto", textAlign:"center" }}>
              Results appear here
            </div>
          ) : results.map((r, i) => (
            <div key={i} className="pick-item anim-slide-in" style={{ animationDelay:`${i*55}ms` }}>
              <span className="pick-num">#{i+1}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
