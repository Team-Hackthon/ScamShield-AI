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

    // Remove extra spaces
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


    // =========================
    // RULE-BASED ANALYSIS
    // =========================

    const ruleResult = analyzeMessage(message.toLowerCase());


    try {

        // =========================
        // AI ANALYSIS
        // =========================

        const aiResult = await analyzeWithAI(message);


        // =========================
        // COMBINE AI + RULE RESULTS
        // =========================

        const finalResult = calculateFinalRisk(
            ruleResult,
            aiResult
        );


        // =========================
        // SUCCESS RESPONSE
        // =========================

        return res.status(200).json({

            riskScore: finalResult.riskScore,

            riskLevel: finalResult.riskLevel,

            category: aiResult.category,

            explanation: aiResult.explanation,

            recommendation: finalResult.recommendation,

            reasons: ruleResult.reasons,

            ruleBased: {
                riskScore: ruleResult.riskScore,
                riskLevel: ruleResult.riskLevel,
                categories: ruleResult.categories
            },

            aiAnalysis: {
                riskScore: aiResult.riskScore,
                riskLevel: aiResult.riskLevel,
                category: aiResult.category
            },

            aiAvailable: true
        });


    } catch (error) {

        console.error("AI Error:", error.message);


        // =========================
        // AI FAILURE FALLBACK
        // =========================

        return res.status(200).json({

            riskScore: ruleResult.riskScore,

            riskLevel: ruleResult.riskLevel,

            category:
                ruleResult.categories.length > 0
                    ? ruleResult.categories.join(", ")
                    : "Unknown",

            explanation:
                "AI analysis is currently unavailable. Result generated using ScamShield's rule-based detection.",

            recommendation:
                ruleResult.riskScore >= 70
                    ? "Do not click suspicious links or share OTP, passwords, PINs, or banking details."
                    : "Stay cautious and verify the sender before taking any action.",

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