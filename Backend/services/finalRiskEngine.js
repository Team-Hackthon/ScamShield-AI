function calculateFinalRisk(ruleResult, aiResult) {
  const ruleScore = Math.max(
    0,
    Math.min(Number(ruleResult?.riskScore) || 0, 100)
  );

  const aiScore = Math.max(
    0,
    Math.min(Number(aiResult?.riskScore) || 0, 100)
  );

  // Use the stronger detector as the baseline
  let finalScore = Math.max(aiScore, ruleScore);

  // If BOTH systems independently detect meaningful risk,
  // add a small corroboration bonus.
  if (aiScore >= 70 && ruleScore >= 70) {
    finalScore += 5;
  } else if (aiScore >= 30 && ruleScore >= 30) {
    finalScore += 3;
  }

  // Keep score between 0 and 100
  finalScore = Math.max(
    0,
    Math.min(Math.round(finalScore), 100)
  );

  let riskLevel;

  if (finalScore >= 70) {
    riskLevel = "HIGH";
  } else if (finalScore >= 30) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  return {
    riskScore: finalScore,
    riskLevel
  };
}

module.exports = calculateFinalRisk;