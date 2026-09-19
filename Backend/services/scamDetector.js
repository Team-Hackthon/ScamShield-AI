const analyzeURL = require("./urlAnalyzer");

// =====================================================
// HELPER: NORMALIZE TEXT
// =====================================================

function normalizeText(message) {
  return message
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}


// =====================================================
// HELPER: KEYWORD DETECTION
// =====================================================

function containsKeyword(message, keyword) {
  if (!message || !keyword) {
    return false;
  }

  const escapedKeyword = keyword.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `\\b${escapedKeyword}\\b`,
    "i"
  );

  return regex.test(message);
}


// =====================================================
// HELPER: CHECK MULTIPLE PHRASES
// =====================================================

function containsAny(message, phrases) {
  return phrases.some((phrase) =>
    containsKeyword(message, phrase)
  );
}


// =====================================================
// MAIN ANALYZER
// =====================================================

function analyzeMessage(inputMessage) {

  const message = normalizeText(inputMessage);

  let riskScore = 0;

  const reasons = [];
  const categories = [];


  // ===================================================
  // ADD CATEGORY SAFELY
  // ===================================================

  function addCategory(category) {
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }


  // ===================================================
  // 1. DETECT PROTECTIVE / SECURITY CONTEXT
  // ===================================================

  const protectivePhrases = [

    "do not share",
    "don't share",
    "never share",
    "never disclose",

    "do not disclose",
    "don't disclose",

    "do not reveal",
    "don't reveal",

    "never reveal",

    "do not send",
    "don't send",

    "never send",

    "keep your otp private",
    "keep your password private",
    "keep your pin private",

    "bank will never ask",
    "banks will never ask",

    "we will never ask",

    "do not click suspicious links",
    "don't click suspicious links"
  ];


  const hasProtectiveContext =
    containsAny(message, protectivePhrases);


  // ===================================================
  // 2. SENSITIVE INFORMATION
  // ===================================================

  const credentialWords = [
    "otp",
    "password",
    "pin",
    "cvv",
    "verification code"
  ];


  const detectedCredentials =
    credentialWords.filter((word) =>
      containsKeyword(message, word)
    );


  // ===================================================
  // 3. CREDENTIAL REQUEST DETECTION
  // ===================================================

  const credentialRequestPatterns = [

    "send your otp",
    "share your otp",
    "enter your otp",
    "provide your otp",
    "give your otp",
    "tell me your otp",

    "send otp",
    "share otp",
    "enter otp",
    "provide otp",

    "send your password",
    "share your password",
    "enter your password",
    "provide your password",

    "send your pin",
    "share your pin",
    "enter your pin",
    "provide your pin",

    "send your cvv",
    "share your cvv",
    "enter your cvv",
    "provide your cvv",

    "send verification code",
    "share verification code",
    "enter verification code"
  ];


  const credentialRequested =
    containsAny(message, credentialRequestPatterns);


  // ===================================================
  // CREDENTIAL SCORING
  // ===================================================

  if (credentialRequested && !hasProtectiveContext) {

    riskScore += 30;

    reasons.push(
      "Message requests sensitive authentication information"
    );

    addCategory("Credential Scam");
  }

  else if (
    detectedCredentials.length > 0 &&
    hasProtectiveContext
  ) {

    reasons.push(
      "Security-related credential mentioned in a protective context"
    );
  }


  // ===================================================
  // 4. BANKING TERMS
  // ===================================================

  const bankingWords = [
    "bank",
    "account",
    "credit card",
    "debit card",
    "transaction"
  ];


  const detectedBankingWords =
    bankingWords.filter((word) =>
      containsKeyword(message, word)
    );


  // Banking words alone should NOT create large risk.

  if (
    detectedBankingWords.length > 0 &&
    !hasProtectiveContext
  ) {

    riskScore += 5;

    reasons.push(
      `Banking context detected: ${detectedBankingWords.join(", ")}`
    );
  }


  // ===================================================
  // 5. PAYMENT / UPI REQUESTS
  // ===================================================

  const paymentRequestPatterns = [

    "send money",
    "pay now",
    "make payment",
    "transfer money",

    "scan qr",
    "scan the qr",
    "scan this qr",

    "pay immediately",
    "payment required",

    "send payment"
  ];


  if (
    containsAny(message, paymentRequestPatterns) &&
    !hasProtectiveContext
  ) {

    riskScore += 20;

    reasons.push(
      "Message requests a payment or money transfer"
    );

    addCategory("UPI/Payment Scam");
  }


  // ===================================================
  // 6. URGENCY / PRESSURE
  // ===================================================

  const urgencyWords = [

    "urgent",
    "immediately",
    "act now",
    "click now",

    "last chance",

    "within 24 hours",

    "account will be blocked",
    "account will be suspended",

    "account suspended",

    "final warning"
  ];


  const detectedUrgency =
    urgencyWords.filter((word) =>
      containsKeyword(message, word)
    );


  if (
    detectedUrgency.length > 0 &&
    !hasProtectiveContext
  ) {

    riskScore += 15;

    reasons.push(
      `Urgency or pressure detected: ${detectedUrgency.join(", ")}`
    );

    addCategory("Urgency Scam");
  }


  // ===================================================
  // 7. PHISHING ACTIONS
  // ===================================================

  const phishingPatterns = [

    "click the link",

    "verify your account",

    "confirm your account",

    "login immediately",

    "log in immediately",

    "verify immediately",

    "update your account",

    "confirm your details"
  ];


  if (
    containsAny(message, phishingPatterns) &&
    !hasProtectiveContext
  ) {

    riskScore += 20;

    reasons.push(
      "Message requests a suspicious account verification action"
    );

    addCategory("Phishing Scam");
  }


  // ===================================================
  // 8. PRIZE / LOTTERY SCAM
  // ===================================================

  const prizeIndicators = [

    "you have won",
    "you won",

    "lottery winner",

    "claim your prize",
    "claim prize",

    "claim your reward",

    "cash prize",

    "prize money"
  ];


  if (containsAny(message, prizeIndicators)) {

    riskScore += 15;

    reasons.push(
      "Prize or lottery claim detected"
    );

    addCategory("Prize Scam");
  }


  // ===================================================
  // 9. JOB SCAM
  // ===================================================

  const jobIndicators = [

    "registration fee",

    "pay registration fee",

    "job processing fee",

    "pay to get job",

    "earn daily",

    "easy money",

    "guaranteed income"
  ];


  if (containsAny(message, jobIndicators)) {

    riskScore += 20;

    reasons.push(
      "Suspicious job or income offer detected"
    );

    addCategory("Job Scam");
  }


  // ===================================================
  // 10. LOAN SCAM
  // ===================================================

  const loanIndicators = [

    "instant loan",

    "loan approved",

    "guaranteed loan",

    "loan processing fee",

    "pay processing fee"
  ];


  if (containsAny(message, loanIndicators)) {

    riskScore += 20;

    reasons.push(
      "Suspicious loan offer detected"
    );

    addCategory("Loan Scam");
  }


  // ===================================================
  // 11. INVESTMENT SCAM
  // ===================================================

  const investmentIndicators = [

    "guaranteed profit",

    "double your money",

    "guaranteed return",

    "risk free investment",

    "100% return",

    "guaranteed crypto profit"
  ];


  if (containsAny(message, investmentIndicators)) {

    riskScore += 25;

    reasons.push(
      "Unrealistic or guaranteed investment return detected"
    );

    addCategory("Investment Scam");
  }


  // ===================================================
  // 12. URL ANALYSIS
  // ===================================================

  const urlPattern = /(https?:\/\/[^\s]+)/gi;

  const urls = inputMessage.match(urlPattern);


  if (urls) {

    reasons.push(
      "Message contains a URL"
    );


    for (const url of urls) {

      const urlResult = analyzeURL(url);

      riskScore += urlResult.score;

      reasons.push(
        ...urlResult.reasons
      );
    }
  }


  // ===================================================
  // 13. COMBINATION BONUSES
  // ===================================================

  /*
    Multiple independent scam indicators appearing together
    are significantly more suspicious than a single word.
  */


  // Credential request + urgency

  if (
    credentialRequested &&
    detectedUrgency.length > 0 &&
    !hasProtectiveContext
  ) {

    riskScore += 15;

    reasons.push(
      "Sensitive information is requested under urgent pressure"
    );
  }


  // Credential request + banking context

  if (
    credentialRequested &&
    detectedBankingWords.length > 0 &&
    !hasProtectiveContext
  ) {

    riskScore += 10;

    reasons.push(
      "Authentication information is requested in a banking context"
    );
  }


  // Payment request + urgency

  if (
    containsAny(message, paymentRequestPatterns) &&
    detectedUrgency.length > 0 &&
    !hasProtectiveContext
  ) {

    riskScore += 10;

    reasons.push(
      "Payment is requested under urgent pressure"
    );
  }


  // ===================================================
  // 14. PROTECTIVE MESSAGE HANDLING
  // ===================================================

  /*
    Example:

    "Your OTP is 123456. Don't share it with anyone."

    The word OTP exists, but the intent is protective.
  */

  if (
    hasProtectiveContext &&
    !credentialRequested
  ) {

    riskScore = Math.min(
      riskScore,
      10
    );

    reasons.push(
      "Protective security language detected"
    );
  }


  // ===================================================
  // 15. CAP SCORE
  // ===================================================

  riskScore = Math.max(
    0,
    Math.min(Math.round(riskScore), 100)
  );


  // ===================================================
  // 16. RISK LEVEL
  // ===================================================

  let riskLevel;


  if (riskScore >= 70) {

    riskLevel = "HIGH";

  }

  else if (riskScore >= 30) {

    riskLevel = "MEDIUM";

  }

  else {

    riskLevel = "LOW";

  }


  // ===================================================
  // RETURN RESULT
  // ===================================================

  return {

    riskScore,

    riskLevel,

    categories,

    reasons
  };
}


module.exports = analyzeMessage;