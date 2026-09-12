function analyzeAuthentication(headers) {
    const records = headers.filter(h => h.name === 'authentication-results');
    const result = {};
    for (const method of ['spf', 'dkim', 'dmarc']) {
        const claims = records.flatMap(record => [...record.value.matchAll(new RegExp('(?:^|;)\\s*' + method + '(?:/\\d+)?\\s*=\\s*([a-z]+)\\b', 'gi'))]
            .map(match => ({ result: match[1].toLowerCase(), source: record.value })));
        result[method] = { status: 'not_verified', reportedResults: claims, summary: claims.length ? [...new Set(claims.map(c => c.result))].join(', ') : 'not_reported' };
    }
    return { ...result, dkimSignaturePresent: headers.some(h => h.name === 'dkim-signature'),
        note: 'Header claims are untrusted. No live SPF, DKIM or DMARC verification was performed. Missing headers do not establish failure; reported pass does not establish safety.' };
}
module.exports = analyzeAuthentication;
