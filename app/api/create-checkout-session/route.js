import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const headersList = headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const body = await request.json();
    const { orderData } = body;

    // Create line items from cart items
    const lineItems = orderData.cartItems.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          description: item.description || "",
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.ordered_quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        orderId: orderData.id.toString(),
      },
      customer_email: orderData.customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"], // Add countries as needed
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
