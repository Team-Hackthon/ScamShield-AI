import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="about">
      <div className="footer-brand">
        🛡
        <span>
          Scam<span className="highlight">Shield</span>
        </span>
      </div>

      <div className="footer-quote">
        “Disclaimer: ScamShield provides risk guidance and does not guarantee a message is safe.”
      </div>

      <div className="footer-links">
        <Link to="/privacy">🔒 Privacy Policy</Link>
        <Link to="/terms">📄 Terms of Service</Link>
        <Link to="/team">👥 Meet the Team</Link>
      </div>
    </footer>
  );
}

export default Footer;