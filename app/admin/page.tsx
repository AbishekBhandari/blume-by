import Link from "next/link";
import { getSupabaseAdmin, Order } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

const STATUS_STYLES: Record<Order["status"], string> = {
  pending_payment: "bg-gold/20 text-gold",
  paid: "bg-green/15 text-green",
  fulfilled: "bg-green text-bg",
  cancelled: "bg-rose/15 text-rose-dark",
};

export const dynamic = "force-dynamic"; // always show the latest orders

export default async function AdminOrdersPage() {
  const supabase = getSupabaseAdmin();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <AdminNav title="Orders" />

      {error && (
        <p className="font-body text-sm text-rose-dark">
          Couldn't load orders: {error.message}
        </p>
      )}

      {orders && orders.length === 0 && (
        <p className="font-body text-ink/60">No orders yet.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="overflow-x-auto rounded-2xl ring-1 ring-green/10">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-surface text-ink/60">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Receiver</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green/10">
              {(orders as Order[]).map((order) => (
                <tr key={order.id} className="hover:bg-surface/60">
                  <td className="p-4 text-ink/70">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-ink underline"
                    >
                      {order.sender_name}
                    </Link>
                  </td>
                  <td className="p-4 text-ink/70">{order.receiver_name}</td>
                  <td className="p-4 text-ink/70">
                    Rs. {Number(order.total).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
