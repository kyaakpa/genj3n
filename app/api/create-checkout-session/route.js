import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const { orderData } = body;

    if (!orderData || !orderData.cartItems || !orderData.customerInfo) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      );
    }

    // Create line items from cart items
    const lineItems = orderData.cartItems.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          description: item.description || "",
          images: item.image ? [item.image] : [],
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
      success_url: `${request.headers.get("origin")}/payment-success?order_id=${orderData.id}`,
      cancel_url: `${request.headers.get("origin")}/checkout`,
      metadata: {
        orderId: orderData.id.toString(),
      },
      customer_email: orderData.customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ["AU", "US", "CA", "GB", "NZ"],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}