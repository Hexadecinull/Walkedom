import { TOOLS } from "../../config/tools";

export default function Sidebar({ activeTool, onSelect }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Tools</div>
        {TOOLS.map(t => (
          <button key={t.id} className={`nav-item ${activeTool===t.id?"active":""}`} onClick={() => onSelect(t.id)}>
            <span className="nav-dot" style={{ background: t.color }} />
            {t.label}
          </button>
        ))}
      </div>
      <div className="sidebar-footer">
        <div>Walkedom v0.2.0</div>
        <div>GPL-3.0 License</div>
        <a href="https://github.com/Hexadecinull/Walkedom" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </div>
    </nav>
  );
}
