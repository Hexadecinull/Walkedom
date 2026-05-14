import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import MobileNav from "./components/layout/MobileNav";
import SpinWheel from "./components/wheel/SpinWheel";
import EntryPanel from "./components/wheel/EntryPanel";
import InstantPicker from "./components/tools/InstantPicker";
import DiceRoller from "./components/tools/DiceRoller";
import CoinFlip from "./components/tools/CoinFlip";
import NumberGen from "./components/tools/NumberGen";
import { TOOLS } from "./config/tools";

const DEFAULT_ENTRIES = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

function ToolPage({ tool, entries, onEntriesChange }) {
  return (
    <div className="anim-fade-up">
      <div className="tool-header">
        <h1 className="tool-title">{tool.label}</h1>
        <p className="tool-desc">{tool.desc}</p>
      </div>

      {tool.id === "wheel" && (
        <div
          className="wheel-layout"
          style={{ display: "flex", gap: 36, alignItems: "flex-start", flexWrap: "wrap" }}
        >
          <SpinWheel entries={entries} />
          <EntryPanel entries={entries} onChange={onEntriesChange} />
        </div>
      )}

      {tool.id === "picker"  && <InstantPicker />}
      {tool.id === "dice"    && <DiceRoller />}
      {tool.id === "coin"    && <CoinFlip />}
      {tool.id === "number"  && <NumberGen />}
    </div>
  );
}

export default function App() {
  const [toolId,  setToolId]  = useState("wheel");
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);

  const activeTool = TOOLS.find((t) => t.id === toolId);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar activeTool={toolId} onSelect={setToolId} />
        <main className="app-main">
          <ToolPage
            tool={activeTool}
            entries={entries}
            onEntriesChange={setEntries}
          />
        </main>
      </div>
      <MobileNav activeTool={toolId} onSelect={setToolId} />
    </div>
  );
}
