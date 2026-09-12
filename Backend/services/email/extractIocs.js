const { isIP } = require('node:net');
function extractIocs(mail) {
    const values = new Map();
    function add(type, value, source) {
        const key = `${type}:${value}`;
        if (!values.has(key)) values.set(key, { type, value, sources: [] });
        const item = values.get(key);
        if (!item.sources.includes(source)) item.sources.push(source);
    }
    const texts = [...mail.headers.map(h => [h.value, `header:${h.name}`]), [mail.text, 'body:text'], [mail.html, 'body:html']];
    for (const [text, source] of texts) {
        for (const candidate of text.match(/https?:\/\/[^\s<>"']+/gi) || []) {
            try {
                const url = new URL(candidate.replace(/&amp;/gi, '&').replace(/[.,;!?)}\]]+$/, ''));
                add('url', url.href, source);
                const host = url.hostname.replace(/^\[|\]$/g, '');
                add(isIP(host) ? 'ip' : 'domain', host, source);
            } catch { /* Invalid URL candidates are not indicators. */ }
        }
        for (const address of text.match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?/gi) || []) {
            add('email', address, source); add('domain', address.split('@')[1].toLowerCase(), source);
        }
        for (const token of text.replace(/IPv6:/gi, '').match(/[a-f0-9:.]+/gi) || []) {
            const ip = token.replace(/^IPv6:/i, '').replace(/^[.]|[.]$/g, '');
            if (isIP(ip)) add('ip', ip.toLowerCase(), source);
        }
        for (const domain of text.match(/\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}\b/gi) || []) add('domain', domain.toLowerCase(), source);
    }
    return [...values.values()];
}
module.exports = extractIocs;
