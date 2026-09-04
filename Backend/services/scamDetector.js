const analyzeURL = require("./urlAnalyzer");

function containsKeyword(message, keyword) {
    if (!message || !keyword) {
        return false;
    }

    if (keyword.includes(" ")) {
        return message.includes(keyword);
    }

    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    return regex.test(message);
}

function analyzeMessage(message) {
    let riskScore = 0;
    let reasons = [];
    let categories = [];

    // =========================
    // UPI / PAYMENT SCAM
    // =========================

    const paymentWords = [
        "upi",
        "payment",
        "pay now",
        "send money",
        "qr code",
        "scan qr",
        "refund"
    ];

    for (const word of paymentWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Payment-related scam indicator: ${word}`);

            if (!categories.includes("UPI/Payment Scam")) {
                categories.push("UPI/Payment Scam");
            }
        }
    }

    // =========================
    // BANKING SCAM
    // =========================

    const bankingWords = [
        "bank",
        "account",
        "credit card",
        "debit card",
        "upi",
        "transaction"
    ];

    for (const word of bankingWords) {
        if (containsKeyword(message, word)) {
            riskScore += 10;

            reasons.push(`Banking-related term detected: ${word}`);

            if (!categories.includes("Banking Scam")) {
                categories.push("Banking Scam");
            }
        }
    }

    // =========================
    // OTP / CREDENTIAL SCAM
    // =========================

    const credentialWords = [
        "otp",
        "password",
        "pin",
        "cvv",
        "verification code"
    ];

    for (const word of credentialWords) {
        if (containsKeyword(message, word)) {
            riskScore += 25;

            reasons.push(`Sensitive information requested: ${word}`);

            if (!categories.includes("Credential Scam")) {
                categories.push("Credential Scam");
            }
        }
    }

    // =========================
    // PRIZE SCAM
    // =========================

    const prizeWords = [
        "winner",
        "won",
        "lottery",
        "prize",
        "reward",
        "congratulations"
    ];

    for (const word of prizeWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Possible prize scam indicator: ${word}`);

            if (!categories.includes("Prize Scam")) {
                categories.push("Prize Scam");
            }
        }
    }

    // =========================
    // JOB SCAM
    // =========================

    const jobWords = [
        "work from home",
        "easy money",
        "earn daily",
        "job offer",
        "registration fee",
        "part time job"
    ];

    for (const word of jobWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Possible job scam indicator: ${word}`);

            if (!categories.includes("Job Scam")) {
                categories.push("Job Scam");
            }
        }
    }

    // =========================
    // LOAN SCAM
    // =========================

    const loanWords = [
        "instant loan",
        "loan approved",
        "low interest loan",
        "processing fee",
        "loan offer"
    ];

    for (const word of loanWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Possible loan scam indicator: ${word}`);

            if (!categories.includes("Loan Scam")) {
                categories.push("Loan Scam");
            }
        }
    }

    // =========================
    // URGENCY SCAM
    // =========================

    const urgencyWords = [
        "urgent",
        "immediately",
        "act now",
        "click now",
        "last chance",
        "account will be blocked"
    ];

    for (const word of urgencyWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Urgency or pressure detected: ${word}`);

            if (!categories.includes("Urgency Scam")) {
                categories.push("Urgency Scam");
            }
        }
    }

    // =========================
    // INVESTMENT SCAM
    // =========================

    const investmentWords = [
        "guaranteed profit",
        "double your money",
        "investment",
        "crypto",
        "bitcoin",
        "risk free"
    ];

    for (const word of investmentWords) {
        if (containsKeyword(message, word)) {
            riskScore += 20;

            reasons.push(`Possible investment scam indicator: ${word}`);

            if (!categories.includes("Investment Scam")) {
                categories.push("Investment Scam");
            }
        }
    }

    // =========================
    // PHISHING SCAM
    // =========================

    const phishingWords = [
        "click the link",
        "verify your account",
        "confirm your account",
        "login immediately",
        "account suspended"
    ];

    for (const word of phishingWords) {
        if (containsKeyword(message, word)) {
            riskScore += 15;

            reasons.push(`Possible phishing indicator: ${word}`);

            if (!categories.includes("Phishing Scam")) {
                categories.push("Phishing Scam");
            }
        }
    }

    // =========================
    // URL ANALYSIS
    // =========================

    const urlPattern = /(https?:\/\/[^\s]+)/gi;

    const urls = message.match(urlPattern);

    if (urls) {
        reasons.push("Message contains a URL");

        for (const url of urls) {
            const urlResult = analyzeURL(url);

            riskScore += urlResult.score;
            reasons.push(...urlResult.reasons);
        }
    }

    // =========================
    // LIMIT SCORE TO 100
    // =========================

    if (riskScore > 100) {
        riskScore = 100;
    }

    // =========================
    // DETERMINE RISK LEVEL
    // =========================

    let riskLevel;

    if (riskScore >= 70) {
        riskLevel = "HIGH";
    } else if (riskScore >= 30) {
        riskLevel = "MEDIUM";
    } else {
        riskLevel = "LOW";
    }

    // =========================
    // RETURN RESULT
    // =========================

    return {
        riskScore: riskScore,
        riskLevel: riskLevel,
        categories: categories,
        reasons: reasons
    };
}

module.exports = analyzeMessage;