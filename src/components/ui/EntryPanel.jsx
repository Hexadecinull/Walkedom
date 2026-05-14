import { useState, useRef } from "react";
import { shuffle } from "../../utils/random";
import { parseEntryFile } from "../../utils/storage";

const PRESETS = [
  { label:"Names",  value:"Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry" },
  { label:"Days",   value:"Monday\nTuesday\nWednesday\nThursday\nFriday\nSaturday\nSunday" },
  { label:"Months", value:"January\nFebruary\nMarch\nApril\nMay\nJune\nJuly\nAugust\nSeptember\nOctober\nNovember\nDecember" },
];

export default function EntryPanel({ entries, onChange, rows = 10, label = "Entries" }) {
  const [text, setText] = useState(entries.join("\n"));
  const fileRef = useRef(null);

  const sync = (val) => {
    setText(val);
    onChange(val.split("\n").map(s => s.trim()).filter(Boolean));
  };

  const doShuffle = () => {
    const arr = [...entries];
    shuffle(arr);
    sync(arr.join("\n"));
  };

  const doSort = () => {
    const arr = [...entries].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    sync(arr.join("\n"));
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseEntryFile(ev.target.result);
      sync(parsed.join("\n"));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="stack stack-sm" style={{ flex:1, minWidth:200 }}>
      <div className="row row-sm" style={{ justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
        <span style={{ fontSize:"0.7rem", color:"var(--text-3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
          {label} ({entries.length})
        </span>
        <div className="row row-xs">
          <button className="btn btn-ghost btn-sm" onClick={doShuffle}>⇅ Shuffle</button>
          <button className="btn btn-ghost btn-sm" onClick={doSort}>A–Z</button>
          <button className="btn btn-ghost btn-sm" onClick={() => sync("")}>Clear</button>
        </div>
      </div>

      <textarea
        className="input"
        value={text}
        onChange={e => sync(e.target.value)}
        placeholder={"One entry per line:\n\nAlice\nBob\nCharlie"}
        rows={rows}
      />

      <div className="row row-sm row-wrap" style={{ justifyContent:"space-between" }}>
        <div className="tag-row">
          {PRESETS.map(p => (
            <button key={p.label} className="tag" onClick={() => sync(p.value)}>{p.label}</button>
          ))}
        </div>
        <button className="btn btn-sm" onClick={() => fileRef.current?.click()}>📂 Load file</button>
        <input ref={fileRef} type="file" accept=".txt,.csv,.tsv,.wheel,.json" style={{ display:"none" }} onChange={onFile} />
      </div>
    </div>
  );
}
