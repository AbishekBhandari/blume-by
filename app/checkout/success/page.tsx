"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { Order } from "@/lib/supabase";

type Status = "checking" | "confirmed" | "failed";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>("checking");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderId = searchParams.get("order");
    const raw = searchParams.get("data"); // eSewa's own redirect payload

    if (!orderId || !raw) {
      setStatus("failed");
      return;
    }

    try {
      const decoded = JSON.parse(atob(raw));
      const { transaction_uuid, total_amount } = decoded;

      fetch(
        `/api/esewa/verify?transaction_uuid=${transaction_uuid}&total_amount=${total_amount}`
      )
        .then((r) => r.json())
        .then((result) => {
          if (result.status !== "COMPLETE") {
            setStatus("failed");
            return;
          }
          // Payment confirmed — fetch the order itself for the receipt.
          return fetch(`/api/orders/${orderId}`)
            .then((r) => r.json())
            .then((data) => {
              if (data.order) {
                setOrder(data.order);
                setStatus("confirmed");
                clearCart();
              } else {
                setStatus("failed");
              }
            });
        })
        .catch(() => setStatus("failed"));
    } catch {
      setStatus("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      {status === "checking" && (
        <p className="font-body text-ink/60">Confirming your payment…</p>
      )}

      {status === "confirmed" && order && (
        <>
          <h1 className="font-display text-3xl text-ink">
            Thank you, {order.sender_name}! 🌸
          </h1>
          <p className="mt-3 font-body text-ink/70">
            Your payment went through and your order is confirmed. A receipt
            {order.sender_email ? " is on its way to your email" : ""} — we'll
            reach out with delivery updates for {order.receiver_name} soon.
          </p>
          <div className="mt-6 rounded-2xl bg-surface p-5 text-left ring-1 ring-green/10">
            <p className="font-body text-sm text-ink/60">Order total</p>
            <p className="font-display text-xl text-ink">
              Rs. {Number(order.total).toLocaleString()}
            </p>
          </div>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="font-display text-3xl text-ink">
            We couldn't confirm that payment
          </h1>
          <p className="mt-3 font-body text-ink/70">
            If money was deducted, please reach out to us on Instagram or
            WhatsApp with your details and we'll sort it out right away.
          </p>
        </>
      )}

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-green px-6 py-3 font-body text-sm font-medium text-bg hover:bg-green-dark"
      >
        Back to shop
      </Link>
    </section>
  );
}
