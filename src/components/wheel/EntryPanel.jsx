import { useState, useEffect } from "react";

const PRESETS = [
  { label: "Sample names", value: "Alice\nBob\nCharlie\nDiana\nEve\nFrank" },
  { label: "Days", value: "Monday\nTuesday\nWednesday\nThursday\nFriday" },
  { label: "Months", value: "Jan\nFeb\nMar\nApr\nMay\nJun\nJul\nAug\nSep\nOct\nNov\nDec" },
];

export default function EntryPanel({ entries, onChange }) {
  const [text, setText] = useState(entries.join("\n"));

  // sync upward
  const handleChange = (val) => {
    setText(val);
    const parsed = val
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(parsed);
  };

  // sync if entries changed externally (e.g. preset from outside)
  useEffect(() => {
    const external = entries.join("\n");
    if (external !== text.split("\n").map((s) => s.trim()).filter(Boolean).join("\n")) {
      setText(external);
    }
    // intentionally not exhaustive — only sync on external change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  return (
    <div className="stack stack-sm" style={{ flex: 1, minWidth: 200 }}>
      <div className="row row-sm" style={{ justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Entries ({entries.length})
        </span>
        <button
          className="btn-ghost btn btn-sm"
          onClick={() => handleChange("")}
        >
          Clear
        </button>
      </div>

      <textarea
        className="input"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={"One entry per line:\n\nAlice\nBob\nCharlie"}
        rows={10}
        style={{ minHeight: 200 }}
      />

      <div className="tag-row">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="tag"
            onClick={() => handleChange(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
