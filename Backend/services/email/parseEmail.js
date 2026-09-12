const { simpleParser } = require('mailparser');
const { convert } = require('html-to-text');
const MAX_EMAIL_BYTES = 1024 * 1024;

async function parseEmail(input) {
    if (!(typeof input === 'string' || Buffer.isBuffer(input)) || !input.length) {
        throw Object.assign(new Error('Raw email is required.'), { status: 400 });
    }
    if (Buffer.byteLength(input) > MAX_EMAIL_BYTES) {
        throw Object.assign(new Error('Email exceeds the 1 MiB limit.'), { status: 413 });
    }
    const raw = input.toString();
    const boundary = raw.search(/\r?\n\r?\n/);
    if (boundary < 0 || !/^[\w-]+:/m.test(raw.slice(0, boundary))) {
        throw Object.assign(new Error('Paste a complete raw email with headers, a blank line, and body.'), { status: 400 });
    }
    if (boundary > 65536) throw Object.assign(new Error('Email headers exceed 64 KiB.'), { status: 413 });
    const mail = await simpleParser(input, { skipHtmlToText: false, skipTextToHtml: true, skipImageLinks: true, maxHtmlLengthToParse: MAX_EMAIL_BYTES });
    const headers = mail.headerLines.map(({ key, line }) => ({ name: key, value: line.slice(line.indexOf(':') + 1).replace(/\r?\n[ \t]+/g, ' ').trim() }));
    const addresses = field => (field?.value || []).flatMap(a => a.group || [a]).map(a => ({ name: a.name || '', address: a.address || '' }));
    return { headers, subject: mail.subject || '', from: addresses(mail.from), to: addresses(mail.to), replyTo: addresses(mail.replyTo),
        date: mail.date?.toISOString() || null, messageId: mail.messageId || null,
        text: [mail.text || '', mail.html ? convert(mail.html, { wordwrap: false, limits: { maxInputLength: MAX_EMAIL_BYTES } }) : ''].filter(Boolean).join('\n'), html: mail.html || '',
        attachments: mail.attachments.map(a => ({ filename: a.filename || '(unnamed)', contentType: a.contentType, size: a.size, scanned: false })) };
}
module.exports = { parseEmail, MAX_EMAIL_BYTES };
