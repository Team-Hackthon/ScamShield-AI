# ScamShield-AI 2.0 — Phase 1

The existing React/Vite frontend, Express backend, message rules, URL analyzer and 40% rules / 60% AI weighting are retained.

## Run locally

1. In Backend, run `npm ci`, then `npm start`. Optional configuration: `PORT` and `OPENAI_API_KEY` (see `.env.example`). Without an AI key, message analysis falls back to rules and email analysis remains available.
2. In Frontend, set `VITE_API_BASE_URL=http://localhost:3000` in `.env.local`, run `npm ci`, then `npm run dev`. Without this setting, the frontend uses the existing Render API.
3. Select **Email / .eml**, paste complete raw source or choose an `.eml` file. AI is optional and off by default for email.
4. Run `npm test` in Backend; run `npm run build` and `npm run lint` in Frontend.

Deploy the backend changes before deploying the new frontend. Existing deployments have not been changed by this implementation.

## API

`POST /analyze` still accepts `{ "message": "..." }` and retains its current response shape and AI-failure fallback.

`POST /analyze/email` accepts JSON `{ "rawEmail": "From: ...\r\n\r\nBody", "useAI": false }` or original file bytes with `Content-Type: message/rfc822` (also `application/octet-stream`). Binary uploads opt in to AI using `?useAI=true`. No multipart wrapper is required. Maximum raw email size: 1 MiB; header block: 64 KiB. Invalid input returns 400 and excessive size returns 413. Both routes share the existing rate limiter.

Email responses reuse riskScore/riskLevel/category/explanation/recommendation/reasons and add `email` evidence, `inputType`, `ruleBased` and AI availability.

## Modules and scoring

- `services/email/parseEmail.js`: MIME/charset/header decoding, ordered repeated headers, addresses and attachment metadata. Binary uploads retain original bytes through parsing.
- `services/email/authentication.js`: SPF/DKIM/DMARC claims from Authentication-Results, including conflicting records; signature-presence metadata. Every claim remains not_verified.
- `services/email/extractIocs.js`: deduplicated candidate URLs, email addresses, domains and IPv4/IPv6 addresses with header/body provenance. Extraction is heuristic; domain-like filenames can be candidates. Indicators do not establish maliciousness.
- `services/email/analyzeEmail.js`: sender heuristics, warnings and content passed into existing rules. Ambiguous From adds 15 points; a different Reply-To domain adds 10. These are review signals, not proof of spoofing. Return-Path is displayed without penalizing normal bounce-domain differences.
- `routes/email.js`: bounded input, optional AI, fallback and response assembly.
- `finalRiskEngine.js`: existing weighting is unchanged when called without email findings. Email points are added to the content score and capped at 100. With AI unavailable, the content score is the rule score.
- `EmailAnalyzer.jsx` / `EmailDetails.jsx`: raw/file input and evidence display; suspicious HTML is never rendered and extracted URLs are plain text. API base URL is configurable for both input modes.

## Limits and trust

No live SPF evaluation, DKIM cryptographic verification or DMARC alignment evaluation is implemented in this scaffold. Authentication-Results is untrusted uploaded content; pass/fail claims and missing claims do not change scoring. A signature's presence is not validation. Future verification must explicitly establish trusted receipt context rather than trusting an uploaded authserv-id.

No remote URLs are fetched. There is no VPN detection, geolocation, exact-sender attribution or attachment malware scan. Nested attached messages and binary attachment contents are outside body analysis. Content scoring uses the first 20,000 decoded characters and up to 100 distinct URLs; IOC extraction covers decoded top-level body and headers. Truncation is disclosed. Raw source and attachments are not saved by the new route. Email AI opt-in sends a bounded excerpt to the existing configured provider. Message AI behavior is preserved.

Evidence may contain personal information. Results are displayed in the browser as text; the new email route does not log content or provider failures.

## Verification

Backend automated tests cover MIME/base64 decoding, HTML-only body analysis, folded/repeated headers, untrusted authentication claims, IPv6, attachment metadata, malformed/oversized input, sender score contributions, JSON/binary HTTP equivalence, and message/URL regressions without an AI key. Frontend production build and lint pass. No live AI service or browser interaction test was performed.

References: https://nodemailer.com/extras/mailparser and https://www.rfc-editor.org/rfc/rfc8601.html
