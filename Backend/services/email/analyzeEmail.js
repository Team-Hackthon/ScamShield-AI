const { parseEmail } = require('./parseEmail');
const analyzeAuthentication = require('./authentication');
const extractIocs = require('./extractIocs');

async function analyzeEmail(input) {
    const mail = await parseEmail(input);
    const findings = [];
    const add = (code, points, reason) => findings.push({ code, points, reason, confidence: 'heuristic' });
    const domain = address => address?.split('@')[1]?.toLowerCase();
    if (mail.from.length !== 1 || mail.headers.filter(h => h.name === 'from').length !== 1) add('ambiguous_sender', 15, 'Missing or multiple From identities; sender needs review.');
    if (mail.replyTo.some(a => domain(a.address) && domain(mail.from[0]?.address) && domain(a.address) !== domain(mail.from[0].address))) {
        add('reply_to_mismatch', 10, 'Reply-To domain differs from From. This can be legitimate; verify the reply destination.');
    }
    const returnPath = mail.headers.filter(h => h.name === 'return-path').map(h => h.value);
    const iocs = extractIocs(mail);
    const urls = iocs.filter(i => i.type === 'url').map(i => i.value);
    const warnings = ['Indicators are observed values, not confirmed malicious infrastructure or sender identity.', 'Attachments are listed but their contents are not scanned.'];
    const fullContent = [mail.subject, mail.text].join('\n');
    if (fullContent.length > 20000) warnings.push('Content analysis is limited to the first 20,000 characters; IOC extraction covers the decoded body and headers.');
    if (urls.length > 100) warnings.push('URL risk analysis is limited to the first 100 unique URLs.');
    // MIME alternatives often repeat URLs. Feed each URL to the legacy scorer once.
    const content = fullContent.slice(0, 20000).replace(/https?:\/\/[^\s<>"']+/gi, '') + '\n' + urls.slice(0, 100).join('\n');
    const { text, html, ...metadata } = mail;
    return { content, email: { ...metadata, returnPath, authentication: analyzeAuthentication(mail.headers), iocs, findings,
        riskScore: Math.min(30, findings.reduce((total, f) => total + f.points, 0)), warnings } };
}
module.exports = analyzeEmail;
