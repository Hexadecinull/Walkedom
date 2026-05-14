import { useState } from "react";
import { randInt, shuffle } from "../../utils/random";

const CHARS = {
  upper:  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower:  "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols:"!@#$%^&*()-_=+[]{}|;:,.<>?",
};

const WORDS = ["apple","bridge","castle","dragon","eagle","forest","garden","harbor","island","jungle",
  "knight","lantern","marble","nectar","ocean","palace","quartz","river","silver","tower",
  "umbrella","valley","winter","yellow","zenith","anchor","beacon","cipher","delta","ember"];

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 12) s++;
  if (pw.length >= 20) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
const STRENGTH_LABEL = ["Weak","Fair","Good","Strong","Very Strong"];
const STRENGTH_COLOR = ["#FF3B3B","#FF8C00","#FFD700","#00C853","#1DE9B6"];

export default function PasswordGen() {
  const [mode,     setMode]    = useState("password"); // password | passphrase
  const [length,   setLength]  = useState(20);
  const [opts,     setOpts]    = useState({upper:true,lower:true,digits:true,symbols:true});
  const [exclude,  setExclude] = useState("");
  const [wordCount,setWordCount]= useState(4);
  const [separator,setSeparator]= useState("-");
  const [passwords,setPasswords]= useState([]);
  const [count,    setCount]   = useState(5);

  const toggleOpt = (k) => setOpts(o => ({...o,[k]:!o[k]}));

  const generate = () => {
    const results = [];
    for (let p=0; p<count; p++) {
      if (mode === "passphrase") {
        const ws = [];
        const pool = [...WORDS];
        for (let i=0; i<wordCount; i++) {
          const idx = randInt(0, pool.length-1);
          ws.push(pool.splice(idx,1)[0]);
        }
        results.push(ws.join(separator));
      } else {
        let charset = "";
        if (opts.upper)   charset += CHARS.upper;
        if (opts.lower)   charset += CHARS.lower;
        if (opts.digits)  charset += CHARS.digits;
        if (opts.symbols) charset += CHARS.symbols;
        if (exclude) charset = charset.split("").filter(c => !exclude.includes(c)).join("");
        if (!charset) charset = CHARS.lower;

        // Guarantee at least one of each enabled type
        const required = [];
        if (opts.upper   && CHARS.upper.split("").some(c=>charset.includes(c)))   required.push(charset[randInt(0,charset.length-1)]);
        if (opts.lower   && CHARS.lower.split("").some(c=>charset.includes(c)))   required.push(charset[randInt(0,charset.length-1)]);
        if (opts.digits  && CHARS.digits.split("").some(c=>charset.includes(c)))  required.push(charset[randInt(0,charset.length-1)]);
        if (opts.symbols && CHARS.symbols.split("").some(c=>charset.includes(c))) required.push(charset[randInt(0,charset.length-1)]);

        const rest = Array.from({length: Math.max(0, length-required.length)}, () => charset[randInt(0,charset.length-1)]);
        results.push(shuffle([...required,...rest]).join(""));
      }
    }
    setPasswords(results);
  };

  const copy = (pw) => navigator.clipboard?.writeText(pw);

  return (
    <div className="stack stack-lg" style={{ maxWidth:640 }}>
      <div className="row row-sm">
        {["password","passphrase"].map(m => (
          <button key={m} className={`tag ${mode===m?"active":""}`} onClick={()=>setMode(m)}>
            {m==="password"?"Password":"Passphrase"}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <div className="stack stack-md">
          <div className="numgen-field">
            <label>Length: {length}</label>
            <input type="range" min={8} max={64} value={length} onChange={e=>setLength(+e.target.value)}
              style={{ width:"100%", accentColor:"var(--text)" }} />
          </div>
          <div className="row row-wrap row-md">
            {Object.keys(opts).map(k => (
              <label key={k} className="check-row">
                <input type="checkbox" checked={opts[k]} onChange={()=>toggleOpt(k)} />
                {k.charAt(0).toUpperCase()+k.slice(1)}
              </label>
            ))}
          </div>
          <div className="numgen-field">
            <label>Exclude characters</label>
            <input className="input" value={exclude} onChange={e=>setExclude(e.target.value)} placeholder="e.g. 0O1lI" style={{maxWidth:200}} />
          </div>
        </div>
      ) : (
        <div className="row row-md row-wrap">
          <label className="row row-sm" style={{color:"var(--text-2)",fontSize:"0.82rem"}}>
            Words
            <input type="number" className="input input-sm" min={2} max={8} value={wordCount} onChange={e=>setWordCount(Math.max(2,+e.target.value))} style={{width:70}} />
          </label>
          <label className="row row-sm" style={{color:"var(--text-2)",fontSize:"0.82rem"}}>
            Separator
            <input className="input" value={separator} onChange={e=>setSeparator(e.target.value)} style={{width:60}} />
          </label>
        </div>
      )}

      <div className="row row-sm row-wrap">
        <label className="row row-sm" style={{color:"var(--text-2)",fontSize:"0.82rem"}}>
          Generate
          <input type="number" className="input input-sm" min={1} max={20} value={count} onChange={e=>setCount(Math.max(1,+e.target.value))} style={{width:60}} />
        </label>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      {passwords.length > 0 && (
        <div className="stack stack-sm">
          {passwords.map((pw,i) => {
            const s = strengthScore(pw);
            return (
              <div key={i} className="stack stack-xs" style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--radius)", padding:"12px 14px" }}>
                <div className="pw-output" style={{fontSize: pw.length > 30 ? "0.8rem":"1rem"}}>{pw}</div>
                <div className="row row-sm" style={{justifyContent:"space-between", flexWrap:"wrap"}}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.72rem", color:STRENGTH_COLOR[s] }}>
                    <div className="strength-bar" style={{width:80}}>
                      <div className="strength-fill" style={{ width:`${(s+1)*20}%`, background:STRENGTH_COLOR[s] }} />
                    </div>
                    {STRENGTH_LABEL[s]}
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => copy(pw)}>Copy</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
