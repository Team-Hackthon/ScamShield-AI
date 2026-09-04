export default function AnalysisResult({ result, onReset }) {
  const level = result.riskLevel?.toLowerCase();
  return (
    <section className="result-page">

      <div className="result-heading">
        <h1>Analysis Result</h1>
        <p>
          Detailed threat assessment and actionable insights.
        </p>
      </div>

      <div className="result-layout">

        <div className="result-left">

          <div className="risk-card">

            <div className={`risk-circle risk-circle-${level}`}>
              <div>
                <strong>{result.riskScore}</strong>
                <span>/100</span>
              </div>
            </div>

            <h2 className={`risk-${level}`}>
              {result.riskLevel} RISK
            </h2>
            <p>
              This message may contain suspicious indicators.
            </p>

          </div>

          <div className="summary-card">

            <h2>Threat Summary</h2>

            <div className="summary-row">
              <span>Risk Level</span>
              <strong>{result.riskLevel}</strong>
            </div>

            <div className="summary-row">
              <span>Category</span>
              <strong>{result.category}</strong>
            </div>

            <div className="summary-row">
              <span>Risk Score</span>
              <strong>{result.riskScore}/100</strong>
            </div>

          </div>

        </div>


        <div className="result-right">

          <div className="indicators-card">

            <h2>⚠ Detected Threat Indicators</h2>

            <div className="indicator-list">

              {result.reasons?.map((reason, index) => (
                <div className="indicator-item" key={index}>

                  <span className="indicator-icon">
                    !
                  </span>

                  <div>
                    <strong>Threat indicator</strong>
                    <p>{reason}</p>
                  </div>

                </div>
              ))}

            </div>

          </div>


          <div className="result-info-grid">

            <div className="info-card">

              <h3>Why is this risky?</h3>

              <p>
                {result.explanation ||
                  "This message contains patterns commonly associated with scams and social engineering attacks."}
              </p>

            </div>


            <div className="info-card recommendation-card">

              <h3>What should you do?</h3>

              <ul>
                <li>Do not click suspicious links.</li>
                <li>Do not share passwords, OTPs or PINs.</li>
                <li>Verify the sender independently.</li>
                <li>Delete or report suspicious messages.</li>
              </ul>

            </div>

          </div>


          <div className="result-actions">

            <button
              className="analyze-another"
              onClick={onReset}
            >
              Analyze Another Message
            </button>

           <button
                className="copy-result"
                onClick={() => {
                const text = `
                            ScamShield Analysis Result

                Risk Score: ${result.riskScore}/100
                Risk Level: ${result.riskLevel}
                Category: ${result.category}

Reasons:
${result.reasons?.join("\n")}
    `;

    navigator.clipboard.writeText(text);
  }}
>
  Copy Result
</button>
          </div>

        </div>

      </div>

    </section>
  );
}

