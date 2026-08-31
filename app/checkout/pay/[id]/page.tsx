"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/lib/supabase";

export default function PayPage() {
  const params = useParams();
  const orderId = params.id as string;
  const formRef = useRef<HTMLFormElement>(null);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        else setError("We couldn't find that order.");
      })
      .catch(() => setError("We couldn't find that order."))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleEsewaPay() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/esewa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      const form = formRef.current!;
      form.action = data.actionUrl;
      form.innerHTML = "";
      Object.entries(data.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      form.submit();
    } catch {
      setPaying(false);
      setError("Something went wrong starting the payment. Please try again.");
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-body text-ink/60">Loading your order…</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-body text-ink/70">{error || "Order not found."}</p>
      </section>
    );
  }

  if (order.status === "paid" || order.status === "fulfilled") {
    return (
      <section className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">This order is already paid</h1>
        <p className="mt-3 font-body text-ink/70">
          Thanks, {order.sender_name} — nothing more to do here.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Pay for your order</h1>

      <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-green/10">
        <p className="font-body text-sm text-ink/60">Order total</p>
        <p className="font-display text-2xl text-ink">
          Rs. {Number(order.total).toLocaleString()}
        </p>
        <p className="mt-1 font-body text-xs text-ink/50">
          Delivering to {order.receiver_name}, {order.city}
        </p>
      </div>

      {error && <p className="mt-4 font-body text-sm text-rose-dark">{error}</p>}

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-green/20 p-5">
          <h2 className="font-display text-lg text-ink">Pay with eSewa</h2>
          <p className="mt-1 font-body text-sm text-ink/60">
            You'll be redirected to eSewa to complete payment.
          </p>
          <button
            onClick={handleEsewaPay}
            disabled={paying}
            className="mt-4 w-full rounded-full bg-rose py-3 font-body text-sm font-medium text-white transition hover:bg-rose-dark disabled:opacity-60"
          >
            {paying ? "Redirecting to eSewa…" : "Pay with eSewa"}
          </button>
        </div>

        {/* FonePay: placeholder until merchant credentials are set up.
            Once ESEWA-style credentials exist for FonePay, this card
            becomes a live QR the same way the eSewa card became live —
            see lib/fonepay.ts (to be created) and README for the exact
            steps. */}
        <div className="rounded-2xl border border-dashed border-gold/50 p-5 opacity-70">
          <h2 className="font-display text-lg text-ink">Pay with FonePay</h2>
          <p className="mt-1 font-body text-sm text-ink/60">
            Coming soon — once the FonePay merchant account is set up,
            a scannable QR will appear here.
          </p>
          <button
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-full border border-gold/40 py-3 font-body text-sm font-medium text-ink/40"
          >
            Not yet available
          </button>
        </div>
      </div>

      {/* Hidden form submitted programmatically to eSewa's payment page */}
      <form ref={formRef} method="POST" className="hidden" />
    </section>
  );
}
