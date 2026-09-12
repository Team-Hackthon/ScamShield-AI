const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function analyzeWithAI(message) {

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

    return JSON.parse(response.output_text);
}

module.exports = analyzeWithAI;