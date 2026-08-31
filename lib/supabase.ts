import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key, which bypasses Row Level
// Security entirely. It must only ever be imported from server-side
// code (API routes, server components) — never from a "use client"
// component, or the key would end up in the browser bundle.
//
// Orders table has RLS enabled with no policies (see supabase/schema.sql),
// so this is intentionally the only way in or out of that table.

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
};

export type Order = {
  id: string;
  created_at: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  receiver_name: string;
  receiver_phone: string;
  receiver_email: string | null;
  city: string;
  address: string;
  landmark: string | null;
  delivery_date: string | null;
  order_note: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  total: number;
  payment_method: "esewa" | "fonepay";
  status: "pending_payment" | "paid" | "fulfilled" | "cancelled";
  transaction_uuid: string | null;
  emailed: boolean;
};

// Minimal typed schema so supabase-js can correctly type .select() calls
// against the orders table (via .single<Order>() overrides at each call
// site). .insert() / .update() payloads are cast with `as never` bypass
// at their call sites instead — the installed supabase-js version's
// generic Database shape doesn't reliably infer Insert/Update types here,
// and our own validation already guards what gets written.
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local — see .env.example."
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
