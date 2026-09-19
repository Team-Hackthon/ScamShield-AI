const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithAI(message) {
  try {
    // =========================
    // AI REQUEST
    // =========================

    const response = await client.responses.create({
      model: "gpt-5-mini",

      input: `
You are the AI analysis component of ScamShield AI,
a scam, phishing, fraud, and social-engineering detection system.

Your job is to analyze the message carefully and return
structured scam-analysis data.

The system currently supports:

- English
- Hindi
- Gujarati
- Hinglish (Romanized Hindi mixed with English)

==================================================
TASK 1: DETECT LANGUAGE
==================================================

Detect the language AND writing style of the ORIGINAL message.

You MUST return exactly one of:

"English"
"Hindi"
"Gujarati"
"Hinglish"

Follow these rules strictly:

1. ENGLISH
Return "English" when the message is primarily normal English
written using the Latin alphabet.

Example:
"Your bank account will be blocked."

→ English


2. HINDI
Return "Hindi" ONLY when Hindi is primarily written using
Devanagari script.

Example:
"आपका बैंक खाता बंद हो जाएगा।"

→ Hindi


3. GUJARATI
Return "Gujarati" when Gujarati is primarily written using
Gujarati script.

Example:
"તમારું બેંક ખાતું બંધ થઈ જશે."

→ Gujarati


4. HINGLISH
Return "Hinglish" when Hindi words or Hindi sentence structure
are written using the Latin/Roman alphabet, even when English
words are mixed into the sentence.

Examples:

"Aapka bank account block ho jayega."
→ Hinglish

"Turant apna OTP bhejo."
→ Hinglish

"Aapko verification complete karna hoga."
→ Hinglish

"Mera account kaam nahi kar raha."
→ Hinglish

IMPORTANT:

Do NOT classify Romanized Hindi as "Hindi".

Hindi written in Devanagari:
"अपना OTP भेजो"
→ Hindi

Hindi written in Roman/Latin characters:
"Apna OTP bhejo"
→ Hinglish

English technical words such as:
bank, account, OTP, payment, login, link

do NOT make a Romanized Hindi sentence English.

Look at the sentence structure and Hindi words such as:

aap
aapka
apna
bhejo
karo
karna
hoga
ho
jayega
turant
paisa
paise
nahi
hai
mera
tumhara

==================================================
TASK 2: CREATE NORMALIZED ENGLISH TEXT
==================================================

Create an English normalized version of the original message.

This normalized text will be used internally by ScamShield's
rule-based detection engine.

IMPORTANT:

- Preserve the original meaning.
- Preserve scam intent.
- Preserve urgency.
- Preserve threats.
- Preserve requests for sensitive information.
- Do NOT modify URLs.
- Do NOT modify email addresses.
- Do NOT modify phone numbers.
- Do NOT modify UPI IDs.
- Do NOT modify OTP values.
- Do NOT modify account numbers.
- Do NOT modify other technical identifiers.

If the message is already English, normalizedText should remain
semantically equivalent to the original English message.

==================================================
TASK 3: ANALYZE SCAM RISK
==================================================

Analyze the ORIGINAL message for indicators including:

- Phishing
- Banking scams
- UPI/payment scams
- OTP theft
- Credential theft
- Password/PIN/CVV requests
- Account takeover
- Fake prizes
- Lottery scams
- Job scams
- Loan scams
- Investment scams
- Cryptocurrency scams
- Impersonation
- Social engineering
- Urgency
- Threats
- Suspicious links
- Requests for money
- Requests for sensitive information

IMPORTANT:

Understand the CONTEXT.

Simply mentioning words such as:

OTP
password
bank
payment
PIN
CVV

does NOT automatically mean the message is a scam.

For example:

"Your OTP is 123456. Do not share it with anyone."

is normally a protective security message and should NOT be
classified as dangerous merely because it contains the word OTP.

However:

"Send your OTP immediately."

is suspicious because it requests sensitive authentication
information.

Always consider the intent and context of the complete message.

==================================================
TASK 4: RISK SCORE
==================================================

Return a risk score between 0 and 100.

Risk levels:

0-29 = LOW
30-69 = MEDIUM
70-100 = HIGH

==================================================
TASK 5: ENGLISH RESULT
==================================================

Always generate:

- category
- explanation

in English.

The explanation should briefly explain WHY the message appears
safe or suspicious.

==================================================
TASK 6: ORIGINAL-LANGUAGE RESULT
==================================================

Also generate:

- category
- explanation

in the same language/style as the original message.

Rules:

If detectedLanguage = "Hindi":
Return this section in Hindi using Devanagari script.

If detectedLanguage = "Gujarati":
Return this section in Gujarati script.

If detectedLanguage = "Hinglish":

originalLanguage.category and
originalLanguage.explanation

MUST be written using the Latin/Roman alphabet.

Do NOT use Devanagari script.

Example:

"Yeh message suspicious hai kyunki sender aapse
OTP share karne ko keh raha hai."

NOT:

"यह संदेश संदिग्ध है..."

If detectedLanguage = "English":
The originalLanguage category and explanation MUST be identical
to the English category and explanation.

NEVER translate an English message result into Spanish,
Hindi, Gujarati, or any other language.

==================================================
TASK 7: DYNAMIC SAFETY RECOMMENDATIONS
==================================================

Generate practical safety recommendations based specifically
on the threat detected in the message.

Do NOT generate the same generic recommendations for every message.

The recommendations must directly respond to the detected
scam technique.

Examples:

For OTP / credential theft:
- Do not share the OTP, PIN, password, or CVV.
- Verify the request through the official bank/service.
- If credentials were already shared, secure the account immediately.

For phishing links:
- Do not open or interact with the suspicious link.
- Visit the organization's official website manually.
- Do not enter login credentials on the linked website.
- If credentials were already entered, change the password.

For UPI / QR scams:
- Do not scan unknown QR codes.
- Never enter a UPI PIN to receive money.
- Verify payment requests inside the official UPI app.
- Contact the bank if money has already been transferred.

For prize / lottery scams:
- Do not pay a processing or claim fee.
- Do not provide banking or identity information.
- Verify the offer using an official source.

For job scams:
- Do not pay registration or recruitment fees.
- Verify the company and recruiter independently.
- Do not provide banking credentials or sensitive documents.

For investment scams:
- Do not transfer money based on guaranteed-return claims.
- Verify the investment platform independently.
- Be suspicious of guaranteed profits or pressure to invest quickly.

For LOW-risk legitimate messages:
- Give calm, appropriate advice.
- Do NOT tell the user that the message is dangerous if there is
  no meaningful evidence of a scam.
- A simple recommendation such as verifying the sender if unsure
  is sufficient.

Generate between 2 and 4 recommendations.

Recommendations must be concise and actionable.

english.recommendations MUST always be written in English.

originalLanguage.recommendations MUST be written in the same
language/style as the original message.

For English:
originalLanguage.recommendations MUST be identical to
english.recommendations.

For Hindi:
Use Hindi in Devanagari script.

For Gujarati:
Use Gujarati script.

For Hinglish:
Use Romanized Hindi/Hinglish and DO NOT use Devanagari.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT add text before or after the JSON.

Use exactly this structure:

{
  "detectedLanguage": "English",

  "normalizedText": "English normalized version of the message",

  "riskScore": 0,

  "riskLevel": "LOW",

  "english": {
    "category": "None",
    "explanation": "Short explanation in English",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  },

  "originalLanguage": {
    "language": "English",
    "category": "None",
    "explanation": "Short explanation in the original language",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  }
}

==================================================
IMPORTANT VALIDATION RULES
==================================================

riskScore must always be a number from 0 to 100.

riskLevel must always be one of:

"LOW"
"MEDIUM"
"HIGH"

detectedLanguage must always be one of:

"English"
"Hindi"
"Gujarati"
"Hinglish"

normalizedText must ALWAYS be English.

english.category must ALWAYS be English.

english.explanation must ALWAYS be English.

originalLanguage.language must match detectedLanguage.

For English messages:

originalLanguage.category = english.category

and

originalLanguage.explanation = english.explanation

==================================================
MESSAGE TO ANALYZE
==================================================

${message}
`,
    });

    // =========================
    // PARSE AI RESPONSE
    // =========================

    const result = JSON.parse(response.output_text);

    // =========================
    // BASIC VALIDATION
    // =========================

    const supportedLanguages = [
      "English",
      "Hindi",
      "Gujarati",
      "Hinglish",
    ];

    if (!supportedLanguages.includes(result.detectedLanguage)) {
      result.detectedLanguage = "English";
    }

    // =========================
    // VALIDATE RISK SCORE
    // =========================

    let riskScore = Number(result.riskScore);

    if (Number.isNaN(riskScore)) {
      riskScore = 0;
    }

    riskScore = Math.max(
      0,
      Math.min(Math.round(riskScore), 100)
    );

    result.riskScore = riskScore;

    // =========================
    // CALCULATE RISK LEVEL
    // =========================

    if (riskScore >= 70) {
      result.riskLevel = "HIGH";
    } else if (riskScore >= 30) {
      result.riskLevel = "MEDIUM";
    } else {
      result.riskLevel = "LOW";
    }

// =========================
// VALIDATE RECOMMENDATIONS
// =========================

if (!Array.isArray(result.english.recommendations)) {
  result.english.recommendations = [
    "Verify the sender before taking any action."
  ];
}

if (!Array.isArray(result.originalLanguage.recommendations)) {
  result.originalLanguage.recommendations =
    result.english.recommendations;
}

    

    // =========================
    // VALIDATE ENGLISH RESULT
    // =========================

    if (!result.english) {
      result.english = {
        category: "Unknown",
        explanation: "Unable to generate explanation.",
      };
    }

    // =========================
    // VALIDATE ORIGINAL LANGUAGE
    // =========================

    if (!result.originalLanguage) {
      result.originalLanguage = {
        language: result.detectedLanguage,
        category: result.english.category,
        explanation: result.english.explanation,
      };
    }

    result.originalLanguage.language =
      result.detectedLanguage;

    // =========================
    // IMPORTANT ENGLISH FIX
    // =========================

    /*
      If the original message is English,
      DO NOT trust a second AI translation.

      Force the original-language result
      to be exactly the English result.
    */

    if (result.detectedLanguage === "English") {
  result.originalLanguage = {
    language: "English",
    category: result.english.category,
    explanation: result.english.explanation,
    recommendations: result.english.recommendations,
  };
}

    // =========================
    // NORMALIZED TEXT FALLBACK
    // =========================

    if (
      !result.normalizedText ||
      typeof result.normalizedText !== "string"
    ) {
      result.normalizedText = message;
    }

    // =========================
    // RETURN RESULT
    // =========================

    return result;

  } catch (error) {

    // =========================
    // ERROR HANDLING
    // =========================

    console.error(
      "AI Analyzer Error:",
      error.message
    );

    throw new Error(
      "AI analysis failed."
    );
  }
}

module.exports = analyzeWithAI;