import { notFound } from "next/navigation";
import { getSupabaseAdmin, Order } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";
import OrderStatusControls from "@/components/OrderStatusControls";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = getSupabaseAdmin();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single<Order>();

  if (error || !order) return notFound();
  const o = order as Order;

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <AdminNav title={`Order #${o.id.slice(0, 8)}`} />

      <div className="space-y-6">
        <div>
          <h2 className="font-body text-xs uppercase tracking-wide text-gold">
            Sender
          </h2>
          <p className="font-body text-ink">{o.sender_name}</p>
          <p className="font-body text-sm text-ink/60">
            {o.sender_phone}
            {o.sender_email ? ` · ${o.sender_email}` : ""}
          </p>
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-wide text-gold">
            Receiver
          </h2>
          <p className="font-body text-ink">{o.receiver_name}</p>
          <p className="font-body text-sm text-ink/60">
            {o.receiver_phone}
            {o.receiver_email ? ` · ${o.receiver_email}` : ""}
          </p>
          <p className="mt-1 font-body text-sm text-ink/70">
            {o.address}
            {o.landmark ? `, near ${o.landmark}` : ""}, {o.city}
          </p>
          {o.delivery_date && (
            <p className="font-body text-sm text-ink/60">
              Requested delivery: {o.delivery_date}
            </p>
          )}
          {o.order_note && (
            <p className="mt-1 font-body text-sm italic text-ink/60">
              Note: {o.order_note}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-wide text-gold">
            Items
          </h2>
          <div className="mt-2 divide-y divide-green/10 rounded-xl ring-1 ring-green/10">
            {o.items.map((item, i) => (
              <div key={i} className="flex justify-between p-3 font-body text-sm">
                <span>
                  {item.name} × {item.quantity}
                  {item.note && (
                    <span className="block text-xs italic text-ink/50">
                      {item.note}
                    </span>
                  )}
                </span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1 font-body text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {Number(o.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>Rs. {Number(o.delivery_charge).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-display text-base text-ink">
              <span>Total</span>
              <span>Rs. {Number(o.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-body text-xs uppercase tracking-wide text-gold">
            Status
          </h2>
          <p className="mt-1 font-body text-sm capitalize text-ink/70">
            {o.status.replace("_", " ")}
          </p>
          <div className="mt-3">
            <OrderStatusControls orderId={o.id} status={o.status} />
          </div>
        </div>
      </div>
    </section>
  );
}
