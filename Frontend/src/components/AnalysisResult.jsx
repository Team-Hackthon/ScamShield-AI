import { useState } from "react";

export default function AnalysisResult({ result, onReset }) {
  const level = result.riskLevel?.toLowerCase();

  // =========================
  // LANGUAGE STATE
  // =========================

  const [selectedLanguage, setSelectedLanguage] =
    useState("english");

  const detectedLanguage =
    result.detectedLanguage || "English";

  const hasOriginalLanguage =
    detectedLanguage !== "English" &&
    result.originalLanguage;

  // =========================
  // SELECT DISPLAY CONTENT
  // =========================

  const displayContent =
    selectedLanguage === "original" &&
    hasOriginalLanguage
      ? result.originalLanguage
      : result.english;

  // Fallback support
  const category =
    displayContent?.category ||
    result.category ||
    "Unknown";

  const explanation =
    displayContent?.explanation ||
    result.explanation ||
    "No detailed explanation available.";

  const recommendations =
    displayContent?.recommendations ||
    [];

  // =========================
  // COPY RESULT
  // =========================

  const handleCopyResult = () => {
    const recommendationText =
      recommendations.length > 0
        ? recommendations
            .map(
              (item, index) =>
                `${index + 1}. ${item}`
            )
            .join("\n")
        : "No recommendations available.";

    const reasonText =
      result.reasons?.length > 0
        ? result.reasons.join("\n")
        : "No major threat indicators detected.";

    const text = `
ScamShield Analysis Result

Risk Score: ${result.riskScore}/100
Risk Level: ${result.riskLevel}
Detected Language: ${detectedLanguage}
Category: ${category}

Explanation:
${explanation}

Detected Indicators:
${reasonText}

What Should You Do?
${recommendationText}
    `.trim();

    navigator.clipboard.writeText(text);
  };

  return (
    <section className="result-page">

      {/* =========================
          HEADING
      ========================= */}

      <div className="result-heading">

        <h1>Analysis Result</h1>

        <p>
          Detailed threat assessment and actionable insights.
        </p>

        {/* LANGUAGE SWITCH */}

        {hasOriginalLanguage && (

          <div className="result-language-switch">

            <button
              className={
                selectedLanguage === "english"
                  ? "language-btn active"
                  : "language-btn"
              }
              onClick={() =>
                setSelectedLanguage("english")
              }
            >
              English
            </button>

            <button
              className={
                selectedLanguage === "original"
                  ? "language-btn active"
                  : "language-btn"
              }
              onClick={() =>
                setSelectedLanguage("original")
              }
            >
              {detectedLanguage}
            </button>

          </div>

        )}

      </div>


      {/* =========================
          MAIN LAYOUT
      ========================= */}

      <div className="result-layout">


        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="result-left">


          {/* RISK SCORE */}

          <div className="risk-card">

            <div
              className={`risk-circle risk-circle-${level}`}
            >

              <div>

                <strong>
                  {result.riskScore}
                </strong>

                <span>/100</span>

              </div>

            </div>


            <h2
              className={`risk-${level}`}
            >
              {result.riskLevel} RISK
            </h2>


            <p>
              {result.riskLevel === "HIGH"
                ? "This message contains strong scam indicators."
                : result.riskLevel === "MEDIUM"
                ? "This message contains some suspicious indicators."
                : "No major scam indicators were detected."}
            </p>

          </div>


          {/* =========================
              THREAT SUMMARY
          ========================= */}

          <div className="summary-card">

            <h2>
              Threat Summary
            </h2>


            <div className="summary-row">

              <span>
                Risk Level
              </span>

              <strong>
                {result.riskLevel}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Category
              </span>

              <strong>
                {category}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Risk Score
              </span>

              <strong>
                {result.riskScore}/100
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Language
              </span>

              <strong>
                {detectedLanguage}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="result-right">


          {/* =========================
              THREAT INDICATORS
          ========================= */}

          {result.reasons?.length > 0 && (

            <div className="indicators-card">

              <h2>
                ⚠ Detected Threat Indicators
              </h2>


              <div className="indicator-list">

                {result.reasons.map(
                  (reason, index) => (

                    <div
                      className="indicator-item"
                      key={index}
                    >

                      <span className="indicator-icon">
                        !
                      </span>


                      <div>

                        <strong>
                          Threat indicator
                        </strong>

                        <p>
                          {reason}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* =========================
              EXPLANATION +
              RECOMMENDATIONS
          ========================= */}

          <div className="result-info-grid">


            {/* EXPLANATION */}

            <div className="info-card">

              <h3>
                Why is this risky?
              </h3>

              <p>
                {explanation}
              </p>

            </div>


            {/* =========================
                DYNAMIC RECOMMENDATIONS
            ========================= */}

            <div className="info-card recommendation-card">

              <h3>
                What should you do?
              </h3>


              {recommendations.length > 0 ? (

                <ul>

                  {recommendations.map(
                    (recommendation, index) => (

                      <li key={index}>
                        {recommendation}
                      </li>

                    )
                  )}

                </ul>

              ) : (

                <p>
                  Stay cautious and verify the sender
                  before taking any action.
                </p>

              )}

            </div>

          </div>


          {/* =========================
              ACTION BUTTONS
          ========================= */}

          <div className="result-actions">


            <button
              className="analyze-another"
              onClick={onReset}
            >
              Analyze Another Message
            </button>


            <button
              className="copy-result"
              onClick={handleCopyResult}
            >
              Copy Result
            </button>


          </div>

        </div>

      </div>

    </section>
  );
}