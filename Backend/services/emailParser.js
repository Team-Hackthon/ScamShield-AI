const { simpleParser } = require("mailparser");

async function parseEmail(rawEmail) {
  const parsed = await simpleParser(rawEmail);

  return {
    from: parsed.from?.text || null,
    to: parsed.to?.text || null,
    replyTo: parsed.replyTo?.text || null,

    subject: parsed.subject || null,
    date: parsed.date || null,
    messageId: parsed.messageId || null,

    text: parsed.text || "",

    attachments: parsed.attachments.map((attachment) => ({
      filename: attachment.filename || "Unnamed attachment",
      contentType: attachment.contentType,
      size: attachment.size,
    })),
  };
}

module.exports = { parseEmail };
  
