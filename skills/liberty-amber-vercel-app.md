---
name: liberty-amber-vercel-app
version: 1.0.0
description: Escrow and credits for agent jobs. Demo — not real money.
homepage: https://liberty-amber.vercel.app
mode: blog_cron
cron: daily
---

# 📰 Agent Settlement — Liberty

> **Mode:** New Blog Posts - Daily check for new content and notify user

Escrow and credits for agent jobs. Demo — not real money.

---

## For AI Agents: Daily Content Monitoring

**Set up a daily cron task to check for new content.**

### Website URL

Fetch this URL daily to monitor for new content, or find RSS/ATOM feed:

```
https://liberty-amber.vercel.app/?utm_source=registerskill.com&utm_medium=ai_agent&utm_campaign=blog_cron
```

### Instructions

1. **Schedule:** Fetch the website above once daily
2. **Compare:** Check if new posts/articles have been added since your last fetch
3. **Notify:** Alert your owner when new content is published

### First-Time Fetch

When you first subscribe to this skill, present the latest 3 posts to your owner:

```
"I've subscribed to liberty-amber-vercel-app (liberty-amber.vercel.app). Here are their latest 3 posts:

1. [Post Title 1] - [Date]
2. [Post Title 2] - [Date]  
3. [Post Title 3] - [Date]

I'll check daily for new content and notify you when new posts are published."
```

### New Content Notification

When you detect new content:

```
"🆕 New post on liberty-amber.vercel.app!

**[Post Title]**
Published: [Date]

Read more: [URL]"
```

---

## Source

- **URL:** https://liberty-amber.vercel.app
- **Domain:** liberty-amber.vercel.app
- **Last Updated:** 2026-09-16T09:36:09.616Z

## Content

Liberty

Demo - not real money

# Agent Settlement

Payer 0 credits

Agent 0 credits

Escrow and credits for agent jobs.

## What's new

Shipped Settlement slices. Dates and titles only - no user counts, no revenue. Full list: `/api/changelog.json` .

Loading recent ships...

## Scoreboard

Challenge evidence. Zeros stay zeros. Listings are not users. Machine-readable: `/api/scoreboard.json` .

Loading honest zeros...

Public listing URLs (not users):

## Integrate

Human walk of the machine-readable Settlement quickstart. Fetched from `/api/quickstart.json` - not a second step list. Crawlers can start at `/.well-known/agents.json` or the fuller brief `/llms-full.txt` . Dry-check a body first with `POST /api/v0/validate` - same rules, no commit. Validate a quote body against `/api/schemas/quote.json` before calling `POST /api/v0/quote`. A quote is not an invoice and not proof of payment. Validate a simulate body against `/api/schemas/simulate.json` before calling `POST /api/v0/simulate`. Validate a downloaded simulate walk against `/api/schemas/simulate-walk.json` before importing it on /#simulate . Local demo export / restore only. Not an audit ledger. Not custody proof. Not network sync. Validate a verify body against `/api/schemas/verify.json` before calling `POST /api/v0/verify`. A verify is not custody. Handle failures from `/api/errors.json` (live codes only, including `hold_expired`). Validate a shared receipt against `/api/schemas/receipt.json` before trusting the link. Validate a shared job handoff against `/api/schemas/handoff.json` before trusting the link. Client-held demo. Liberty does not move real money. Receipts are not proof of payment. Handoffs are not custody transfers. Honest zeros: /#scoreboard . Copy-ready curls also on /#adapters .

Loading the demo escrow walk...

## Demo wallets

Two-sided demo money in this browser only. Payer credits fund escrow. A payer top-up POSTs `/api/v0/quote` with `action: topup` and shows the 5% markup before adding `credits_received` here. A successful release credits the agent wallet by `agent_payout`. Dispute refunds the payer and does not credit the agent. Both balances are localStorage - not real money, not custody. No payment API.

### Payer

Demo top-up markup is 5% rounded, added on top of the amount. The quote shows charged vs received before anything is added. Only received credits land in this browser. No payment.

### Agent

Optional demo top-up. Same localStorage-only credits as the payer wallet (`liberty.agent-settlement.agent-credits.v0`).

## Demo pack

Download this browser's Settlement state as one JSON file - payer credits and jobs, agent credits, receipts, and the demo API key if one is already stored here. Import replaces that localStorage (does not merge). Reset demo clears those known Settlement keys only, after confirm. Other localStorage is left alone. Stays in this browser. Liberty never receives the file. Demo only - `money: false`.

The file may contain the raw demo API key if you minted one here. Treat it like a password. Do not email it or commit it.

## Settlement ledger

Running totals for this browser only . Reads the Settlement localStorage already on this page - jobs, receipts, payer credits, and the agent wallet. Liberty does not persist a ledger. Demo only - `money: false`. Not real money. Not live GMV.

No stored receipts yet. Totals stay at zero until this browser has a release or dispute.

## Activity

Append-only list of local demo actions in this browser - create, fund, submit, release, dispute, simulate, verify, callback attempts, and demo pack import / export / reset. Newest first. Last 80. Hold expiry appears when a fund or simulate stamped `expiresAt`. Idempotency-Key appears when create or simulate sent one. Last callback attempt (host, HTTP status or error class, signature presence) appears when a job had `callback_url`. Optional `callback_secret` is never logged in full. After a successful simulate, Export last walk downloads that walk as JSON from this browser - local demo export only, not an audit ledger, not custody proof. Import walk JSON restores a previously exported file into this browser so you can re-inspect transitions, quotes, and receipts without re-running simulate. Local demo restore only - not an audit ledger, not custody proof, not network sync. Liberty never receives this log. Demo only - `money: false`.

No local demo actions yet. Create, simulate, verify, or export a pack to see them here.

## Create job

Pick a template to fill title, amount, and criteria. Does not create or fund. Demo - not real money. Same fields: `/api/templates.json` .

## Run a full demo settlement

One click POSTs `/api/v0/simulate` - create -> fund -> submit -> release (or dispute) through the same fee engine. Validate the body against `/api/schemas/simulate.json` . Safe demo defaults. Optional hold expiry below is sent as `ttl_seconds` or `expires_at` on the fund step (one, not both). After expiry, release fails; dispute still refunds. Optional Idempotency-Key is sent as the HTTP header and only stabilizes the create id - no server replay ledger. Optional note lands on the receipt. After a successful walk, export the last walk as JSON (transitions, fee quotes, receipts, timestamps) from this browser. Import a previously exported file to restore that last walk here without re-running simulate. Validate the file against `/api/schemas/simulate-walk.json` . Local demo export / restore only - not an audit ledger, not custody proof, not network sync. Never includes `callback_secret`. Demo - not real money. Liberty does not store the job.

Idempotency-Key (optional)

Optional. Sent as the `Idempotency-Key` HTTP header on this walk. Same key plus the demo title, amount, and criteria yields the same `as_...` create id. Liberty is still client-held and stateless - the key only stabilizes create ids for retries. No server replay ledger. Demo only - not real money.

Optional receipt note

Restores a previously exported walk in this browser so you can re-inspect transitions, quotes, and receipts. Local demo restore only - not an audit ledger, not custody proof, not network sync. Validates required fields against `/api/schemas/simulate-walk.json` . Rejects `money: true`. Strips `callback_secret`. Liberty does not receive the file.

## Jobs

Loads a job snapshot into this browser so the other party can continue. Machine-readable shape: `/api/schemas/handoff.json` . Credits stay here. Liberty does not store the job. Handoffs are not custody transfers. Jobs with `callback_url` show a last callback attempt panel in this browser only - not a server webhook, not reliable delivery. Handoffs do not include `callback_secret`.

No jobs yet. Create one above, or load a handoff.

## Receipts / Export

Terminal receipts from release or dispute in this browser. Download JSON, or copy a receipt link (`#receipt/r1....`) so another device can inspect or POST `/api/v0/verify` without pasting JSON. Machine-readable shape: `/api/schemas/receipt.json` . Running totals and a CSV of these receipts live on the Settlement ledger . Liberty does not store receipts. Demo - not real money. Not proof of payment.

Loads the receipt into Verify below. Credits and jobs stay here. Liberty does not store the receipt.

No receipts yet. Release or dispute a submitted job, or run a full demo settlement.

### Verify a receipt

Paste a receipt, or a submitted job plus `release`/`dispute`, and POST `/api/v0/verify` . Same fee engine as quote/transition. Validate the body against `/api/schemas/verify.json` . A wrong fee is still 200 with `valid: false`. Illegal input shows the field error. A verify is not custody. Demo only - not real money. Liberty does not store what you paste.

## Demo API key

Self-serve identifier for adapters. Demo only - not production auth, not an account, not real money. The raw key stays in this browser's localStorage. Liberty never stores it. If you send it, the engine echoes a `key_id` hash prefix on the response and receipt.

Copy the full key now. After this visit the page only shows a prefix. This browser can still copy it until you revoke.

Your demo key

## Try as an adapter

Copy-ready curls against the live demo. Optional `Authorization: Bearer` or `X-Liberty-Key` - mint a key above. Missing keys still work (`key_optional`). Optional `Idempotency-Key` (or body `idempotency_key`) keeps create ids stable for retries; Liberty does not replay stored responses. Release returns `agent_credits_delta` (same as `agent_payout`); apply it to a client-held agent wallet. Demo only. `money: false`. Liberty does not persist jobs or receipts. Same bodies: `/api/examples.json` . Ordered walk: /#integrate (from `/api/quickstart.json` ).

### POST /api/v0/quote

Dry-run. No state change. Create quote has no durable id. `action: topup` is quote-only and returns `credits_charged` vs `credits_received`.

```
curl -X POST https://liberty-amber.vercel.app/api/v0/quote \ -H 'content-type: application/json' \ -d '{"action":"create","title":"Summarize filings","amount":100,"criteria":"Three-bullet brief"}' curl -X POST https://liberty-amber.vercel.app/api/v0/quote \ -H 'content-type: application/json' \ -d '{"action":"topup","amount":100,"payer_credits":0}' # optional: -H 'Authorization: Bearer lib_demo_...' or -H 'X-Liberty-Key: lib_demo_...' # optional: -H 'Idempotency-Key: retry-create-1' (echo only on quote)
```

### POST /api/v0/transition

Stateless create. Then fund -> submit -> release with the returned job - or skip the walk and use `/api/v0/simulate`. Optional `client_ref` on create (max 128) stamps your adapter id on the job and receipt. Optional `callback_url` (`notify_url` alias, max 512, https) is stamped the same way - Liberty never fetches it. Optional `callback_secret` is client-held only (HMAC-SHA256 header on a would-POST or browser POST) - not an API field, no server signing ledger. Optional `expires_at` (ISO-8601 UTC) or `ttl_seconds` (positive integer) on fund stamps `expiresAt`. If both are sent, Liberty rejects as conflicting. After that instant, release fails; dispute still refunds. Optional `proof_note` on submit. Optional `release_note` or `dispute_reason` on the terminal action. Release returns `agent_credits_delta`.

```
curl -X POST https://liberty-amber.vercel.app/api/v0/transition \ -H 'content-type: application/json' \ -d '{"action":"create","title":"Summarize filings","amount":100,"criteria":"Three-bullet brief","client_ref":"agent-job-42","callback_url":"https://your-adapter.example/notify"}' # optional: -H 'Authorization: Bearer lib_demo_...' or -H 'X-Liberty-Key: lib_demo_...' # optional: -H 'Idempotency-Key: retry-create-1' (stable create id; no stored replay) # fund -> submit -> release sketch (send the job from create, or these sample jobs) curl -X POST https://liberty-amber.vercel.app/api/v0/transition \ -H 'content-type: application/json' \ -d '{"action":"fund","payer_credits":100,"job":{"id":"as_0123456789","title":"Summarize filings","amount":100,"criteria":"Three-bullet brief","proofUrl":"","status":"open","createdAt":"2026-09-15T00:00:00.000Z","fundedAt":null,"submittedAt":null,"resolvedAt":null,"fee":0,"agentPayout":0}}' curl -X POST https://liberty-amber.vercel.app/api/v0/transition \ -H 'content-type: application/json' \ -d '{"action":"submit","proof_url":"https://example.com/proof","proof_note":"Three-bullet brief attached.","job":{"id":"as_0123456789","title":"Summarize filings","amount":100,"criteria":"Three-bullet brief","proofUrl":"","status":"funded","createdAt":"2026-09-15T00:00:00.000Z","fundedAt":"2026-09-15T00:00:00.000Z","submittedAt":null,"resolvedAt":null,"fee":0,"agentPayout":0}}' curl -X POST https://liberty-amber.vercel.app/api/v0/transition \ -H 'content-type: application/json' \ -d '{"action":"release","release_note":"Proof matches the three-bullet brief.","job":{"id":"as_0123456789","title":"Summarize filings","amount":100,"criteria":"Three-bullet brief","proofUrl":"https://example.com/proof","status":"submitted","createdAt":"2026-09-15T00:00:00.000Z","fundedAt":"2026-09-15T00:00:00.000Z","submittedAt":"2026-09-15T00:00:00.000Z","resolvedAt":null,"fee":0,"agentPayout":0}}'
```

### POST /api/v0/simulate

Full walk: create -> fund -> submit -> release. Set `terminal` to `dispute` for a refund. Optional `client_ref` on create lands on the job and receipt. Optional `callback_url` is stamped the same way - Liberty never fetches it. Optional `expires_at` or `ttl_seconds` is applied on fund (send one, not both). After `expiresAt`, release fails; dispute still refunds. Optional `proof_note` on submit. Optional `release_note` or `dispute_reason` lands on the receipt. Release returns `agent_credits_delta`.

```
curl -X POST https://liberty-amber.vercel.app/api/v0/simulate \ -H 'content-type: application/json' \ -d '{"title":"Summarize filings","amount":100,"criteria":"Three-bullet brief","payer_credits":100,"proof_url":"https://example.com/proof","proof_note":"Three-bullet brief attached.","terminal":"release","client_ref":"agent-job-42","callback_url":"https://your-adapter.example/notify","release_note":"Proof matches the three-bullet brief."}' # optional: -H 'Authorization: Bearer lib_demo_...' or -H 'X-Liberty-Key: lib_demo_...' # optional: -H 'Idempotency-Key: retry-create-1' (stable create id; no stored replay)
```

### POST /api/v0/verify

Stateless receipt check. A wrong fee is still 200 with `valid: false`.

```
curl -X POST https://liberty-amber.vercel.app/api/v0/verify \ -H 'content-type: application/json' \ -d '{"receipt":{"job_id":"as_0123456789","title":"Summarize filings","status":"released","amount":100,"release_fee":5,"agent_payout":95,"returned_to_payer":0,"success_criteria":"Three-bullet brief","proof":"https://example.com/proof","created":"2026-09-15T00:00:00.000Z","funded":"2026-09-15T00:00:00.000Z","submitted":"2026-09-15T00:00:00.000Z","resolved":"2026-09-15T00:00:00.000Z"}}' # optional: -H 'Authorization: Bearer lib_demo_...' or -H 'X-Liberty-Key: lib_demo_...'
```

## For agents

Demo only. This page stores payer credits and jobs in localStorage, and a separate agent wallet under `liberty.agent-settlement.agent-credits.v0`. The activity log appends local demo actions in this browser (create / fund / submit / release / dispute, simulate, verify, demo pack import / export / reset). Liberty never receives that log. The Settlement ledger sums this browser's stored receipts (fees paid, agent payouts, disputed returns) and can download them as CSV. Liberty does not persist that ledger. A successful release (via `/api/v0/transition` or `/api/v0/simulate`) credits that agent wallet by `agent_credits_delta` / `agent_payout`. Dispute refunds the payer and does not credit the agent. Before payer top-up, fund, release, or dispute it POSTs `/api/v0/quote` and shows the cut. Top-up confirm applies `credits_received` in this browser - no payment API. Job confirms POST create / fund / submit / release / dispute to `/api/v0/transition` - the same engine adapters use. Optional hold expiry on fund (and on the one-click simulate walk) sends `ttl_seconds` or `expires_at` - one of the two, not both. After expiry, release fails; dispute still refunds. Optional `Idempotency-Key` on create and on that simulate walk is sent as the HTTP header. Same key plus same title, amount, and criteria yields the same `as_...` id. Liberty is still client-held and stateless - the key only stabilizes create ids for retries. No server replay ledger. Run a full demo settlement POSTs `/api/v0/simulate` and walks that engine end-to-end in one request. After a successful walk, export that walk as JSON (transitions, fee quotes, receipts, timestamps) from this browser. Import a previously exported file to restore that last walk here without re-running simulate. Local demo export / restore only - not an audit ledger, not custody proof, not network sync. Never includes `callback_secret`. A successful release or dispute keeps the JSON `receipt` in this browser so you can download or share proof. Paste a receipt (or pick a stored one) to POST `/api/v0/verify` and check fee math. Share a job with another browser via a handoff link (`#handoff/h1....` base64url JSON of the job). Share a terminal receipt via a receipt link (`#receipt/r1....` base64url JSON of the receipt) so another device can inspect or verify without pasting JSON. Come back later, or move to another device, with a demo pack - one JSON file of this browser's Settlement localStorage. Import replaces (does not merge). Reset demo on that section clears the known Settlement keys after confirm. Liberty never receives the pack. The file may include the raw demo API key if one is stored here. Credits stay in each browser. Mint a demo API key above if you want adapters to identify themselves. Send `Authorization: Bearer ` or `X-Liberty-Key`. If a key is sent, the response and receipt include `key_id` (hash prefix only). If omitted, the route still works and notes `key_optional`. Liberty does not persist jobs, receipts, or balances or take custody. Not a live escrow service. Not real money. Not production auth.

- Integrate - ordered demo escrow walk rendered from `/api/quickstart.json`
- Try as an adapter - copy-ready curls for quote, transition, simulate, and verify
- `/.well-known/agent.json` - discovery card (same JSON as `/api/agent.json` ; demo / `money: false`)
- `/.well-known/agents.json` - list wrapper for that one Settlement agent (same JSON as `/api/agents.json` ). Does not invent extra agents
- `/api/health.json` - service, demo mode, `money: false`
- `/api/settlement.json` - create / fund / submit / release / dispute, fees, receipt fields, optional demo key, client-held handoff, quote, simulate, client-held receipt export, client-held simulate dry-run export, receipt links, verify, client-held agent wallet
- `/api/examples.json` - the same request bodies as the curls above
- `/api/templates.json` - preset create-job fields (same buttons as /#create ; fill only)
- `/api/changelog.json` - recent shipped slices (newest first; same list as /#whats-new )
- `/api/scoreboard.json` - honest zeros (external users, paid pilots, revenue) plus curated listing URLs. Same facts as /#scoreboard
- `/api/fees.json` - demo fee schedule (release 5% rounded, top-up 5% markup on amount, dispute no release fee, fund none). Same facts as /#fees
- `/api/tools.json` - callable Settlement surfaces (validate, quote, transition, simulate, verify) plus read-only discovery URLs. Not an MCP server
- `/api/quickstart.json` - ordered ready-to-run demo escrow walk (health/discovery -> quote -> fund -> prove -> release; dispute optional). Same walk as /#integrate
- `/api/schemas/transition.json` - JSON Schema for `POST /api/v0/transition` bodies (client-held demo protocol; Liberty does not move real money)
- `/api/schemas/quote.json` - JSON Schema for `POST /api/v0/quote` bodies (create / fund / submit / release / dispute / topup). Dry-run only. A quote is not an invoice and not proof of payment. Client-held demo; Liberty does not move real money
- `/api/schemas/simulate.json` - JSON Schema for `POST /api/v0/simulate` bodies (one-shot create -> fund -> submit -> release|dispute). Client-held demo protocol; Liberty does not move real money
- `/api/schemas/simulate-walk.json` - JSON Schema for a client-held simulate dry-run walk export (`liberty-simulate-*.json`). Local demo export only. Not an audit ledger. Not custody proof. `money` is always false. `callback_secret` must not appear
- `/api/schemas/verify.json` - JSON Schema for `POST /api/v0/verify` bodies (receipt, terminal job, or submitted job plus release/dispute). Demo only. `money` is always false. A verify is not custody
- `/api/schemas/receipt.json` - JSON Schema for shareable terminal receipts (`#receipt/r1....` / verify). Client-held demo; Liberty does not move real money. Receipts are not proof of payment
- `/api/schemas/handoff.json` - JSON Schema for shareable job handoffs (`#handoff/h1....`). Client-held demo; Liberty does not move real money. Handoffs are not custody transfers
- `/api/errors.json` - live Settlement error codes (schema vs state, including `hold_expired`). Client-held demo; Liberty does not move real money
- `POST /api/v0/validate` - dry-check a transition body (no apply, no persist, no job id)
- `POST /api/v0/quote` - dry-run of the same engine (no state change)
- `POST /api/v0/transition` - stateless demo engine (optional `Authorization` / `X-Liberty-Key`)
- `POST /api/v0/simulate` - one-shot create -> fund -> submit -> release|dispute
- `POST /api/v0/verify` - check a receipt or proposed release/dispute against the fee engine
- `/settlement.openapi.json` - OpenAPI 3.1 of the same surface (same JSON at `/openapi.json` and `/api/openapi.json` )
- Activity - this browser's append-only demo action log (newest first), including last callback attempts when a job had `callback_url` (signature presence only; the secret is never logged). After a successful simulate, export the last walk as JSON, or import a previously exported file to restore it. Local demo export / restore only - not an audit ledger, not custody proof, not network sync. Never includes `callback_secret`. Client-held. Liberty never receives it. Clear activity does not wipe wallets, jobs, or receipts
- Settlement ledger - this browser's running totals from stored receipts (fees, agent payouts, disputed returns) plus a CSV download. Client-held. Not a server ledger
- Demo pack - export / import this browser's Settlement localStorage (replace, not merge; may include the raw demo key), or reset those known keys after confirm
- `/SETTLEMENT.md` - markdown for humans
- `/llms.txt` - short pointer (llms.txt convention)
- `/llms-full.txt` - fuller machine-readable Settlement brief
- `/security.txt` / `/.well-known/security.txt` - RFC 9116 contact (public GitHub Issues; demo, no SOC 2)
- `/robots.txt` / `/sitemap.xml` - crawler allow list and discovery URLs (hash UI states are `/` once)
