function normalizeText(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text
    // Unicode normalization
    .normalize("NFKC")

    // Remove zero-width/invisible characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "")

    // Replace repeated whitespace with one space
    .replace(/\s+/g, " ")

    .trim();
}

module.exports = normalizeText;