export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentType } from "@prisma/client";
import Stripe from "stripe";
import { STATIC_DEMO_ENABLED } from "@/lib/demo-static";

const PRODUCTS: Record<PaymentType, { name: string; amount: number }> = {
    SCREENING_FEE: { name: "Monarch Screening Fee", amount: 499 },
    BOARDROOM_ACCESS: { name: "Monarch Boardroom Access", amount: 1200 },
    ALGO_ACCESS: { name: "Monarch Markets Access", amount: 990 },
    CUSTOM_REPORT: { name: "Monarch Custom Intelligence Report", amount: 450 },
};

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { type } = body;
        const paymentType: PaymentType = Object.values(PaymentType).includes(type as PaymentType)
            ? type as PaymentType
            : PaymentType.CUSTOM_REPORT;
        const product = PRODUCTS[paymentType];

        if (STATIC_DEMO_ENABLED) {
            return NextResponse.json({ demo: true, simulated: true, payment: { id: `demo-payment-${Date.now()}`, amount: product.amount, currency: "USD", type: paymentType, status: "SUCCEEDED", createdAt: new Date().toISOString() } });
        }

        if (!process.env.STRIPE_SECRET && process.env.DEMO_MODE === "true") {
            const payment = await prisma.payment.create({
                data: {
                    userId: session.userId,
                    amount: product.amount,
                    currency: "USD",
                    type: paymentType,
                    status: "SUCCEEDED",
                },
            });
            return NextResponse.json({ demo: true, payment });
        }

        if (!process.env.STRIPE_SECRET) {
            return NextResponse.json({ error: "Payment processing is not configured" }, { status: 503 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET);

        const payment = await prisma.payment.create({
            data: {
                userId: session.userId,
                amount: product.amount,
                currency: "USD",
                type: paymentType,
                status: "PENDING",
            },
        });

        const checkout = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                paymentId: payment.id,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/founder/payments?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/founder/payments?canceled=1`,
        });

        await prisma.payment.update({
            where: { id: payment.id },
            data: { stripeSessionId: checkout.id },
        });

        return NextResponse.json({ url: checkout.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
