import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import MobileNav from "./components/layout/MobileNav";
import WheelTool from "./components/wheel/WheelTool";
import InstantPicker from "./components/tools/InstantPicker";
import DiceRoller from "./components/tools/DiceRoller";
import CoinFlip from "./components/tools/CoinFlip";
import NumberGen from "./components/tools/NumberGen";
import TeamSplitter from "./components/tools/TeamSplitter";
import PasswordGen from "./components/tools/PasswordGen";
import Tournament from "./components/tools/Tournament";
import SettingsModal from "./components/modals/SettingsModal";
import { TOOLS } from "./config/tools";
import { useSettings } from "./hooks/useSettings";

function ToolPage({ toolId, settings }) {
  const tool = TOOLS.find(t => t.id === toolId);
  return (
    <div className="anim-fade-up" key={toolId}>
      <div className="tool-header">
        <h1 className="tool-title">{tool?.label}</h1>
        <p className="tool-desc">{tool?.desc}</p>
      </div>
      {toolId === "wheel"    && <WheelTool settings={settings} />}
      {toolId === "picker"   && <InstantPicker settings={settings} />}
      {toolId === "dice"     && <DiceRoller settings={settings} />}
      {toolId === "coin"     && <CoinFlip settings={settings} />}
      {toolId === "number"   && <NumberGen settings={settings} />}
      {toolId === "team"     && <TeamSplitter settings={settings} />}
      {toolId === "password" && <PasswordGen />}
      {toolId === "bracket"  && <Tournament />}
    </div>
  );
}

export default function App() {
  const [toolId, setToolId] = useState("wheel");
  const [showSettings, setShowSettings] = useState(false);
  const { settings, update } = useSettings();

  return (
    <div className="app-shell">
      <Header onSettings={() => setShowSettings(true)} />
      <div className="app-body">
        <Sidebar activeTool={toolId} onSelect={setToolId} />
        <main className="app-main">
          <ToolPage toolId={toolId} settings={settings} />
        </main>
      </div>
      <MobileNav activeTool={toolId} onSelect={setToolId} />

      {showSettings && (
        <SettingsModal settings={settings} update={update} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
