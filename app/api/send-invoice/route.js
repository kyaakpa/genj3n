import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendInvoiceEmail(emailContent) {
  try {
    // Create note section HTML if note exists
    const noteSection = emailContent.note 
      ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold;">Order Note:</p>
          <p style="margin: 8px 0 0 0; color: #666;">${emailContent.note}</p>
        </div>
        `
      : '';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailContent.email,
      subject: `Invoice for Order #${emailContent.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1>Thank you for your order!</h1>
          <p>Dear ${emailContent.customerName},</p>
          <p>Your order #${emailContent.orderId} has been received and is being processed.</p>
          
          ${noteSection}
          
          <p>Please find your invoice attached to this email.</p>
          <p>Order Summary:</p>
          <ul>
            <li>Order Total: $${emailContent.total}</li>
            <li>Order Date: ${new Date().toLocaleString()}</li>
          </ul>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>Your Store Name</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${emailContent.orderId}.pdf`,
          content: Buffer.from(emailContent.pdfData, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending invoice:", error);
    return { success: false, error: "Failed to send invoice" };
  }
}

export async function POST(request) {
  try {
    const emailContent = await request.json();

    // Validate required fields
    const requiredFields = [
      "orderId",
      "customerName",
      "email",
      "total",
      "pdfData",
    ];
    for (const field of requiredFields) {
      if (!emailContent[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailContent.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize note if present (optional)
    if (emailContent.note) {
      // Basic XSS prevention for the note
      emailContent.note = emailContent.note
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const result = await sendInvoiceEmail(emailContent);

    if (result.success) {
      return NextResponse.json({ message: "Invoice sent successfully" });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}