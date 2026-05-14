import { useState } from "react";
import { rand } from "../../utils/random";
import { playHeads, playTails } from "../../utils/sound";
import ResultModal from "../modals/ResultModal";

export default function CoinFlip({ settings }) {
  const [result,   setResult]   = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [streak,   setStreak]   = useState({ heads:0, tails:0, total:0 });
  const [showModal, setShowModal] = useState(false);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = rand() < 0.5 ? "Heads" : "Tails";
      setResult(r);
      setStreak(s => ({ heads: s.heads+(r==="Heads"?1:0), tails: s.tails+(r==="Tails"?1:0), total:s.total+1 }));
      if (settings?.soundEnabled !== false) {
        r === "Heads" ? playHeads() : playTails();
      }
      setFlipping(false);
      setShowModal(true);
    }, 500);
  };

  return (
    <div className="stack stack-lg" style={{ alignItems:"flex-start" }}>
      <div className="row row-md" style={{ flexWrap:"wrap" }}>
        <div
          className="coin"
          onClick={flip}
          role="button" tabIndex={0}
          onKeyDown={e => e.key==="Enter" && flip()}
          style={{
            borderColor: result==="Heads" ? "var(--c-wheel)" : result==="Tails" ? "var(--c-coin)" : undefined,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: flipping ? "1.5rem" : "2.4rem",
            letterSpacing: "-0.02em",
          }}
        >
          {flipping ? "·" : result?.[0] ?? "?"}
        </div>

        <div className="stack stack-sm">
          <button className="btn btn-primary" onClick={flip} disabled={flipping}>
            {flipping ? "Flipping…" : "Flip"}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setStreak({heads:0,tails:0,total:0})}>
            Reset streak
          </button>
        </div>
      </div>

      {/* Streak stats */}
      {streak.total > 0 && (
        <div className="row row-md">
          {[["Heads", streak.heads, "var(--c-wheel)"],["Tails", streak.tails, "var(--c-coin)"]].map(([side,cnt,col]) => (
            <div key={side} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:700, color:col }}>{cnt}</div>
              <div style={{ fontSize:"0.7rem", color:"var(--text-3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{side}</div>
              {streak.total > 0 && <div style={{ fontSize:"0.7rem", color:"var(--text-3)" }}>{Math.round(cnt/streak.total*100)}%</div>}
            </div>
          ))}
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:700 }}>{streak.total}</div>
            <div style={{ fontSize:"0.7rem", color:"var(--text-3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Total</div>
          </div>
        </div>
      )}

      {showModal && result && (
        <ResultModal title="Result" onClose={() => setShowModal(false)}>
          <div style={{ textAlign:"center", padding:"8px 0 16px" }}>
            <div className="modal-winner-name" style={{ color: result==="Heads"?"var(--c-wheel)":"var(--c-coin)" }}>
              {result}
            </div>
            <button className="btn btn-primary" onClick={() => { setShowModal(false); setTimeout(flip,80); }}>
              Flip again
            </button>
          </div>
        </ResultModal>
      )}
    </div>
  );
}
