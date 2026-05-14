import { useState } from "react";
import { shuffle } from "../../utils/random";
import EntryPanel from "../ui/EntryPanel";

const DEFAULT = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry"];

export default function Tournament() {
  const [entries, setEntries] = useState(DEFAULT);
  const [rounds,  setRounds]  = useState([]);

  const generate = () => {
    if (entries.length < 2) return;
    // Pad to power of 2 with "BYE"
    let pool = shuffle([...entries]);
    let size = 1;
    while (size < pool.length) size *= 2;
    while (pool.length < size) pool.push("BYE");

    const allRounds = [];
    let current = pool;
    while (current.length > 1) {
      const matches = [];
      for (let i=0; i<current.length; i+=2) matches.push([current[i], current[i+1]]);
      allRounds.push(matches);
      // Auto-advance BYEs
      current = matches.map(([a,b]) => b === "BYE" ? a : a === "BYE" ? b : null);
      // null = TBD
      current = current.map(x => x ?? "TBD");
    }
    setRounds(allRounds);
    
  };

  return (
    <div className="stack stack-lg">
      <EntryPanel entries={entries} onChange={setEntries} rows={8} />
      <button className="btn btn-primary" style={{alignSelf:"flex-start"}} onClick={generate} disabled={entries.length<2}>
        Generate bracket
      </button>

      {rounds.length > 0 && (
        <div style={{ overflowX:"auto" }}>
          <div style={{ display:"flex", gap:24, alignItems:"flex-start", minWidth:"max-content" }}>
            {rounds.map((round, ri) => (
              <div key={ri} className="stack stack-sm" style={{ minWidth:160 }}>
                <div style={{ fontSize:"0.68rem", color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                  {ri === rounds.length-1 ? "Final" : ri === rounds.length-2 ? "Semi-final" : `Round ${ri+1}`}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap: ri===0 ? 8 : `${Math.pow(2,ri)*8+8}px` }}>
                  {round.map((match, mi) => (
                    <div key={mi} className="bracket-match">
                      {match.map((p, pi) => (
                        <div key={pi} className={`bracket-entry ${p==="BYE"?"":""}` }>
                          {p==="BYE" ? <span style={{color:"var(--text-3)"}}>BYE</span> :
                           p==="TBD" ? <span style={{color:"var(--text-3)"}}>TBD</span> : p}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
