import { useWheel } from "../../hooks/useWheel";

export default function SpinWheel({ entries }) {
  const { canvasRef, spin, winner, spinning } = useWheel(entries);

  return (
    <div className="stack stack-md" style={{ alignItems: "center" }}>
      <div
        className="wheel-canvas-wrap"
        style={{ width: "100%", maxWidth: 360 }}
      >
        <canvas
          ref={canvasRef}
          onClick={spin}
          aria-label="Spin wheel — click to spin"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            display: "block",
            cursor: entries.length > 0 && !spinning ? "pointer" : "default",
            borderRadius: "50%",
          }}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={spin}
        disabled={spinning || entries.length === 0}
        style={{ minWidth: 120 }}
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>

      {winner && (
        <div className="result-card anim-fade-up" style={{ width: "100%", maxWidth: 360 }}>
          <div className="result-label">Winner</div>
          <div className="result-value">{winner}</div>
        </div>
      )}
    </div>
  );
}
