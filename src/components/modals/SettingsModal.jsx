import { useEffect } from "react";

const SCHEMES = [
  { id:"light",  label:"Light",  icon:"☀️" },
  { id:"system", label:"System", icon:"○" },
  { id:"dark",   label:"Dark",   icon:"◗" },
];

export default function SettingsModal({ settings, update, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:400 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Settings</div>

        <div className="settings-group">
          <span className="settings-group-label">Color scheme</span>
          <div className="scheme-options">
            {SCHEMES.map(s => (
              <button
                key={s.id}
                className={`scheme-btn ${settings.scheme === s.id ? "active" : ""}`}
                onClick={() => update("scheme", s.id)}
              >
                <span className="scheme-icon" style={{ fontStyle: s.id === "system" ? "normal" : undefined }}>
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <span className="settings-group-label">Sound</span>
          <label className="check-row">
            <input type="checkbox" checked={settings.soundEnabled ?? true}
              onChange={e => update("soundEnabled", e.target.checked)} />
            Enable sounds
          </label>
        </div>

        <div className="settings-group">
          <span className="settings-group-label">Wheel</span>
          <label className="check-row">
            <input type="checkbox" checked={settings.showClickHint ?? true}
              onChange={e => update("showClickHint", e.target.checked)} />
            Show "Click to spin" hint on wheel
          </label>
        </div>
      </div>
    </div>
  );
}
