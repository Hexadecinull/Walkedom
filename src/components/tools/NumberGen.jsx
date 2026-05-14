import { useState } from "react";
import { pickUnique, pickWithReplacement, randInt, shuffle } from "../../utils/random";
import { playNumberPop } from "../../utils/sound";
import ResultModal from "../modals/ResultModal";

export default function NumberGen({ settings }) {
  const [min,      setMin]      = useState(1);
  const [max,      setMax]      = useState(100);
  const [qty,      setQty]      = useState(1);
  const [unique,   setUnique]   = useState(true);
  const [sorted,   setSorted]   = useState(false);
  const [sep,      setSep]      = useState("list");  // list | comma | space
  const [results,  setResults]  = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [key,      setKey]      = useState(0);

  const generate = () => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const range = hi - lo + 1;
    let nums;
    if (unique) {
      const pool = Array.from({length:range},(_,i)=>lo+i);
      nums = pickUnique(pool, Math.min(qty, range));
    } else {
      nums = Array.from({length:qty}, () => randInt(lo, hi));
    }
    if (sorted) nums.sort((a,b)=>a-b);
    setResults(nums);
    setKey(k=>k+1);
    setShowModal(true);
    if (settings?.soundEnabled !== false) playNumberPop();
  };

  const resultText = sep === "comma"
    ? results.join(", ")
    : sep === "space"
    ? results.join(" ")
    : results.join("\n");

  const copy = () => navigator.clipboard?.writeText(resultText);

  return (
    <div className="stack stack-lg">
      <div className="numgen-grid">
        {[
          { label:"Min",   val:min,  set:setMin,  type:"number" },
          { label:"Max",   val:max,  set:setMax,  type:"number" },
          { label:"Count", val:qty,  set:v=>setQty(Math.max(1,v)), type:"number" },
        ].map(({label,val,set,type}) => (
          <div key={label} className="numgen-field">
            <label>{label}</label>
            <input type={type} className="input" value={val}
              onChange={e=>set(parseInt(e.target.value)||0)} />
          </div>
        ))}

        <div className="numgen-field">
          <label>Separator</label>
          <select className="input" value={sep} onChange={e=>setSep(e.target.value)}>
            <option value="list">List (one per line)</option>
            <option value="comma">Comma-separated</option>
            <option value="space">Space-separated</option>
          </select>
        </div>
      </div>

      <div className="row row-md row-wrap">
        <label className="check-row">
          <input type="checkbox" checked={unique} onChange={e=>setUnique(e.target.checked)}/>
          Unique (no repeats)
        </label>
        <label className="check-row">
          <input type="checkbox" checked={sorted} onChange={e=>setSorted(e.target.checked)}/>
          Sort ascending
        </label>
      </div>

      <div className="row row-sm">
        <button className="btn btn-primary" onClick={generate}
          disabled={max < min && unique && (max-min+1) < qty}>
          Generate
        </button>
        {results.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(true)}>
            Show last results
          </button>
        )}
      </div>

      {showModal && results.length > 0 && (
        <ResultModal title={`${results.length} number${results.length!==1?"s":""} generated`} onClose={()=>setShowModal(false)}>
          <div className="stack stack-md">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }} key={key}>
              {results.map((r,i) => (
                <div key={i} className="die anim-pop" style={{ animationDelay:`${i*25}ms`, width:"auto", height:"auto", padding:"8px 14px", fontSize:"1.2rem", fontFamily:"var(--font-display)" }}>
                  {r}
                </div>
              ))}
            </div>
            {results.length > 1 && (
              <div style={{ fontSize:"0.82rem", color:"var(--text-2)" }}>
                Sum <strong style={{color:"var(--text)"}}>{results.reduce((a,b)=>a+b,0)}</strong>
                {"  ·  "}
                Avg <strong>{(results.reduce((a,b)=>a+b,0)/results.length).toFixed(2)}</strong>
                {"  ·  "}
                Min <strong>{Math.min(...results)}</strong>
                {"  ·  "}
                Max <strong>{Math.max(...results)}</strong>
              </div>
            )}
            <div className="row row-sm">
              <button className="btn btn-sm" onClick={copy}>Copy</button>
              <button className="btn btn-primary btn-sm" onClick={()=>{setShowModal(false);generate();}}>Regenerate</button>
            </div>
          </div>
        </ResultModal>
      )}
    </div>
  );
}
