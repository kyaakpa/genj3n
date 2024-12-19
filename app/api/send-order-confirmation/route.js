// app/api/send-order-confirmation/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { email, orderId, customerName, total, items, note } =
      await request.json();

    // Create items HTML
    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${
          item.name
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${
          item.ordered_quantity
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${
          item.price
        }</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(
          item.price * item.ordered_quantity
        ).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Confirmation</h1>
          <p>Dear ${customerName},</p>
          <p>Thank you for your order! Here are your order details:</p>
          
          <div style="margin: 20px 0; padding: 20px; background-color: #f8f8f8;">
            <strong>Order #:</strong> ${orderId}<br>
            <strong>Date:</strong> ${new Date().toLocaleDateString()}
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; text-align: right;">
            <strong>Total: $${total.toFixed(2)}</strong>
          </div>

          ${
            note
              ? `
            <div style="margin-top: 20px; padding: 10px; background-color: #f8f8f8;">
              <strong>Order Note:</strong><br>
              ${note}
            </div>
          `
              : ""
          }

          <p style="margin-top: 20px;">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>

          <p>Best regards,<br>Genjen</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Order confirmation sent successfully",
    });
  } catch (error) {
    console.error("Error sending order confirmation:", error);
    return NextResponse.json(
      { error: "Failed to send order confirmation" },
      { status: 500 }
    );
  }
}
