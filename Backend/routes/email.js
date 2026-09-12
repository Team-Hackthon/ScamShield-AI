const express = require('express');
const analyzeEmail = require('../services/email/analyzeEmail');
const analyzeMessage = require('../services/scamDetector');
const calculateFinalRisk = require('../services/finalRiskEngine');

function createEmailRouter(analyzeWithAI = require('../services/aiAnalyzer')) {
    const router = express.Router();
    router.post('/', express.raw({ type: ['message/rfc822', 'application/octet-stream'], limit: '1mb' }), async (req, res, next) => {
        try {
            const input = Buffer.isBuffer(req.body) ? req.body : req.body?.rawEmail;
            const { content, email } = await analyzeEmail(input);
            const rule = analyzeMessage(content.toLowerCase());
            let ai = null;
            // Email content is shared with the configured AI provider only on explicit opt-in.
            if (req.body?.useAI === true || req.query.useAI === 'true') {
                try { ai = await analyzeWithAI(content.slice(0, 20000)); } catch { /* Rules and forensic findings remain available. */ }
            }
            const final = calculateFinalRisk(rule, ai, email);
            res.json({ ...final, inputType: 'email', category: ai?.category || rule.categories.join(', ') || 'Unknown',
                explanation: ai?.explanation || 'Assessment uses message rules, URL checks and sender heuristics. Authentication claims remain unverified.',
                reasons: [...rule.reasons, ...email.findings.map(f => f.reason)],
                ruleBased: { riskScore: rule.riskScore, riskLevel: rule.riskLevel, categories: rule.categories },
                aiAvailable: !!ai, aiAnalysis: ai, email });
        } catch (error) { next(error); }
    });
    return router;
}
module.exports = createEmailRouter;
