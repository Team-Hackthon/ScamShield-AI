export default function EmailDetails({ email }) {
  return <div className="email-details">
    <section className="info-card"><h2>Email evidence</h2>
      <p><strong>Subject:</strong> {email.subject || '(none)'}</p>
      <p><strong>From:</strong> {email.from.map(a => `${a.name} <${a.address}>`).join(', ') || 'Missing'}</p>
      <p><strong>Reply-To:</strong> {email.replyTo.map(a => a.address).join(', ') || 'Not provided'}</p>
      <p><strong>Return-Path:</strong> {email.returnPath.join(', ') || 'Not provided'}</p>
      <p><strong>Date:</strong> {email.date || 'Not provided'}</p>
      <p>Sender heuristics add {email.riskScore} points before the final score is capped at 100.</p>
      {email.warnings.map(w => <p key={w}>{w}</p>)}
    </section>
    <section className="info-card"><h2>Sender authentication</h2>
      {['spf', 'dkim', 'dmarc'].map(method => <p key={method}><strong>{method.toUpperCase()}</strong>: {email.authentication[method].summary} · not verified</p>)}
      <p>{email.authentication.note}</p>
    </section>
    <section className="info-card"><h2>Observed indicators ({email.iocs.length})</h2>
      <p>Values are shown as text so suspicious links cannot be opened accidentally.</p>
      {email.iocs.length === 0 && <p>No supported indicators extracted.</p>}
      <div className="evidence-scroll"><table><thead><tr><th>Type</th><th>Value</th><th>Observed in</th></tr></thead>
      <tbody>{email.iocs.map(i => <tr key={`${i.type}:${i.value}`}><td>{i.type}</td><td>{i.value}</td><td>{i.sources.join(', ')}</td></tr>)}</tbody></table></div>
    </section>
    <details className="info-card"><summary>Parsed headers ({email.headers.length})</summary><div className="evidence-scroll">{email.headers.map((h, i) => <p key={i}><strong>{h.name}:</strong> {h.value}</p>)}</div></details>
    <details className="info-card"><summary>Attachments ({email.attachments.length}) · not scanned</summary>{email.attachments.map((a, i) => <p key={i}>{a.filename} · {a.contentType} · {a.size} bytes</p>)}</details>
  </div>;
}
