import { useState } from "react";
import SpinWheel from "./SpinWheel";
import EntryPanel from "../ui/EntryPanel";

const DEFAULT = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry"];
let nextId = 1;

function makeWheel(name = null) {
  return { id: nextId++, name: name ?? `Wheel ${nextId - 1}`, entries: [...DEFAULT] };
}

export default function WheelTool({ settings }) {
  const [wheels, setWheels]   = useState([makeWheel("Wheel 1")]);
  const [activeId, setActiveId] = useState(wheels[0].id);

  const active = wheels.find(w => w.id === activeId) ?? wheels[0];

  const updateEntries = (id, entries) => {
    setWheels(ws => ws.map(w => w.id === id ? { ...w, entries } : w));
  };

  const addWheel = () => {
    const w = makeWheel();
    setWheels(ws => [...ws, w]);
    setActiveId(w.id);
  };

  const removeWheel = (id) => {
    if (wheels.length === 1) return;
    const next = wheels.find(w => w.id !== id);
    setWheels(ws => ws.filter(w => w.id !== id));
    setActiveId(next.id);
  };

  const renameWheel = (id, name) => {
    setWheels(ws => ws.map(w => w.id === id ? { ...w, name } : w));
  };

  return (
    <div className="stack stack-md">
      {/* Multi-wheel tabs */}
      <div className="wheel-tabs">
        {wheels.map(w => (
          <div key={w.id} style={{ display:"flex", alignItems:"center", gap:2 }}>
            <button
              className={`wheel-tab ${activeId === w.id ? "active" : ""}`}
              onClick={() => setActiveId(w.id)}
            >
              {w.name}
            </button>
            {activeId === w.id && wheels.length > 1 && (
              <button
                className="btn btn-ghost btn-sm btn-icon"
                style={{ fontSize:12, width:20, height:20, borderRadius:4 }}
                onClick={() => removeWheel(w.id)}
                title="Remove wheel"
              >✕</button>
            )}
          </div>
        ))}
        <button className="wheel-tab-add" onClick={addWheel} title="Add wheel">+ Add wheel</button>
      </div>

      {/* Rename */}
      <div className="row row-sm" style={{ alignItems:"center" }}>
        <span style={{ fontSize:"0.72rem", color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Name:</span>
        <input
          className="input"
          style={{ maxWidth:200 }}
          value={active.name}
          onChange={e => renameWheel(active.id, e.target.value)}
        />
      </div>

      {/* Wheel + entries */}
      <div style={{ display:"flex", gap:36, flexWrap:"wrap", alignItems:"flex-start" }}>
        <SpinWheel entries={active.entries} settings={settings} />
        <EntryPanel
          entries={active.entries}
          onChange={entries => updateEntries(active.id, entries)}
          rows={14}
        />
      </div>
    </div>
  );
}
