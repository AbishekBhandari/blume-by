import { NextRequest, NextResponse } from "next/server";
import { ESEWA_PRODUCT_CODE, ESEWA_STATUS_URL } from "@/lib/esewa";
import { getSupabaseAdmin, Order } from "@/lib/supabase";
import { sendOrderConfirmationEmail } from "@/lib/email";

// Double-checks a transaction with eSewa's status API rather than trusting
// the redirect alone — the redirect can be replayed or spoofed, this
// server-to-server call cannot. On a confirmed payment, marks the order
// paid and fires the confirmation email exactly once.
export async function GET(req: NextRequest) {
  const totalAmount = req.nextUrl.searchParams.get("total_amount");
  const transactionUuid = req.nextUrl.searchParams.get("transaction_uuid");

  if (!totalAmount || !transactionUuid) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const url = `${ESEWA_STATUS_URL}?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

  let statusResult;
  try {
    const res = await fetch(url);
    statusResult = await res.json();
  } catch {
    return NextResponse.json(
      { error: "Could not reach eSewa status API" },
      { status: 502 }
    );
  }

  if (statusResult.status === "COMPLETE") {
    // transaction_uuid is the order's own id (see /api/esewa/initiate).
    const supabase = getSupabaseAdmin();
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", transactionUuid)
      .single<Order>();

    if (order && order.status !== "paid" && order.status !== "fulfilled") {
      await supabase
        .from("orders")
        .update({ status: "paid" } as never)
        .eq("id", transactionUuid);

      if (!order.emailed) {
        try {
          await sendOrderConfirmationEmail(order as Order);
          await supabase
            .from("orders")
            .update({ emailed: true } as never)
            .eq("id", transactionUuid);
        } catch (err) {
          // Payment already succeeded — don't fail the response just
          // because the email didn't send. Worth checking server logs.
          console.error("Failed to send confirmation email:", err);
        }
      }
    }
  }

  return NextResponse.json(statusResult);
}
