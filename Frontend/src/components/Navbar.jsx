function Navbar() {
  return (
    <nav className="navbar">

      <div className="brand">
        <div className="brand-icon">🛡</div>

        <span>
          Scam<span className="highlight">Shield</span>
        </span>
      </div>

      <div className="nav-links">
        <a href="#home" className="active">
          Home
        </a>

        <a href="#how-it-works">
          How It Works
        </a>

        <a href="#about">
          About
        </a>
      </div>

      <div className="protected-badge">
        🛡 Protected
      </div>

    </nav>
  );
}

export default Navbar;