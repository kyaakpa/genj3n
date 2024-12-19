// app/api/contact/route.js
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

// Function to process and format commission details
function formatCommissionDetails(data) {
  return `
    <h2>Commission Request Details</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Commission Type:</strong> ${
      data.commissionType || "Not specified"
    }</p>
    <p><strong>Budget:</strong> $${data.budget || "Not specified"}</p>
    <p><strong>Deadline:</strong> ${data.deadline || "Not specified"}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;
}

// Server Action for handling form submission
async function sendEmail(data, files) {
  try {
    const htmlContent = formatCommissionDetails(data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Commission Request from ${data.name}`,
      html: htmlContent,
      attachments: files
        ? files.map((file, index) => ({
            filename: file.name,
            content: file.buffer,
            contentType: file.type,
          }))
        : [],
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function POST(request) {
  try {
    // Check if the request is multipart form data
    const contentType = request.headers.get("content-type") || "";

    let data;
    let files = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extract form fields
      data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
        commissionType: formData.get("commissionType"),
        deadline: formData.get("deadline"),
        budget: formData.get("budget"),
      };

      // Process uploaded files
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("image-") && value instanceof Blob) {
          const buffer = await value.arrayBuffer();
          files.push({
            name: value.name,
            type: value.type,
            buffer: Buffer.from(buffer),
          });
        }
      }
    } else {
      // Handle regular JSON request
      data = await request.json();
    }

    // Validate inputs
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate file sizes
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.buffer.length > maxFileSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }
    }

    const result = await sendEmail(data, files);

    if (result.success) {
      return NextResponse.json({
        message: "Commission request sent successfully",
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
