"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/supabase";

const NEXT_STATUSES: Record<Order["status"], Order["status"][]> = {
  pending_payment: ["paid", "cancelled"],
  paid: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

const LABELS: Record<Order["status"], string> = {
  pending_payment: "Mark as paid",
  paid: "Mark as fulfilled",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default function OrderStatusControls({
  orderId,
  status,
}: {
  orderId: string;
  status: Order["status"];
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const nextOptions = NEXT_STATUSES[status];

  async function updateStatus(newStatus: Order["status"]) {
    setUpdating(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    router.refresh();
  }

  if (nextOptions.length === 0) {
    return (
      <p className="font-body text-sm text-ink/50">No further actions.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {nextOptions.map((next) => (
        <button
          key={next}
          onClick={() => updateStatus(next)}
          disabled={updating}
          className="rounded-full border border-green px-5 py-2 font-body text-sm text-green transition hover:bg-green/5 disabled:opacity-60"
        >
          {LABELS[next] || next}
        </button>
      ))}
    </div>
  );
}
