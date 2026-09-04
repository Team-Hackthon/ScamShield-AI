import { Link } from "react-router-dom";

function Terms() {
  return (
    <main className="legal-page">
      <div className="legal-container">

        <div className="legal-badge">
          📄 TERMS & CONDITIONS
        </div>

        <h1>Terms of Service</h1>

        <p className="legal-intro">
          By using ScamShield, you agree to use the platform responsibly
          and understand that its analysis is intended to provide risk
          guidance rather than absolute verification.
        </p>

        <div className="legal-card">
          <h2>1. Purpose of ScamShield</h2>
          <p>
            ScamShield is designed to help users identify potentially
            suspicious, fraudulent, phishing, or social engineering messages
            using rule-based detection and AI-assisted analysis.
          </p>
        </div>

        <div className="legal-card">
          <h2>2. No Guarantee of Accuracy</h2>
          <p>
            ScamShield provides a risk assessment based on detected patterns
            and automated analysis. The results may not always be completely
            accurate. A low-risk result does not guarantee that a message is
            safe, and a high-risk result does not prove that a message is
            fraudulent.
          </p>
        </div>

        <div className="legal-card">
          <h2>3. User Responsibility</h2>
          <p>
            Users are responsible for making their own decisions when dealing
            with suspicious messages. Always verify important communications
            through official and trusted sources before sharing information,
            sending money, or clicking links.
          </p>
        </div>

        <div className="legal-card">
          <h2>4. Sensitive Information</h2>
          <p>
            Users should not intentionally submit passwords, OTPs, UPI PINs,
            card details, banking credentials, or other highly sensitive
            information to ScamShield.
          </p>
        </div>

        <div className="legal-card">
          <h2>5. Acceptable Use</h2>
          <p>
            ScamShield must not be used for illegal activities, abuse,
            harassment, attempts to bypass security systems, or any activity
            intended to harm another person or organization.
          </p>
        </div>

        <div className="legal-card">
          <h2>6. AI-Generated Analysis</h2>
          <p>
            Some ScamShield features may use artificial intelligence to
            analyze messages and generate explanations. AI-generated results
            can occasionally be incomplete or incorrect and should be treated
            as guidance only.
          </p>
        </div>

        <div className="legal-card">
          <h2>7. Limitation of Liability</h2>
          <p>
            ScamShield and its developers are not responsible for financial
            loss, data loss, security incidents, or other damages resulting
            from decisions made solely on the basis of a ScamShield analysis.
          </p>
        </div>

        <div className="legal-card">
          <h2>8. Changes to These Terms</h2>
          <p>
            These terms may be updated as ScamShield develops and new
            features are introduced. Continued use of the platform after
            changes means that you accept the updated terms.
          </p>
        </div>

        <div className="legal-card">
          <h2>9. Educational Project</h2>
          <p>
            ScamShield is currently an educational and cybersecurity project.
            It should not be considered a replacement for professional
            cybersecurity, financial, legal, or law-enforcement advice.
          </p>
        </div>

        <Link to="/" className="back-home">
          ← Back to ScamShield
        </Link>

      </div>
    </main>
  );
}

export default Terms;