import { NextRequest, NextResponse } from "next/server";
import { buildEsewaFormFields, ESEWA_BASE_URL } from "@/lib/esewa";
import { getSupabaseAdmin } from "@/lib/supabase";

// Receives an existing order id, looks up its total from the database
// (never trusts a client-supplied amount), and returns the signed field
// set + action URL the browser should POST to eSewa with. The order's
// own id is used as the eSewa transaction_uuid, so the verify step can
// map the payment straight back to the order.
export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, total")
    .eq("id", orderId)
    .single<{ id: string; total: number }>();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const origin = req.nextUrl.origin;

  const fields = buildEsewaFormFields({
    amount: Number(order.total),
    transactionUuid: order.id,
    successUrl: `${origin}/checkout/success?order=${order.id}`,
    failureUrl: `${origin}/checkout/failure?order=${order.id}`,
  });

  return NextResponse.json({ actionUrl: ESEWA_BASE_URL, fields });
}
