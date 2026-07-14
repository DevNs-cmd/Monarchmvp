export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentType } from "@prisma/client";
import Stripe from "stripe";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.STRIPE_SECRET) {
            return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET);
        const body = await request.json();
        const { type } = body;
        const paymentType = Object.values(PaymentType).includes(type) ? type : PaymentType.CUSTOM_REPORT;

        const payment = await prisma.payment.create({
            data: {
                userId: session.userId,
                amount: 499,
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
                            name: "Monarch Custom Intelligence Report",
                        },
                        unit_amount: 49900,
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
