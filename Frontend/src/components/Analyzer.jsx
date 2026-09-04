import { useState } from "react";
import AnalysisResult from "./AnalysisResult.jsx";




function Analyzer() {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const handleReset = () => {
  setMessage("");
  setResult(null);
  setError("");
};


  const quickTests = {
    Banking:
      "URGENT! Your bank account will be blocked. Verify your account immediately.",

    Prize:
      "Congratulations! You have won a prize. Click now to claim your reward.",

    UPI:
      "You received a refund. Scan this QR code and enter your UPI PIN."
  };



  const selectQuickTest = (type) => {
    setMessage(quickTests[type]);
  };

  const handleAnalyze = async () => {
  if (!message.trim()) {
    alert("Please enter a message first.");
    return;
  }

  setLoading(true);
  setError("");
  setResult(null);

  try {
    const response = await fetch("https://scamshield-ai-0uij.onrender.com/analyze",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Backend response:", data);

    setResult(data);
  } catch (error) {
    console.error("Analysis failed:", error);

    setError(
      "Unable to analyze message. Please check whether the backend server is running."
    );
  } finally {
    setLoading(false);
  }
};



if (loading) {
  return (
    <section className="analysis-loading">
      <div className="loading-card">
        <div className="loading-shield">🛡</div>

        <h2>Analyzing your message...</h2>

        <div className="loading-steps">
          <div className="loading-step complete">
            <span>✓</span>
            Checking patterns
          </div>

          <div className="loading-step complete">
            <span>✓</span>
            Analyzing context
          </div>

          <div className="loading-step active">
            <span className="spinner"></span>
            Calculating risk
          </div>
        </div>
      </div>
    </section>
  );
}

if (error) {
  return (
    <section className="analysis-error">
      <div className="error-card">
        <div className="error-icon">!</div>

        <h2>Unable to analyze message</h2>

        <p>{error}</p>

        <button onClick={handleAnalyze}>
          Try Again
        </button>
      </div>
    </section>
  );
}

if (result) {
  return (
    <AnalysisResult
      result={result}
      onReset={handleReset}
    />
  );
}
if (error) {
  return (
    <section className="analysis-error">

      <div className="error-card">

        <div className="error-icon">
          !
        </div>

        <h2>Unable to analyze message</h2>

        <p>
          Something went wrong while connecting to our security servers.
        </p>

        <button onClick={handleAnalyze}>
          Try Again
        </button>

      </div>

    </section>
  );
}





  return (
    <section className="analyzer-card">

      <div className="analyzer-header">

        <div className="engine-title">
          ◎ THREAT ANALYSIS ENGINE V2.4
        </div>

        <div className="system-status">
          ● System Online
        </div>

      </div>

      <div className="textarea-wrapper">

        <textarea
          placeholder="Paste the suspicious message here..."
          value={message}
          maxLength={5000}
          onChange={(event) =>
            setMessage(event.target.value)
          }
        />

        <div className="character-count">
          {message.length} / 5000 chars
        </div>

      </div>

      <div className="analyzer-actions">

        <div className="quick-tests">

          <span>Quick Test:</span>

          <button
            onClick={() =>
              selectQuickTest("Banking")
            }
          >
            🏦 Banking
          </button>

          <button
            onClick={() =>
              selectQuickTest("Prize")
            }
          >
            🏆 Prize
          </button>

          <button
            onClick={() =>
              selectQuickTest("UPI")
            }
          >
            💳 UPI
          </button>

        </div>

        <button
          className="analyze-button"
          onClick={handleAnalyze}
        >
          🛡 Analyze Message →
        </button>

      </div>

    </section>
  );
}

export default Analyzer;