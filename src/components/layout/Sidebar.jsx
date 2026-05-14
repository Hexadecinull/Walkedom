import { TOOLS } from "../../config/tools";

export default function Sidebar({ activeTool, onSelect }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Tools</div>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`nav-item ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onSelect(tool.id)}
          >
            <span
              className="nav-dot"
              style={{ background: tool.color }}
            />
            {tool.label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div>GPL-3.0 License</div>
        <a
          href="https://github.com/Hexadecinull/Walkedom"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </div>
    </nav>
  );
}
