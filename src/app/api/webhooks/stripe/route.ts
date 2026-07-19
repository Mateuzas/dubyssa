import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    // Fired by the /checkout PaymentElement flow, which creates a
    // PaymentIntent directly rather than a Checkout Session.
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;
      if (orderId) {
        const db = getDb();
        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.id, orderId));

        if (order && paymentIntent.amount === order.totalCents) {
          await db
            .update(orders)
            .set({
              status: "paid",
              stripePaymentId: paymentIntent.id,
              updatedAt: new Date(),
            })
            .where(
              and(eq(orders.id, orderId), eq(orders.status, "pending"))
            );
        } else if (order) {
          console.error(
            `Webhook amount mismatch for order ${orderId}: paymentIntent.amount=${paymentIntent.amount}, order.totalCents=${order.totalCents}`
          );
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata?.orderId) {
        await getDb()
          .update(orders)
          .set({
            status: "cancelled",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(orders.id, paymentIntent.metadata.orderId),
              eq(orders.status, "pending")
            )
          );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
