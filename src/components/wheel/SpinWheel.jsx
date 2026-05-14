import { useWheel } from "../../hooks/useWheel";
import WinnerModal from "../modals/WinnerModal";

export default function SpinWheel({ entries, settings, onWinner }) {
  const { canvasRef, spin, winner, spinning, resetWinner } = useWheel(entries, settings);

  const handleWin = (w) => {
    onWinner?.(w);
  };

  return (
    <div className="stack stack-md" style={{ alignItems:"center", width:"100%" }}>
      <div style={{ width:"100%", maxWidth:520, position:"relative" }}>
        <canvas
          ref={canvasRef}
          onClick={spin}
          aria-label="Spin wheel — click to spin"
          style={{
            width:"100%", aspectRatio:"1/1", display:"block",
            cursor: entries.length > 0 && !spinning ? "pointer" : "default",
            borderRadius:"50%",
          }}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={spin}
        disabled={spinning || entries.length === 0}
        style={{ minWidth:140, fontSize:"0.95rem", padding:"11px 28px" }}
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>

      {winner && (
        <WinnerModal
          winner={winner}
          toolColor="var(--c-wheel)"
          onClose={resetWinner}
          onSpin={spin}
        />
      )}
    </div>
  );
}
