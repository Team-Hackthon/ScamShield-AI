function analyzeURL(url) {

    let score = 0;
    let reasons = [];

    // Convert URL to lowercase for checking
    const lowerURL = url.toLowerCase();


    // =========================
    // HTTP INSTEAD OF HTTPS
    // =========================

    if (lowerURL.startsWith("http://")) {

        score += 10;

        reasons.push("URL does not use HTTPS");

    }


    // =========================
    // IP ADDRESS INSTEAD OF DOMAIN
    // =========================

    const ipPattern = /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/;

    if (ipPattern.test(lowerURL)) {

        score += 25;

        reasons.push("URL uses an IP address instead of a domain");

    }


    // =========================
    // SUSPICIOUS WORDS
    // =========================

    const suspiciousWords = [
        "login",
        "verify",
        "account",
        "secure",
        "update",
        "claim",
        "free",
        "bonus",
        "winner",
        "password",
        "otp",
        "banking"
    ];

    for (const word of suspiciousWords) {

        if (lowerURL.includes(word)) {

            score += 5;

            reasons.push(`Suspicious URL term detected: ${word}`);

        }
    }


    // =========================
    // VERY LONG URL
    // =========================

    if (url.length > 100) {

        score += 10;

        reasons.push("URL is unusually long");

    }


    // =========================
    // MANY SUBDOMAINS
    // =========================

    try {

        const hostname = new URL(url).hostname;

        const parts = hostname.split(".");

        if (parts.length >= 4) {

            score += 10;

            reasons.push("URL contains many subdomains");

        }

    } catch {

        score += 20;

        reasons.push("Invalid or suspicious URL format");

    }


    // =========================
    // SUSPICIOUS CHARACTERS
    // =========================

    if (url.includes("@")) {

        score += 15;

        reasons.push("URL contains @ symbol, which can hide the real destination");

    }


    // =========================
    // EXCESSIVE HYPHENS
    // =========================

    const hostname = (() => {
        try {
            return new URL(url).hostname;
        } catch {
            return "";
        }
    })();

    const hyphenCount = (hostname.match(/-/g) || []).length;

    if (hyphenCount >= 3) {

        score += 10;

        reasons.push("Domain contains an unusually high number of hyphens");

    }


    // =========================
    // LIMIT URL SCORE
    // =========================

    if (score > 50) {
        score = 50;
    }


    // =========================
    // RETURN RESULT
    // =========================

    return {
        score: score,
        reasons: reasons
    };

}


module.exports = analyzeURL;