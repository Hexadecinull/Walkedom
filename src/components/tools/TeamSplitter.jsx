import { useState } from "react";
import { shuffle } from "../../utils/random";
import EntryPanel from "../ui/EntryPanel";
import ResultModal from "../modals/ResultModal";

const DEFAULT = ["Alice","Bob","Charlie","Diana","Eve","Frank","Grace","Henry","Ivan","Julia"];
const TEAM_COLORS = ["#FF3B3B","#00C853","#00B0FF","#FFD700","#AA00FF","#FF4081","#FF8C00","#1DE9B6"];

export default function TeamSplitter({ settings }) {
  const [entries,  setEntries]  = useState(DEFAULT);
  const [numTeams, setNumTeams] = useState(2);
  const [mode,     setMode]     = useState("teams"); // teams | size
  const [teamSize, setTeamSize] = useState(3);
  const [teams,    setTeams]    = useState([]);
  const [showModal,setShowModal]= useState(false);

  const split = () => {
    if (!entries.length) return;
    const pool = shuffle([...entries]);
    let result = [];
    if (mode === "teams") {
      const n = Math.max(1, numTeams);
      result = Array.from({length:n}, () => []);
      pool.forEach((e,i) => result[i%n].push(e));
    } else {
      const sz = Math.max(1, teamSize);
      for (let i=0; i<pool.length; i+=sz) result.push(pool.slice(i, i+sz));
    }
    setTeams(result.map((members,i) => ({ name:`Team ${i+1}`, members, color:TEAM_COLORS[i%TEAM_COLORS.length] })));
    setShowModal(true);
  };

  return (
    <div className="stack stack-lg">
      <EntryPanel entries={entries} onChange={setEntries} rows={10} />

      <div className="row row-md row-wrap">
        <div className="row row-sm">
          <label className="check-row">
            <input type="radio" checked={mode==="teams"} onChange={()=>setMode("teams")} style={{accentColor:"var(--text)"}} />
            Number of teams:
          </label>
          <input type="number" className="input input-sm" min={2} max={entries.length||2}
            value={numTeams} onChange={e=>setNumTeams(Math.max(2,parseInt(e.target.value)||2))} style={{width:70}} />
        </div>
        <div className="row row-sm">
          <label className="check-row">
            <input type="radio" checked={mode==="size"} onChange={()=>setMode("size")} style={{accentColor:"var(--text)"}} />
            Team size:
          </label>
          <input type="number" className="input input-sm" min={1}
            value={teamSize} onChange={e=>setTeamSize(Math.max(1,parseInt(e.target.value)||2))} style={{width:70}} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={split} style={{alignSelf:"flex-start"}} disabled={!entries.length}>
        Split into teams
      </button>

      {showModal && teams.length > 0 && (
        <ResultModal title={`${teams.length} teams`} onClose={()=>setShowModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, maxHeight:"60vh", overflowY:"auto" }}>
            {teams.map((t,i) => (
              <div key={i} className="team-card" style={{ borderLeft:`4px solid ${t.color}` }}>
                <div className="team-name" style={{ color:t.color }}>{t.name}</div>
                {t.members.map((m,j) => <div key={j} className="team-member">{m}</div>)}
              </div>
            ))}
          </div>
          <div style={{marginTop:16}}>
            <button className="btn btn-primary" onClick={()=>{setShowModal(false);split();}}>Re-split</button>
          </div>
        </ResultModal>
      )}
    </div>
  );
}
