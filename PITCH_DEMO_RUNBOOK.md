# Monarch Pitch Demo Runbook

## Release Artifacts

- Website: <https://monarch-private-opportunities.vercel.app>
- Android APK: `outputs/release/Monarch-Investor-Demo-v1.0.0.apk`
- Android package: `com.monarch.privateopportunities`
- Version: `1.0.0` (`2`)
- SHA-256: `9f31d92ce0ba25f7f070837d6bdaabeb4867e24becf5b6c4b0af9d4621f66415`

The APK is directly installable and uses local Android signing. An owner-managed upload key is required before Play Store submission.

## Demo Access

The website has one-click Founder, Investor, and Monarch Core entry buttons.

Mobile codes:

- Founder: `MONARCH-2026`
- Investor: `INVESTOR-2026`
- Monarch Core: `ADMIN-GLOBAL`

## Five-Minute Investor Flow

1. Open the public website and enter as Founder. Show readiness scoring, approval pipeline, live deal metrics, company dossier, agreements, and payment ledger.
2. Switch roles through logout and enter as Investor. Show verification status, curated matches, boardroom dossiers, market signals, introduction requests, and the active deal room.
3. Enter as Monarch Core. Show vetting operations, access-request governance, deal flow, market intelligence, agreement coverage, and monetization metrics.
4. Install the APK and repeat the three-role journey to demonstrate the mobile product direction and consistent visual identity.
5. Close on the operating model: invite-only membership, verified participants, structured diligence, controlled introductions, transaction workflows, and recurring plus success-fee revenue.

## What Is Live In This Release

- Responsive role-based web experience
- Founder, investor, and operations workflows
- PostgreSQL schema, migrations, seed data, and persistent local mode
- Authenticated API boundaries and secure session cookies
- Hashed OTP verification and optional transactional email delivery
- Electronic agreement acceptance audit records
- Encrypted deal-room messages in persistent mode
- Stripe checkout integration with pitch-demo fallback
- Private S3 upload and presigned download integration
- Android release APK with Monarch package identity and launcher artwork

## Hosted Demo Boundary

The public Vercel deployment intentionally uses curated, stateless demo data. Actions return realistic success responses but reset because the hosted environment is not connected to production financial, identity, email, storage, or database services. The local web build uses PostgreSQL and persists the full seeded workflow.

This release is pitch-ready, not production-launch complete. Do not represent simulated KYC, payment, legal execution, market signals, or deal records as live customer activity.

## Production Launch Checklist

- Provision managed PostgreSQL with backups, point-in-time recovery, migrations, and least-privilege credentials
- Configure private object storage, malware scanning, retention rules, and document access auditing
- Complete Stripe merchant verification, products, webhook processing, reconciliation, refunds, and tax treatment
- Verify the Monarch email domain and configure production OTP delivery, bounce handling, and abuse controls
- Integrate KYC/KYB, sanctions, accreditation, and beneficial-owner verification providers
- License market-data feeds and document signal methodology, freshness, disclaimers, and model governance
- Have counsel approve platform terms, privacy policy, risk disclosures, deal templates, e-signature process, and jurisdiction-specific securities positioning
- Add consent, deletion/export, retention, incident response, security monitoring, penetration testing, and disaster recovery controls
- Replace demo mobile data with authenticated APIs, secure token storage, upload/download flows, and production telemetry
- Create owner-controlled Android/iOS signing keys, store accounts, privacy declarations, screenshots, and review submissions
- Run founder/investor usability pilots, compliance review, load testing, accessibility review, and production acceptance testing

## Verification Record

- Web lint: passed
- Web TypeScript check: passed
- Next.js production build: passed
- Database migration and seed: passed
- Persistent-mode API smoke test: passed
- Stateless hosted-mode API smoke test: passed
- Flutter static analysis: passed
- Flutter tests: passed
- Android release build and signature verification: passed
