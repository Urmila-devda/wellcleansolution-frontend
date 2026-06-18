const nodemailer = require("nodemailer")
const sgMail = require("@sendgrid/mail")

// Initialize SendGrid if API key is present
const sendgridApiKey = (process.env.SENDGRID_API_KEY || "").trim()
const sendgridSenderEmail = (process.env.SENDGRID_FROM_EMAIL || "").trim()

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey)
  console.log("SendGrid mail service initialized.")
} else {
  console.log("SENDGRID_API_KEY not configured. Falling back to SMTP/Ethereal.")
}

// Cache the Ethereal transporter to avoid creating it multiple times
let testTransporter = null

// Retrieve SMTP transporter based on configuration or Ethereal fallback
const getTransporter = async () => {
  const isSmtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS

  if (isSmtpConfigured) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Fallback to Ethereal Mail for local testing
  if (testTransporter) {
    return testTransporter
  }

  console.log("No SMTP credentials found in environment. Generating dynamic Ethereal Mail test credentials...")
  try {
    const testAccount = await nodemailer.createTestAccount()
    testTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log(`Ethereal SMTP credentials generated. User: ${testAccount.user}`)
    return testTransporter
  } catch (error) {
    console.error("Failed to generate Ethereal credentials:", error)
    // Absolute fallback: log to console only
    return null
  }
}

// Format email HTML body with products list
const generateOrderHtml = (order, user, isAdminAlert = false) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("")

  const title = isAdminAlert ? "New Order Received" : "Order Confirmation"
  const headerBg = isAdminAlert ? "#28A745" : "#007BFF"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerBg}; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">WellClean Solutions</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">${title}</p>
      </div>
      <div style="padding: 20px; color: #334155;">
        ${
          isAdminAlert
            ? `
          <p>Hello Admin,</p>
          <p>A new order has been placed on WellClean Solutions. Details below:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <strong>Customer Details:</strong><br/>
            Name: ${user.name}<br/>
            Email: ${user.email}<br/>
            Phone: ${user.phone || "N/A"}<br/>
            ${order.orderNumber ? `Order Number: <strong>${order.orderNumber}</strong><br/>` : ""}
            Order ID: ${order._id}<br/>
            ${order.razorpayPaymentId ? `Payment ID: <strong>${order.razorpayPaymentId}</strong><br/>` : ""}
          </div>
        `
            : `
          <p>Dear ${user.name},</p>
          <p>Thank you for shopping with WellClean! Your order has been successfully placed. We are preparing your hygiene products for delivery.</p>
          ${order.orderNumber ? `<p><strong>Order Number:</strong> ${order.orderNumber}</p>` : ""}
          <p><strong>Order ID:</strong> ${order._id}</p>
          ${order.razorpayPaymentId ? `<p><strong>Payment ID:</strong> ${order.razorpayPaymentId}</p>` : ""}
        `
        }

        <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 20px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Product</th>
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">Qty</th>
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">Price</th>
              <th style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"></td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Grand Total:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right; color: #007BFF; font-size: 16px;">₹${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 20px; font-size: 13px;">
          <strong>Shipping Address:</strong><br/>
          ${order.shippingAddress.street}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br/>
          ${order.shippingAddress.country}
        </div>

        <p style="margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
          &copy; 2026 WellClean Solutions. All rights reserved.
        </p>
      </div>
    </div>
  `
}

const sendOrderConfirmationEmail = async (order, user) => {
  // Try SendGrid first if API key and Sender Email are configured
  if (sendgridApiKey && sendgridSenderEmail) {
    const html = generateOrderHtml(order, user, false)
    const msg = {
      to: user.email,
      from: {
        name: "WellClean Solutions",
        email: sendgridSenderEmail,
      },
      subject: `Order Confirmation - WellClean Solutions (ID: ${order._id.toString().substring(0, 8)}...)`,
      html: html,
    }

    try {
      await sgMail.send(msg)
      console.log(`Order confirmation email sent to ${user.email} via SendGrid`)
      return
    } catch (error) {
      console.error("Error sending order confirmation email via SendGrid:", error)
      if (error.response) {
        console.error("SendGrid error details:", JSON.stringify(error.response.body, null, 2))
      }
      console.log("Attempting fallback to Nodemailer/SMTP...")
    }
  }

  // Fallback to Nodemailer/SMTP
  const transporter = await getTransporter()
  if (!transporter) {
    console.log("Email confirmation simulation (Transporter unavailable):")
    console.log(`TO: ${user.email} | SUBJECT: WellClean Order Confirmation | TOTAL: $${order.totalAmount.toFixed(2)}`)
    return
  }

  const html = generateOrderHtml(order, user, false)

  try {
    const info = await transporter.sendMail({
      from: '"WellClean Solutions" <no-reply@wellclean.com>',
      to: user.email,
      subject: `Order Confirmation - WellClean Solutions (ID: ${order._id.toString().substring(0, 8)}...)`,
      html: html,
    })

    console.log(`Order confirmation email sent to ${user.email} via Nodemailer`)
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Preview URL (Customer Email): ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error("Error sending order confirmation email via Nodemailer:", error)
  }
}

const sendAdminNewOrderEmail = async (order, user) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@wellclean.com"

  // Try SendGrid first if API key and Sender Email are configured
  if (sendgridApiKey && sendgridSenderEmail) {
    const html = generateOrderHtml(order, user, true)
    const msg = {
      to: adminEmail,
      from: {
        name: "WellClean System Alert",
        email: sendgridSenderEmail,
      },
      subject: `ALERT: New Order Placed - WellClean (ID: ${order._id.toString().substring(0, 8)}...)`,
      html: html,
    }

    try {
      await sgMail.send(msg)
      console.log(`Admin notification email sent to ${adminEmail} via SendGrid`)
      return
    } catch (error) {
      console.error("Error sending admin notification email via SendGrid:", error)
      if (error.response) {
        console.error("SendGrid error details:", JSON.stringify(error.response.body, null, 2))
      }
      console.log("Attempting fallback to Nodemailer/SMTP...")
    }
  }

  // Fallback to Nodemailer/SMTP
  const transporter = await getTransporter()

  if (!transporter) {
    console.log("Admin notification email simulation (Transporter unavailable):")
    console.log(`TO: ${adminEmail} | SUBJECT: New WellClean Order Received | TOTAL: $${order.totalAmount.toFixed(2)}`)
    return
  }

  const html = generateOrderHtml(order, user, true)

  try {
    const info = await transporter.sendMail({
      from: '"WellClean System Alert" <system@wellclean.com>',
      to: adminEmail,
      subject: `ALERT: New Order Placed - WellClean (ID: ${order._id.toString().substring(0, 8)}...)`,
      html: html,
    })

    console.log(`Admin notification email sent to ${adminEmail} via Nodemailer`)
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Preview URL (Admin Alert): ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error("Error sending admin notification email via Nodemailer:", error)
  }
}

const generateEnquiryHtml = (enquiry, isAdminAlert = false) => {
  const title = isAdminAlert ? "New Customer Enquiry Alert" : "Enquiry Received - WellClean"
  const headerBg = isAdminAlert ? "#28A745" : "#007BFF"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerBg}; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">WellClean Solutions</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">${title}</p>
      </div>
      <div style="padding: 20px; color: #334155; line-height: 1.6;">
        ${
          isAdminAlert
            ? `
          <p>Hello Admin,</p>
          <p>A new customer enquiry has been submitted. Details are below:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; border: 1px solid #e2e8f0;">
            <strong>Enquiry Details:</strong><br/>
            <strong>Name:</strong> ${enquiry.fullName}<br/>
            <strong>Email:</strong> ${enquiry.email}<br/>
            <strong>Phone:</strong> ${enquiry.phone}<br/>
            <strong>Subject:</strong> ${enquiry.subject}<br/>
            <strong>Submitted At:</strong> ${new Date(enquiry.createdAt || Date.now()).toLocaleString()}
          </div>
          <p><strong>Customer Message:</strong></p>
          <blockquote style="background-color: #f1f5f9; padding: 15px; border-left: 4px solid #94a3b8; border-radius: 4px; margin: 0 0 20px 0; font-style: italic;">
            ${enquiry.message}
          </blockquote>
          <p>Please log in to the Admin Panel to manage and update this request.</p>
        `
            : `
          <p>Dear ${enquiry.fullName},</p>
          <p>Thank you for reaching out to WellClean Solutions! We have received your enquiry and our support team is reviewing your message.</p>
          <p>A summary of your submitted details is below:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; border: 1px solid #e2e8f0;">
            <strong>Subject:</strong> ${enquiry.subject}<br/>
            <strong>Your Message:</strong> ${enquiry.message}
          </div>
          <p>We typically respond within 24 business hours. Thank you for your patience.</p>
        `
        }
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin: 0;">
          &copy; 2026 WellClean Solutions. All rights reserved.<br/>
          Shed No. 1, Kolshet Khadi, Taricha Pada, Thane West, Maharashtra, 400607
        </p>
      </div>
    </div>
  `
}

const sendCustomerEnquiryAckEmail = async (enquiry) => {
  if (sendgridApiKey && sendgridSenderEmail) {
    const html = generateEnquiryHtml(enquiry, false)
    const msg = {
      to: enquiry.email,
      from: {
        name: "WellClean Solutions",
        email: sendgridSenderEmail,
      },
      subject: `We've received your enquiry: ${enquiry.subject}`,
      html: html,
    }

    try {
      await sgMail.send(msg)
      console.log(`Enquiry acknowledgement email sent to ${enquiry.email} via SendGrid`)
      return
    } catch (error) {
      console.error("Error sending enquiry acknowledgement via SendGrid:", error)
      console.log("Attempting fallback to Nodemailer/SMTP...")
    }
  }

  const transporter = await getTransporter()
  if (!transporter) {
    console.log("Enquiry acknowledgement email simulation (Transporter unavailable):")
    console.log(`TO: ${enquiry.email} | SUBJECT: WellClean Enquiry Acknowledgement`)
    return
  }

  const html = generateEnquiryHtml(enquiry, false)

  try {
    const info = await transporter.sendMail({
      from: '"WellClean Solutions" <no-reply@wellclean.com>',
      to: enquiry.email,
      subject: `We've received your enquiry: ${enquiry.subject}`,
      html: html,
    })

    console.log(`Enquiry acknowledgement email sent to ${enquiry.email} via Nodemailer`)
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Preview URL (Customer Enquiry Ack): ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error("Error sending enquiry ack email via Nodemailer:", error)
  }
}

const sendAdminEnquiryAlertEmail = async (enquiry) => {
  const adminEmail = process.env.ADMIN_EMAIL || "wellclean11@gmail.com"

  if (sendgridApiKey && sendgridSenderEmail) {
    const html = generateEnquiryHtml(enquiry, true)
    const msg = {
      to: adminEmail,
      from: {
        name: "WellClean System Alert",
        email: sendgridSenderEmail,
      },
      subject: `ALERT: New Customer Enquiry - ${enquiry.subject}`,
      html: html,
    }

    try {
      await sgMail.send(msg)
      console.log(`Admin enquiry notification email sent to ${adminEmail} via SendGrid`)
      return
    } catch (error) {
      console.error("Error sending admin enquiry notification via SendGrid:", error)
      console.log("Attempting fallback to Nodemailer/SMTP...")
    }
  }

  const transporter = await getTransporter()
  if (!transporter) {
    console.log("Admin enquiry notification email simulation (Transporter unavailable):")
    console.log(`TO: ${adminEmail} | SUBJECT: ALERT: New Customer Enquiry`)
    return
  }

  const html = generateEnquiryHtml(enquiry, true)

  try {
    const info = await transporter.sendMail({
      from: '"WellClean System Alert" <system@wellclean.com>',
      to: adminEmail,
      subject: `ALERT: New Customer Enquiry - ${enquiry.subject}`,
      html: html,
    })

    console.log(`Admin enquiry notification email sent to ${adminEmail} via Nodemailer`)
    if (nodemailer.getTestMessageUrl(info)) {
      console.log(`Preview URL (Admin Enquiry Alert): ${nodemailer.getTestMessageUrl(info)}`)
    }
  } catch (error) {
    console.error("Error sending admin enquiry alert email via Nodemailer:", error)
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
  sendCustomerEnquiryAckEmail,
  sendAdminEnquiryAlertEmail,
}
