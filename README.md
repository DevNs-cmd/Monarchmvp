# Monarch | Private Opportunities

Monarch is an invitation-only capital platform for vetted founders, accredited investors, private deal execution, and market intelligence. This repository contains the Next.js web platform and the Flutter investor-demo app.

## Pitch Demo

- Hosted website: <https://monarch-private-opportunities.vercel.app>
- Android APK: `outputs/release/Monarch-Investor-Demo-v1.0.0.apk`
- Demo runbook: `PITCH_DEMO_RUNBOOK.md`

Use the one-click role buttons on the website. The mobile access codes are:

- Founder: `MONARCH-2026`
- Investor: `INVESTOR-2026`
- Monarch Core: `ADMIN-GLOBAL`

## Product Areas

- Founder cockpit with readiness scoring, investor approvals, company dossier, agreements, and payments
- Investor cockpit with curated matching, verification status, boardroom dossiers, introductions, and watchlists
- Private deal rooms with encrypted messages, activity timelines, meetings, and document workflows
- MIG Markets intelligence board with signals and watchlists
- Monarch Core operations for vetting, access requests, deal governance, markets, and revenue
- Electronic agreement acceptance with signer identity, version, IP, timestamp, and content hash

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS
- PostgreSQL and Prisma
- Stripe checkout integration with demo fallback
- Resend OTP delivery with development fallback
- AWS S3-compatible private document storage
- Flutter Android/iOS client

## Local Web Setup

Requirements: Node.js 20.9+ and PostgreSQL.

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Set `DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_MODE=true` to enable one-click demo access. Set `DEMO_STATIC_MODE=true` only for a stateless hosted pitch environment without PostgreSQL.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm run smoke

cd monarch_mobile
flutter analyze
flutter test
flutter build apk --release
```

## Architecture

The web application is a modular monolith using Next.js route handlers and Prisma. PostgreSQL is the system of record in normal operation. The hosted pitch deployment uses curated stateless data so it can be shared without exposing infrastructure or incurring third-party service dependencies.

Production launch additionally requires managed PostgreSQL, private object storage and malware scanning, live Stripe and webhook configuration, a verified email domain, KYC/accreditation and market-data providers, counsel-approved agreements, monitoring, and owner-managed mobile signing/store accounts.
