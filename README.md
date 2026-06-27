# Monarch MVP | Private Opportunities Boardroom

Monarch is an exclusive, invitation-only digital capital boardroom. It combines the privacy of elite venture matchmaking with algorithmic public market intelligence.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Node.js
- PostgreSQL + Prisma
- Redis (optional for future caching)
- AWS S3 compatible storage
- Stripe (test mode)

## Architecture
Modular monolith with service-isolated structure ready for microservice extraction.

## Getting Started

### 1. Requirements
- Node.js 18+
- PostgreSQL

### 2. Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/monarch"
JWT_SECRET="your-secret-key"
ENCRYPTION_KEY="32-character-long-secure-key-here"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="monarch-dossiers"
STRIPE_SECRET="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Installation
```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Authentication Protocols
- Founder Invite: `MONARCH-2026`
- Investor Invite: `INVESTOR-2026`
- Admin Invite: `ADMIN-GLOBAL`

## Design System
- Background: `#000000`
- Accent: `#C9A24D`
- Text: `#FFFFFF` / `#9CA3AF`
- Radius: `rounded-2xl`

## Modules
- Gatehouse: Invite-only entry
- Boardroom: Startup dossier registry
- Deal Room: AES-256 encrypted chat
- MIG Markets: Algorithmic market intelligence
- Admin Console: Governance and audit oversight

## Seed Data
Running the seed creates:
- 3 invite codes
- 1 admin user
- 1 founder profile and startup
- 1 investor profile
- MIG market data
