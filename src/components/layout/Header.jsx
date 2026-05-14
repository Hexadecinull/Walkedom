export default function Header({ onSettings }) {
  return (
    <header className="header">
      <a href="/" className="header-logo">
        Walkedom<span>.</span>
      </a>
      <div className="header-right">
        <span className="header-tag">cryptographically fair</span>
        <button className="icon-btn" onClick={onSettings} title="Settings" aria-label="Settings">
          ⚙
        </button>
      </div>
    </header>
  );
}
