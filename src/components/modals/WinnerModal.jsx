import { useEffect } from "react";

export default function WinnerModal({ winner, toolColor = "var(--text)", onClose, onSpin }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!winner) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign:"center", maxWidth:400 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:6 }}>
          Winner
        </div>
        <div className="modal-winner-name" style={{ color: toolColor }}>{winner}</div>
        <div className="row row-sm" style={{ justifyContent:"center", flexWrap:"wrap" }}>
          {onSpin && (
            <button className="btn btn-primary" onClick={() => { onClose(); setTimeout(onSpin, 80); }}>
              Spin again
            </button>
          )}
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
