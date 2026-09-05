function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">

        <div className="section-label">— ABOUT SCAMSHIELD —</div>

        <h2>
          Built to make digital communication <span>safer.</span>
        </h2>

        <div className="about-message">
          <span>✦</span>
          Think before you click. <strong>Verify before you trust.</strong>
          <span>✦</span>
        </div>

        
        
        s<div className="about-grid">

          <div className="about-card">
            <div className="about-icon">🛡️</div>

            <h3>Our Mission</h3>

            <p>
              Help people recognize digital scams before taking risky
              actions.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🧠</div>

            <h3>Hybrid Detection</h3>

            <p>
              Combines predefined security rules with AI-based contextual
              analysis.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">🔒</div>

            <h3>Privacy First</h3>

            <p>
              Designed to analyze suspicious content while minimizing
              unnecessary data retention.
            </p>
          </div>

        </div>

        

      </div>
    </section>
  );
}

export default About;