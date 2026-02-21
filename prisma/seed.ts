import { PrismaClient, Role, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Monarch Database...");

    // Clear existing data
    await prisma.auditLog.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.dealRoom.deleteMany({});
    await prisma.interest.deleteMany({});
    await prisma.startup.deleteMany({});
    await prisma.founderProfile.deleteMany({});
    await prisma.investorProfile.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.invite.deleteMany({});

    // 1. Create Admin
    const admin = await prisma.user.create({
        data: {
            email: "admin@monarch.com",
            name: "Monarch Admin",
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
            verified: true,
        },
    });

    // 2. Create Invite Codes
    await prisma.invite.createMany({
        data: [
            { code: "MONARCH-2026", role: Role.FOUNDER },
            { code: "INVESTOR-2026", role: Role.INVESTOR },
        ],
    });

    // 3. Create a Founder
    const founder = await prisma.user.create({
        data: {
            email: "founder@nebula.ai",
            name: "Alice Chen",
            role: Role.FOUNDER,
            status: UserStatus.ACTIVE,
            verified: true,
            founderProfile: {
                create: {
                    companyName: "Nebula AI",
                    stage: "Series A",
                    capitalAsk: 5000000,
                    valuation: 25000000,
                    monarchIndex: 94,
                    status: "APPROVED",
                },
            },
        },
    });

    const founderProfile = await prisma.founderProfile.findUnique({ where: { userId: founder.id } });

    if (founderProfile) {
        await prisma.startup.create({
            data: {
                founderId: founderProfile.id,
                industry: "AI Infrastructure",
                stage: "Series A",
                capitalAsk: 5000000,
                monarchIndex: 94,
            },
        });
    }

    // 4. Create an Investor
    await prisma.user.create({
        data: {
            email: "investor@capventures.com",
            name: "Bob Smith",
            role: Role.INVESTOR,
            status: UserStatus.ACTIVE,
            verified: true,
            investorProfile: {
                create: {
                    investmentRange: "$1M - $5M",
                    sectors: ["AI Infrastructure", "FinTech"],
                    region: "North America",
                    verified: true,
                },
            },
        },
    });

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
