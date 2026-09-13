function extractIOCs(text = "") {
  const urlRegex = /https?:\/\/[^\s<>"']+/gi;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const ipRegex =
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

  const urls = text.match(urlRegex) || [];
  const emails = text.match(emailRegex) || [];
  const ips = text.match(ipRegex) || [];

  const domains = urls
    .map((url) => {
      try {
        return new URL(url).hostname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return {
    urls: [...new Set(urls)],
    emails: [...new Set(emails)],
    ips: [...new Set(ips)],
    domains: [...new Set(domains)],
  };
}

module.exports = {
  extractIOCs,
};