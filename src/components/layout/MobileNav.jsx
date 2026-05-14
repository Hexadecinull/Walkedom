import { TOOLS } from "../../config/tools";

export default function MobileNav({ activeTool, onSelect }) {
  return (
    <nav className="mobile-nav" aria-label="Tool navigation">
      <div className="mobile-nav-inner">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className={`mobile-nav-item ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onSelect(tool.id)}
            aria-current={activeTool === tool.id ? "page" : undefined}
          >
            <span
              className="mobile-nav-dot"
              style={{ background: tool.color }}
            />
            <span>{tool.shortLabel ?? tool.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
