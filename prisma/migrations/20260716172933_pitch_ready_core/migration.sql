-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('PLATFORM_TERMS', 'INVESTOR_NDA', 'SUCCESS_FEE', 'ADVISORY_EQUITY', 'DATA_ROOM_CONFIDENTIALITY');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('PENDING', 'ACCEPTED', 'SUPERSEDED', 'REVOKED');

-- AlterTable
ALTER TABLE "DealRoom" ADD COLUMN     "fundedAmount" DOUBLE PRECISION,
ADD COLUMN     "fundedAt" TIMESTAMP(3),
ADD COLUMN     "introducedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "successFeeAmount" DOUBLE PRECISION,
ADD COLUMN     "successFeeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.025,
ADD COLUMN     "successFeeStatus" TEXT NOT NULL DEFAULT 'NOT_TRIGGERED';

-- AlterTable
ALTER TABLE "FounderProfile" ADD COLUMN     "capTable" JSONB,
ADD COLUMN     "financials" JSONB,
ADD COLUMN     "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "metrics" JSONB,
ADD COLUMN     "riskDisclosures" JSONB,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "InvestorProfile" ADD COLUMN     "accreditationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "accreditationVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "investorType" TEXT,
ADD COLUMN     "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "organization" TEXT;

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AgreementType" NOT NULL,
    "version" TEXT NOT NULL DEFAULT '2026.1',
    "status" "AgreementStatus" NOT NULL DEFAULT 'PENDING',
    "signerName" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "acceptedIp" TEXT,
    "contentHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealEvent" (
    "id" TEXT NOT NULL,
    "dealRoomId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "fromStage" "DealStage",
    "toStage" "DealStage",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Agreement_userId_status_idx" ON "Agreement"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_userId_type_version_key" ON "Agreement"("userId", "type", "version");

-- CreateIndex
CREATE INDEX "DealEvent_dealRoomId_createdAt_idx" ON "DealEvent"("dealRoomId", "createdAt");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealEvent" ADD CONSTRAINT "DealEvent_dealRoomId_fkey" FOREIGN KEY ("dealRoomId") REFERENCES "DealRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
