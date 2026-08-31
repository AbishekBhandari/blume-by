import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, Order } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";

// GET is intentionally public (no admin check): the payment page and the
// order-confirmation page both need to load an order by its id, and that
// id is an unguessable UUID — functionally the same as a receipt link.
// It does not expose a way to list or enumerate orders (that's the
// admin-only GET on /api/orders).
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single<Order>();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}

// Admin-only: update an order's status (e.g. mark fulfilled, or manually
// mark paid if a payment was confirmed outside the automated flow).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();
  const allowed = ["pending_payment", "paid", "fulfilled", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ status } as never)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
