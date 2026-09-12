const OpenAI = require("openai");

async function analyzeWithAI(message) {

    if (!process.env.OPENAI_API_KEY) throw new Error('AI is not configured');
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000, maxRetries: 0 });

    const response = await client.responses.create({
        model: "gpt-5-mini",
        input: `
You are a scam detection assistant.

Analyze the following message and determine whether it is likely to be a scam.

Return ONLY valid JSON in this format:

{
    "riskScore": 0,
    "riskLevel": "LOW",
    "category": "None",
    "explanation": "Short explanation"
}

Risk score:
0-29 = LOW
30-69 = MEDIUM
70-100 = HIGH

Message:
${message}
`
    });

    const result = JSON.parse(response.output_text);
    if (!Number.isFinite(result.riskScore) || result.riskScore < 0 || result.riskScore > 100 ||
        !['LOW', 'MEDIUM', 'HIGH'].includes(result.riskLevel) || typeof result.category !== 'string' || typeof result.explanation !== 'string') {
        throw new Error('Invalid AI assessment');
    }
    return result;
}

module.exports = analyzeWithAI;
