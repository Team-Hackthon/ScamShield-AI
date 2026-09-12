const { test } = require('node:test');
const assert = require('node:assert/strict');
const analyzeEmail = require('../services/email/analyzeEmail');
const score = require('../services/finalRiskEngine');
const rules = require('../services/scamDetector');
const app = require('../server');
// Keep regression tests offline even when a developer has configured a real key.
process.env.OPENAI_API_KEY = '';
const benign = 'From: Alice <alice@example.com>\r\nTo: bob@example.org\r\nSubject: Meeting\r\n\r\nSee you tomorrow.';

test('parses folded and repeated headers, addresses and untrusted authentication', async () => {
  const raw = benign.replace('Subject: Meeting', 'Subject: Meeting\r\n tomorrow\r\nReceived: from mx.example.com [192.0.2.1]\r\nReceived: from [2001:db8::1]\r\nAuthentication-Results: attacker; spf=pass; dkim=pass; dmarc=fail\r\nAuthentication-Results: other; spf=fail');
  const { email } = await analyzeEmail(raw);
  assert.equal(email.headers.filter(h => h.name === 'received').length, 2);
  assert.equal(email.authentication.spf.status, 'not_verified');
  assert.equal(email.authentication.spf.reportedResults.length, 2);
  assert.equal(email.riskScore, 0);
  assert.ok(email.iocs.some(i => i.value === '2001:db8::1'));
  assert.ok(email.subject.includes('tomorrow'));
});
test('decodes MIME, HTML URLs, encoded subject and attachment metadata', async () => {
  const raw = 'From: a@example.org\nSubject: =?UTF-8?B?VGVzdA==?=\nMIME-Version: 1.0\nContent-Type: multipart/mixed; boundary=x\n\n--x\nContent-Type: text/html; charset=utf-8\nContent-Transfer-Encoding: base64\n\n' + Buffer.from('<p>Verify your account <a href="https://evil.example/login">here</a></p>').toString('base64') + '\n--x\nContent-Type: application/octet-stream\nContent-Disposition: attachment; filename="sample.bin"\nContent-Transfer-Encoding: base64\n\nYWJj\n--x--';
  const { email, content } = await analyzeEmail(Buffer.from(raw));
  assert.equal(email.subject, 'Test'); assert.match(content, /Verify your account/);
  assert.ok(email.iocs.some(i => i.value === 'https://evil.example/login'));
  assert.equal(email.attachments[0].size, 3); assert.equal(email.attachments[0].scanned, false);
  assert.equal(email.html, undefined); assert.equal(email.attachments[0].content, undefined);
});
test('rejects invalid and oversized input', async () => {
  for (const value of [undefined, {}, '', 'just a message']) await assert.rejects(analyzeEmail(value), e => e.status === 400);
  await assert.rejects(analyzeEmail('x'.repeat(1048577)), e => e.status === 413);
});
test('sender heuristics feed final engine without changing legacy weighting', async () => {
  const { email } = await analyzeEmail(benign.replace('To:', 'Reply-To: attacker@other.example\r\nTo:'));
  assert.equal(email.riskScore, 10);
  assert.equal(score({ riskScore: 50 }, { riskScore: 80 }).riskScore, 68);
  assert.equal(score({ riskScore: 50 }, null, email).riskScore, 60);
  assert.equal(score({ riskScore: 99 }, null, email).riskScore, 100);
});
test('HTTP: JSON and binary email, error responses, message and URL regression', async t => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function post(path, body, type = 'application/json') {
    return fetch(base + path, { method: 'POST', headers: { 'Content-Type': type }, body: type === 'application/json' ? JSON.stringify(body) : body });
  }
  const json = await post('/analyze/email', { rawEmail: benign });
  assert.equal(json.status, 200); const result = await json.json(); assert.equal(result.aiAvailable, false);
  const upload = await post('/analyze/email', benign, 'message/rfc822');
  assert.equal(upload.status, 200); assert.deepEqual((await upload.json()).email, result.email);
  assert.equal((await post('/analyze/email', { rawEmail: 'invalid' })).status, 400);
  assert.equal((await post('/analyze/email', { rawEmail: 'x'.repeat(1048577) })).status, 413);
  assert.equal((await post('/analyze/email', 'x'.repeat(1048577), 'message/rfc822')).status, 413);
  for (const message of ['Hello friend', 'Urgent! Share your OTP and password immediately.', 'https://suspicious.xyz/login']) {
    const response = await post('/analyze', { message }); const data = await response.json();
    assert.equal(response.status, 200); assert.equal(data.riskScore, rules(message.toLowerCase()).riskScore);
  }
  assert.equal((await post('/analyze', {})).status, 400);
});
