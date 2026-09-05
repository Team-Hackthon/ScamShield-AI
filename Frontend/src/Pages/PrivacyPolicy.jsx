import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <div className="legal-badge">
          🔒 PRIVACY & SECURITY
        </div>

        <h1>Privacy Policy</h1>

        <p className="legal-intro">
          Your privacy matters to us. ScamShield is designed to analyze
          suspicious messages while minimizing the collection of personal
          information.
        </p>

        <div className="legal-card">
          <h2>1. Information We Process</h2>
          <p>
            ScamShield processes the message you submit in order to analyze
            potential scam, phishing, fraud, or social engineering indicators.
          </p>
        </div>

        <div className="legal-card">
          <h2>2. How Your Message Is Used</h2>
          <p>
            Submitted messages are used only for generating a risk assessment,
            identifying suspicious patterns, and providing safety guidance.
          </p>
        </div>

        <div className="legal-card">
          <h2>3. Sensitive Information</h2>
          <p>
            You should never intentionally submit passwords, OTPs, UPI PINs,
            banking credentials, card details, or other highly sensitive
            personal information.
          </p>
        </div>

        <div className="legal-card">
          <h2>4. AI-Based Analysis</h2>
          <p>
            ScamShield may use automated and AI-based systems to evaluate
            messages. AI-generated assessments may contain errors and should
            be treated as guidance rather than a guarantee.
          </p>
        </div>

        <div className="legal-card">
          <h2>5. Security</h2>
          <p>
            We aim to follow reasonable security practices when processing
            submitted information. However, no online system can guarantee
            complete security.
          </p>
        </div>

        <div className="legal-card">
          <h2>6. Disclaimer</h2>
          <p>
            ScamShield provides risk guidance and does not guarantee that a
            message is safe or malicious. Always independently verify
            suspicious communications before taking action.
          </p>
        </div>

       <Link to="/" className="back-home">
            ← Back to ScamShield
        </Link>

      </div>
    </main>
  );
}

export default PrivacyPolicy;