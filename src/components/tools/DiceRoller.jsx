import { useState, useEffect, useRef } from "react";
import { randInt } from "../../utils/random";
import { playDiceRoll } from "../../utils/sound";

const PRESETS = [4,6,8,10,12,20,100];

// SVG dice faces for d6 (dots)
const DOT_POSITIONS = {
  1: [[50,50]],
  2: [[25,25],[75,75]],
  3: [[25,25],[50,50],[75,75]],
  4: [[25,25],[75,25],[25,75],[75,75]],
  5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
  6: [[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]],
};

function D6Face({ value, size=90, color="var(--bg-3)", rolling=false }) {
  const dots = DOT_POSITIONS[Math.min(6,Math.max(1,value))] ?? DOT_POSITIONS[1];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      style={{ display:"block", borderRadius:16, transition:"transform 0.18s",
        filter: rolling ? "blur(1px)" : "none",
        transform: rolling ? `rotate(${Math.random()*30-15}deg)` : "none" }}>
      <rect x="2" y="2" width="96" height="96" rx="16" ry="16"
        fill={color} stroke="var(--border-2)" strokeWidth="2"/>
      {dots.map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="var(--text)"/>
      ))}
    </svg>
  );
}

function AnimatedDie({ finalValue, sides, rolling, delay=0 }) {
  const [display, setDisplay] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (rolling) {
      let count = 0;
      const interval = setInterval(() => {
        setDisplay(randInt(1, Math.min(sides, 6)));
        count++;
        if (count > 20) clearInterval(interval);
      }, 60);
      timerRef.current = interval;
      return () => clearInterval(interval);
    } else {
      clearInterval(timerRef.current);
      setTimeout(() => setDisplay(Math.min(finalValue, 6)), delay);
    }
  }, [rolling, finalValue, sides, delay]);

  const isD6 = sides === 6;

  if (isD6) {
    return <D6Face value={display} size={80} rolling={rolling} />;
  }
  // For non-d6, show a polygon shape
  return (
    <div className="die anim-pop" style={{ width:80, height:80, fontSize:"1.6rem", animationDelay:`${delay}ms`,
      background:"var(--bg-3)", border:"2px solid var(--border-2)", borderRadius:"var(--radius)" }}>
      {rolling ? randInt(1,sides) : finalValue}
    </div>
  );
}

export default function DiceRoller({ settings }) {
  const [sides,   setSides]   = useState(6);
  const [qty,     setQty]     = useState(1);
  const [rolls,   setRolls]   = useState([]);
  const [rolling, setRolling] = useState(false);
  const [key,     setKey]     = useState(0);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    if (settings?.soundEnabled !== false) playDiceRoll();
    setTimeout(() => {
      const r = Array.from({ length: qty }, () => randInt(1, sides));
      setRolls(r);
      setKey(k => k+1);
      setRolling(false);
    }, 800);
  };

  const total = rolls.reduce((a,b) => a+b, 0);

  return (
    <div className="stack stack-lg">
      <div className="stack stack-sm">
        <div style={{ fontSize:"0.72rem", color:"var(--text-3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Dice type</div>
        <div className="row row-wrap row-sm">
          {PRESETS.map(p => (
            <button key={p} className={`tag ${sides===p?"active":""}`} onClick={() => setSides(p)}>d{p}</button>
          ))}
          <input type="number" className="input" style={{ width:90 }} min={2} value={sides}
            onChange={e => setSides(Math.max(2, parseInt(e.target.value)||6))} placeholder="Custom" />
        </div>
      </div>

      <div className="row row-md row-wrap">
        <label className="row row-sm" style={{ color:"var(--text-2)", fontSize:"0.82rem" }}>
          Qty
          <input type="number" className="input input-sm" style={{ width:70 }} min={1} max={20}
            value={qty} onChange={e => setQty(Math.max(1, Math.min(20, parseInt(e.target.value)||1)))} />
        </label>
        <span style={{ color:"var(--text-3)", fontSize:"0.8rem" }}>{qty}d{sides}</span>
        <button className="btn btn-primary" onClick={roll} disabled={rolling}>
          {rolling ? "Rolling…" : "Roll"}
        </button>
      </div>

      {/* Animated dice */}
      <div key={key} className="row row-wrap row-sm" style={{ gap:14, minHeight:90 }}>
        {(rolling ? Array.from({length:qty},(_,i)=>i) : rolls).map((r, i) => (
          <AnimatedDie
            key={i}
            finalValue={rolling ? 1 : r}
            sides={sides}
            rolling={rolling}
            delay={i * 60}
          />
        ))}
      </div>

      {!rolling && rolls.length > 0 && (
        <div style={{ fontSize:"0.85rem", color:"var(--text-2)" }}>
          {rolls.length > 1 && <>
            Total <strong style={{ color:"var(--text)", fontFamily:"var(--font-display)", fontSize:"1.3rem" }}>{total}</strong>
            {"  ·  "}
            Avg <strong style={{ color:"var(--text)" }}>{(total/rolls.length).toFixed(1)}</strong>
            {"  ·  "}
            Min <strong>{Math.min(...rolls)}</strong>
            {"  ·  "}
            Max <strong>{Math.max(...rolls)}</strong>
          </>}
        </div>
      )}
    </div>
  );
}
