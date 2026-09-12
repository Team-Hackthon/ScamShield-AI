function calculateFinalRisk(ruleResult, aiResult) {

    // Combine rule-based and AI scores
    const CalculatedScore = Math.round(
        ((ruleResult.riskScore * 0.4) + (aiResult.riskScore * 0.6))
    );

    const finalScore = Math.max(
  0,
  Math.min(Math.round(CalculatedScore), 100)
);

    let riskLevel;
    let recommendation;

    if (finalScore >= 70) {
        riskLevel = "HIGH";
        recommendation = "Do not click links or share OTP, passwords, PINs, or banking details.";
    } 
    else if (finalScore >= 30) {
        riskLevel = "MEDIUM";
        recommendation = "Be careful. Verify the sender and information before taking any action.";
    } 
    else {
        riskLevel = "LOW";
        recommendation = "No major scam indicators detected, but remain cautious.";
    }

    return {
        riskScore: finalScore,
        riskLevel: riskLevel,
        recommendation: recommendation
    };
}

module.exports = calculateFinalRisk;