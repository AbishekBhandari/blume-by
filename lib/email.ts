import { Resend } from "resend";
import { Order } from "@/lib/supabase";

function renderReceiptHtml(order: Order) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.name} × ${item.quantity}${item.note ? `<br/><span style="color:#888;font-size:12px;">Note: ${item.note}</span>` : ""}</td>
          <td style="padding:8px 0;text-align:right;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#382C28;">
      <h1 style="font-size:22px;">Thank you, ${order.sender_name}! 🌸</h1>
      <p style="color:#555;">Your Blume by Binu order is confirmed. Here's your receipt.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${rows}
        <tr><td style="padding-top:12px;border-top:1px solid #eee;">Subtotal</td><td style="padding-top:12px;border-top:1px solid #eee;text-align:right;">Rs. ${order.subtotal.toLocaleString()}</td></tr>
        <tr><td>Delivery</td><td style="text-align:right;">Rs. ${order.delivery_charge.toLocaleString()}</td></tr>
        <tr><td style="font-weight:bold;padding-top:6px;">Total</td><td style="font-weight:bold;text-align:right;padding-top:6px;">Rs. ${order.total.toLocaleString()}</td></tr>
      </table>
      <p style="margin-top:20px;color:#555;">
        Delivering to <strong>${order.receiver_name}</strong>, ${order.address}, ${order.city}.
        ${order.delivery_date ? `Estimated delivery: ${order.delivery_date}.` : ""}
      </p>
      <p style="margin-top:24px;color:#888;font-size:13px;">
        Questions about your order? Reach out on
        <a href="https://www.instagram.com/blumebybinu/">Instagram</a>.
      </p>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(order: Order) {
  const to = order.sender_email;
  if (!to) return; // nothing to send to

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "RESEND_API_KEY not set — skipping confirmation email. See .env.example."
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Blume by Binu <onboarding@resend.dev>",
    to,
    subject: `Your Blume by Binu order is confirmed 🌸`,
    html: renderReceiptHtml(order),
  });
}
