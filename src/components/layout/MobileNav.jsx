import { TOOLS } from "../../config/tools";

export default function MobileNav({ activeTool, onSelect }) {
  return (
    <nav className="mobile-nav" aria-label="Tool navigation">
      <div className="mobile-nav-inner">
        {TOOLS.map(t => (
          <button key={t.id} className={`mobile-nav-item ${activeTool===t.id?"active":""}`}
            onClick={() => onSelect(t.id)} aria-current={activeTool===t.id?"page":undefined}>
            <span className="mobile-nav-dot" style={{ background: t.color }} />
            <span>{t.shortLabel}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
