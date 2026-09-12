import { useRef, useState } from 'react';
import AnalysisResult from './AnalysisResult.jsx';

export default function EmailAnalyzer() {
  const [raw, setRaw] = useState('');
  const [file, setFile] = useState(null);
  const [useAI, setUseAI] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInput = useRef(null);
  const reset = () => { setRaw(''); setFile(null); setResult(null); setError(''); };
  async function submit(event) {
    event.preventDefault(); setError('');
    if (!file && !raw.trim()) { setError('Paste a raw email or choose an .eml file.'); return; }
    if ((file?.size || new Blob([raw]).size) > 1048576) { setError('Maximum email size is 1 MiB.'); return; }
    setBusy(true);
    try {
      const base = (import.meta.env.VITE_API_BASE_URL || 'https://scamshield-ai-0uij.onrender.com').replace(/\/$/, '');
      const response = await fetch(`${base}/analyze/email?useAI=${useAI}`, {
        method: 'POST', headers: { 'Content-Type': file ? 'message/rfc822' : 'application/json' },
        body: file || JSON.stringify({ rawEmail: raw, useAI }), signal: AbortSignal.timeout(60000)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Email analysis failed.');
      setResult(data);
    } catch (failure) { setError(failure.message || 'Unable to connect to the backend.'); }
    finally { setBusy(false); }
  }
  if (result) return <AnalysisResult result={result} onReset={reset} />;
  return <form className="analyzer-card email-analysis" onSubmit={submit}>
    <h2>Email forensics · Phase 1</h2>
    <p>Paste the original email source including headers, or upload an .eml file (up to 1 MiB).</p>
    <label htmlFor="eml-upload">Upload email</label>
    <input ref={fileInput} id="eml-upload" type="file" accept=".eml,message/rfc822" disabled={busy} onChange={event => {
      const chosen = event.target.files[0]; setError(''); setFile(null);
      if (!chosen) return;
      if (!/\.eml$/i.test(chosen.name) || chosen.size > 1048576) { setError('Choose an .eml file up to 1 MiB.'); event.target.value = ''; return; }
      setFile(chosen); setRaw('');
    }} />
    {file && <p>{file.name} · {file.size.toLocaleString()} bytes <button type="button" disabled={busy} onClick={() => { setFile(null); fileInput.current.value = ''; }}>Remove file</button></p>}
    <label htmlFor="raw-email">Raw email</label>
    <textarea id="raw-email" rows={12} disabled={busy || !!file} value={raw} onChange={e => setRaw(e.target.value)} placeholder={'From: sender@example.com\nTo: recipient@example.org\nSubject: Example\n\nEmail body'} />
    <label><input type="checkbox" checked={useAI} disabled={busy} onChange={e => setUseAI(e.target.checked)} /> Include AI analysis (shares subject and body excerpts with the configured AI provider)</label>
    <p>Header authentication claims are unverified. Attachments are not scanned.</p>
    {error && <p role="alert">{error}</p>}
    <button className="analyze-button" disabled={busy} type="submit">{busy ? 'Analyzing email…' : 'Analyze email'}</button>
  </form>;
}
