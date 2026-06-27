import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const sig = request.headers.get("stripe-signature");
    if (!sig) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const body = await request.text();
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentId = session.metadata?.paymentId;
        if (paymentId) {
            await prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: "PAID",
                    stripePaymentIntent: session.payment_intent?.toString() || null,
                },
            });
        }
    }

    return NextResponse.json({ received: true });
}
