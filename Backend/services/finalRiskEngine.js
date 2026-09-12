function calculateFinalRisk(ruleResult, aiResult, emailResult = null) {

    // Combine rule-based and AI scores
    const CalculatedScore = Math.round(
        aiResult ? ((ruleResult.riskScore * 0.4) + (aiResult.riskScore * 0.6)) : ruleResult.riskScore
    );

    const finalScore = Math.max(
  0,
  Math.min(Math.round(CalculatedScore) + (emailResult?.riskScore || 0), 100)
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
