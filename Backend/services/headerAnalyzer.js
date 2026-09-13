function getDomainFromEmail(email = "") {
  const match = email.match(/@([A-Z0-9.-]+\.[A-Z]{2,})/i);
  return match ? match[1].toLowerCase() : null;
}

function analyzeHeaders(parsedEmail) {
  const fromDomain = getDomainFromEmail(parsedEmail.from);
  const replyToDomain = getDomainFromEmail(parsedEmail.replyTo);

  const reasons = [];
  let score = 0;

  if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
    score += 25;

    reasons.push(
      `Sender domain (${fromDomain}) does not match Reply-To domain (${replyToDomain})`
    );
  }

  if (!parsedEmail.messageId) {
    score += 5;
    reasons.push("Message-ID is missing");
  }

  if (!parsedEmail.from) {
    score += 20;
    reasons.push("From header is missing");
  }

  return {
    score,
    fromDomain,
    replyToDomain,
    suspicious: score > 0,
    reasons,
  };
}

module.exports = {
  analyzeHeaders,
};
