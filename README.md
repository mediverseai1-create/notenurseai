# NoteNurse AI

AI-drafted nursing documentation with linked sources and nurse verification. Next.js 15 · React 19 · TypeScript · Tailwind · Supabase · Gemini.

## Reference audit summary (abridge.com, public pages only)

- **Product:** ambient AI that turns clinician conversations into draft documentation; a nursing module ("by nurses, for nurses") drafts flowsheet rows from nurse-patient conversation.
- **Key ideas adopted:** draft-for-review, "linked sources" tracing each line back to the conversation, gap awareness, handoff/continuity, trust-first positioning.
- **Design language:** black hero with large light-weight sans headline, white sections, uppercase eyebrow labels, single vivid orange-red accent, generous spacing, numbered step modules.
- **Not inspectable:** the logged-in product and pricing (enterprise, "Contact us"). The dashboard, pricing and billing here are original designs, not copies.
- NoteNurse uses its own name, copy, palette and layout, and is not affiliated with the reference company.

## What is implemented

Public site (home, product, solutions, pricing, about, contact, privacy, terms) · email/password auth with reset · protected `/app` · dashboard with usage · note workflow (paste or browser-dictate → SOAP/SBAR/DAR/narrative draft → per-line source verification → edit → verify → copy/print) · deterministic vitals extraction with range flags · Pro-only I-PASS handoffs · billing page · settings.

Safeguards: model must quote evidence and quotes are checked in code against the transcript; vitals are regex-extracted, not generated; plan limits enforced server-side; clients cannot write subscriptions or usage (RLS).

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

1. Create a Supabase project. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
2. Auth → URL configuration: add `<SITE_URL>/auth/callback` to redirect URLs. Decide whether to require email confirmation.
3. Put `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only) and `GEMINI_API_KEY` in `.env.local`.

Checks: `npm test` (unit tests), `npm run typecheck`, `npm run build`.

## Payments (Selar)

Plans: Starter $47/mo (`selar.com/47plan`), Pro $97/mo (`selar.com/97plan`). Returning from checkout **never** activates a plan. Activation paths:

1. **Webhook** `POST /api/webhooks/selar`, authenticated by `SELAR_WEBHOOK_SECRET` (header `x-webhook-secret` or `?secret=`). Matches buyer email to an account, maps 47/97 → plan, is idempotent (`payment_events`). **Confirm Selar's real payload field names and webhook options and adjust `src/lib/billing-parse.ts` before launch** - it was written tolerantly but not tested against live Selar events.
2. **Admin activation** `POST /api/admin/activate` `{email, plan}` for emails in `ADMIN_EMAILS` (e.g. after checking the Selar dashboard).

Paid access lasts 31 days from each confirmed payment, then reverts to trial limits. Selar renewal events must also hit the webhook to extend access.

## Deploy to Vercel

Import the repo, set every variable from `.env.example` (Production), set `NEXT_PUBLIC_SITE_URL` to the live domain, deploy, then add the Selar webhook URL `https://<domain>/api/webhooks/selar?secret=<SELAR_WEBHOOK_SECRET>`.

## Known limits

- Single-user accounts (no organizations/teams yet).
- Not a HIPAA-ready service: no BAA, do not enter PHI. Privacy/Terms pages are drafts for legal review.
- Plan limits (150 / 600 notes) are defaults in `src/lib/plans.ts`.
