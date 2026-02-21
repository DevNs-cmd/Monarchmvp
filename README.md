# Monarch MVP - Private Investment Platform

Monarch is an exclusive, invite-only digital capital boardroom designed for high-net-worth individuals and elite startups. It combines sophisticated private market access with algorithmic public market intelligence.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Storage**: AWS S3 (Client-side signed URLs)
- **Payments**: Stripe (Test Mode)

## Project Structure
- `/app`: Role-based gated routing and dashboard logic.
- `/components`: Premium luxury UI components.
- `/lib`: Core business logic (RBAC, Scoring, Matching, Audit, Crypto).
- `/prisma`: Schema definition and seed scripts.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root based on the following template:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/monarch"
   JWT_SECRET="your-secret-key"
   ENCRYPTION_KEY="32-character0123456789012345678"
   AWS_ACCESS_KEY_ID="your-aws-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret"
   AWS_S3_BUCKET="monarch-dossiers"
   STRIPE_SECRET="sk_test_..."
   REDIS_URL="redis://localhost:6379"
   ```

3. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Demo Credentials (via Invite Codes)
- **Founder Gateway**: `MONARCH-2026`
- **Investor Gateway**: `INVESTOR-2026`

## Core Features Implemented
- **Invite Gating**: Single-input validation system.
- **Role-Based Onboarding**: Specialized wizards for Founders and Investors.
- **Monarch Index (MIG)**: Algorithmic scoring visualization.
- **Boardroom**: Secure startup dossier system.
- **Deal Room**: Mutual-interest gated chat with AES-256 encryption.
- **Markets Module**: Public market intelligence dashboard.
- **Admin Console**: Full system governance and audit tracking.
- **Payments**: Secure hook for custom report purchases.

---
Built by Antigravity for the Monarch Private Network.
