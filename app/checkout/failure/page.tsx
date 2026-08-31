"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={null}>
      <CheckoutFailureContent />
    </Suspense>
  );
}

function CheckoutFailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">Payment didn't go through</h1>
      <p className="mt-3 font-body text-ink/70">
        No charge was made. Your order is still saved — you can try paying
        again, or reach out to us directly if you'd rather confirm by DM.
      </p>
      <Link
        href={orderId ? `/checkout/pay/${orderId}` : "/checkout"}
        className="mt-8 inline-block rounded-full bg-rose px-6 py-3 font-body text-sm font-medium text-white hover:bg-rose-dark"
      >
        Try again
      </Link>
    </section>
  );
}
