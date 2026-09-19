const express = require("express");
const router = express.Router();

const analyzeMessage = require("../services/scamDetector");
const analyzeWithAI = require("../services/aiAnalyzer");
const calculateFinalRisk = require("../services/finalRiskEngine");

router.post("/", async (req, res) => {

  // =========================
  // INPUT VALIDATION
  // =========================

  if (!req.body.message) {
    return res.status(400).json({
      error: "Message is required"
    });
  }

  if (typeof req.body.message !== "string") {
    return res.status(400).json({
      error: "Message must be text"
    });
  }

  const message = req.body.message.trim();

  if (message.length === 0) {
    return res.status(400).json({
      error: "Message cannot be empty"
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      error: "Message is too long. Maximum length is 5000 characters."
    });
  }

  try {

    // =========================
    // AI ANALYSIS FIRST
    // =========================

    const aiResult = await analyzeWithAI(message);

    // =========================
    // RULE-BASED ANALYSIS
    // =========================

    /*
      AI converts Hindi / Gujarati / Hinglish messages
      into normalized English for the existing rule engine.

      English messages also receive normalized English.
    */

    const normalizedMessage =
      aiResult.normalizedText || message;

    const ruleResult = analyzeMessage(
      normalizedMessage.toLowerCase()
    );

    // =========================
    // FINAL RISK
    // =========================

    const finalResult = calculateFinalRisk(
      ruleResult,
      aiResult
    );

    // =========================
    // SUCCESS RESPONSE
    // =========================

    return res.status(200).json({

      detectedLanguage: aiResult.detectedLanguage,

      riskScore: finalResult.riskScore,

      riskLevel: finalResult.riskLevel,

      // English result
      english: {
      category: aiResult.english.category,
      explanation: aiResult.english.explanation,
      recommendations: aiResult.english.recommendations
},

      // Original-language result
      originalLanguage: {
          language: aiResult.originalLanguage.language,
          category: aiResult.originalLanguage.category,
          explanation: aiResult.originalLanguage.explanation,
          recommendations:
    aiResult.originalLanguage.recommendations
},

      // Rule evidence
      reasons: ruleResult.reasons,

      ruleBased: {
        riskScore: ruleResult.riskScore,
        riskLevel: ruleResult.riskLevel,
        categories: ruleResult.categories
      },

      aiAnalysis: {
        riskScore: aiResult.riskScore,
        riskLevel: aiResult.riskLevel
      },

      aiAvailable: true
    });

  } catch (error) {

    console.error("AI Error:", error.message);

    // =========================
    // AI FAILURE FALLBACK
    // =========================

    /*
      If AI fails, multilingual normalization is unavailable,
      so run the original message through the rule engine.
    */

    const ruleResult = analyzeMessage(
      message.toLowerCase()
    );

    return res.status(200).json({

      detectedLanguage: "Unknown",

      riskScore: ruleResult.riskScore,

      riskLevel: ruleResult.riskLevel,

      english: {
        category:
          ruleResult.categories.length > 0
            ? ruleResult.categories.join(", ")
            : "Unknown",

        explanation:
          "AI analysis is currently unavailable. Result generated using ScamShield's rule-based detection."
      },

      originalLanguage: null,

      reasons: ruleResult.reasons,

      ruleBased: {
        riskScore: ruleResult.riskScore,
        riskLevel: ruleResult.riskLevel,
        categories: ruleResult.categories
      },

      aiAvailable: false
    });
  }
});

module.exports = router;