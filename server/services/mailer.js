const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter.verify((err) => {
    if (err) console.error("[mailer] SMTP connection failed:", err.message);
    else console.log("[mailer] SMTP connection OK — ready to send emails");
  });
} else {
  console.warn("[mailer] SMTP not configured (SMTP_HOST / SMTP_USER missing) — emails are disabled");
}

function paymentLabel(method) {
  const map = { credit_card: "Credit Card", paypal: "PayPal", paypal_credit: "PayPal Credit" };
  return map[method] || method || "—";
}

function buildItemRows(items) {
  return items
    .map(
      ({ name, price, quantity }) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#333;font-size:14px;">
        ${name.split(",")[0]}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#666;font-size:14px;text-align:center;">
        x${quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1a2e;font-size:14px;text-align:right;font-weight:bold;">
        $${(price * quantity).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");
}

function buildHtml(order, items) {
  const firstName = order.first_name || "Customer";
  const fullAddress = [
    order.address_line,
    order.state_province,
    order.zip_postal_code,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  const itemTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = order.total != null ? Number(order.total).toFixed(2) : itemTotal.toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center"
             style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.10);max-width:600px;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:28px 40px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:3px;font-weight:700;">
              ONLINE STORE
            </h1>
          </td>
        </tr>

        <!-- Order confirmed banner -->
        <tr>
          <td style="background:linear-gradient(135deg,#4caf50,#43a047);padding:22px 40px;text-align:center;">
            <p style="color:#ffffff;margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:.85;">
              Order Confirmed
            </p>
            <h2 style="color:#ffffff;margin:8px 0 0;font-size:20px;font-weight:700;">
              #${order.order_number}
            </h2>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">

            <p style="color:#222;font-size:16px;margin:0 0 8px;font-weight:600;">
              Hello, ${firstName}!
            </p>
            <p style="color:#666;font-size:14px;line-height:1.6;margin:0 0 28px;">
              Thank you for your purchase. We've received your order and will begin
              processing it shortly. A summary is below.
            </p>

            <!-- Items table -->
            <h3 style="color:#1a1a2e;font-size:15px;margin:0 0 12px;padding-bottom:10px;
                        border-bottom:2px solid #f0f0f0;font-weight:700;">
              Order Items
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:12px;color:#999;font-weight:600;
                              padding-bottom:6px;text-transform:uppercase;">Product</th>
                  <th style="text-align:center;font-size:12px;color:#999;font-weight:600;
                              padding-bottom:6px;text-transform:uppercase;">Qty</th>
                  <th style="text-align:right;font-size:12px;color:#999;font-weight:600;
                              padding-bottom:6px;text-transform:uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${buildItemRows(items)}
              </tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#f8f8f8;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="padding:14px 20px;color:#555;font-size:14px;">Order Total</td>
                <td style="padding:14px 20px;color:#1a1a2e;font-size:18px;font-weight:700;
                            text-align:right;">$${total}</td>
              </tr>
            </table>

            <!-- Shipping address -->
            <h3 style="color:#1a1a2e;font-size:15px;margin:0 0 10px;padding-bottom:10px;
                        border-bottom:2px solid #f0f0f0;font-weight:700;">
              Shipping Address
            </h3>
            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 28px;">
              ${fullAddress || "—"}
            </p>

            <!-- Payment -->
            <h3 style="color:#1a1a2e;font-size:15px;margin:0 0 10px;padding-bottom:10px;
                        border-bottom:2px solid #f0f0f0;font-weight:700;">
              Payment Method
            </h3>
            <p style="color:#555;font-size:14px;margin:0 0 10px;">
              ${paymentLabel(order.payment)}
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;text-align:center;
                      border-top:1px solid #eeeeee;">
            <p style="color:#aaa;font-size:12px;margin:0 0 4px;">
              © ${new Date().getFullYear()} Online Store. All rights reserved.
            </p>
            <p style="color:#aaa;font-size:12px;margin:0;">
              This email was sent to ${order.email}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendOrderConfirmation(order, items) {
  if (!order.email) {
    console.warn("[mailer] skipped — order has no email");
    return;
  }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("[mailer] skipped — SMTP not configured");
    return;
  }

  const html = buildHtml(order, items);

  const info = await transporter.sendMail({
    from: `"Online Store" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: order.email,
    subject: `Order Confirmation #${order.order_number}`,
    html,
  });

  console.log(`[mailer] email sent to ${order.email} — messageId: ${info.messageId}`);
}

module.exports = { sendOrderConfirmation };
