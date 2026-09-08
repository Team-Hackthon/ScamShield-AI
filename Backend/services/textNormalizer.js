function normalizeText(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text
    // Convert compatibility Unicode characters
    .normalize("NFKC")

    // Remove zero-width / invisible characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "")

    // Normalize extra spaces
    .replace(/\s+/g, " ")

    .trim();
}


// Detect attempts to hide or obfuscate text
function detectTextObfuscation(text) {
  if (typeof text !== "string") {
    return {
      suspicious: false,
      score: 0,
      reasons: [],
    };
  }

  const reasons = [];
  let score = 0;


  // 1. Zero-width characters
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/;

  if (zeroWidthRegex.test(text)) {
    reasons.push(
      "Hidden or zero-width Unicode characters detected"
    );

    score += 15;
  }


  // 2. Mixed Latin + Cyrillic characters
  const hasLatin = /\p{Script=Latin}/u.test(text);
  const hasCyrillic = /\p{Script=Cyrillic}/u.test(text);

  if (hasLatin && hasCyrillic) {
    reasons.push(
      "Mixed Latin and Cyrillic characters detected"
    );

    score += 20;
  }


  // 3. Mixed Latin + Greek characters
  const hasGreek = /\p{Script=Greek}/u.test(text);

  if (hasLatin && hasGreek) {
    reasons.push(
      "Mixed Latin and Greek characters detected"
    );

    score += 20;
  }


  // 4. Compatibility / unusual Unicode formatting
  const normalizedVersion = text.normalize("NFKC");

  if (normalizedVersion !== text) {
    reasons.push(
      "Unusual Unicode formatting detected"
    );

    score += 10;
  }


  // Prevent this module alone from creating an excessive score
  score = Math.min(score, 30);


  return {
    suspicious: reasons.length > 0,
    score,
    reasons,
  };
}


// Keep existing normalizeText import working
module.exports = normalizeText;

// Also expose detection function
module.exports.detectTextObfuscation = detectTextObfuscation;