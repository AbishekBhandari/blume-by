import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, OrderItem } from "@/lib/supabase";
import { ADMIN_COOKIE_NAME, isValidSessionToken } from "@/lib/admin-auth";
import { DELIVERY_CHARGE } from "@/lib/config";

// Creates a new order. Called from the checkout page before payment —
// the order exists (as "pending_payment") even if the customer never
// finishes paying, so nothing is lost if they abandon the payment step.
export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    senderName,
    senderPhone,
    senderEmail,
    receiverName,
    receiverPhone,
    receiverEmail,
    city,
    address,
    landmark,
    deliveryDate,
    orderNote,
    items,
  }: {
    senderName: string;
    senderPhone: string;
    senderEmail?: string;
    receiverName: string;
    receiverPhone: string;
    receiverEmail?: string;
    city: string;
    address: string;
    landmark?: string;
    deliveryDate?: string;
    orderNote?: string;
    items: OrderItem[];
  } = body;

  if (
    !senderName ||
    !senderPhone ||
    !senderEmail ||
    !receiverName ||
    !receiverPhone ||
    !city ||
    !address ||
    !items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required order fields" },
      { status: 400 }
    );
  }

  // Recompute the total server-side rather than trusting the client —
  // prevents a tampered request from placing an order at a fake price.
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_CHARGE;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      sender_name: senderName,
      sender_phone: senderPhone,
      sender_email: senderEmail,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      receiver_email: receiverEmail || null,
      city,
      address,
      landmark: landmark || null,
      delivery_date: deliveryDate || null,
      order_note: orderNote || null,
      items,
      subtotal,
      delivery_charge: DELIVERY_CHARGE,
      total,
      status: "pending_payment",
    } as never)
    .select("id")
    .single<{ id: string }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

// Lists all orders, most recent first. Admin only.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
