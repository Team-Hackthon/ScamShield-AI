const steps = [
  {
    number: "01",
    icon: "📋",
    title: "Paste",
    text:
      "Copy any suspicious SMS, email, or chat message and paste it into our secure vault."
  },

  {
    number: "02",
    icon: "🔎",
    title: "Analyze",
    text:
      "Our AI and rule-based engine analyze the message for known scam patterns."
  },

  {
    number: "03",
    icon: "◎",
    title: "Detect",
    text:
      "We identify suspicious links, urgent triggers, credential requests, and spoofed identities."
  },

  {
    number: "04",
    icon: "🛡",
    title: "Guide",
    text:
      "Get a clear risk assessment and actionable advice on how to safely handle the message."
  }
];

function HowItWorks() {

  return (
    <section
      className="how-it-works"
      id="how-it-works"
    >

      <div className="section-label">
        ── HOW IT WORKS ──
      </div>

      <h2>
        Simple. Fast. Secure.
      </h2>

      <div className="title-line"></div>

      <div className="steps-grid">

        {steps.map((step) => (

          <div
            className="step-card"
            key={step.number}
          >

            <div className="step-icon">
              {step.icon}
            </div>

            <span>
              STEP {step.number}
            </span>

            <h3>
              {step.title}
            </h3>

            <p>
              {step.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default HowItWorks;