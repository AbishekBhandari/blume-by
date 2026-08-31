"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { DELIVERY_CHARGE, CITY_OPTIONS } from "@/lib/config";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [sender, setSender] = useState({ name: "", phone: "", email: "" });
  const [receiver, setReceiver] = useState({ name: "", phone: "", email: "" });
  const [city, setCity] = useState(CITY_OPTIONS[0]);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const hasPriceOnRequest = items.some((i) => i.product.price === 0);
  const total = subtotal + DELIVERY_CHARGE;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!sender.name || !sender.phone || !sender.email) {
      setError("Please fill in your name, phone, and email.");
      return;
    }
    if (!receiver.name || !receiver.phone || !address) {
      setError("Please fill in the receiver's name, phone, and address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (hasPriceOnRequest) {
      setError(
        "One or more items need a price confirmed first — reach out on Instagram/WhatsApp before paying, or remove them from the cart."
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: sender.name,
          senderPhone: sender.phone,
          senderEmail: sender.email,
          receiverName: receiver.name,
          receiverPhone: receiver.phone,
          receiverEmail: receiver.email || undefined,
          city,
          address,
          landmark: landmark || undefined,
          deliveryDate: deliveryDate || undefined,
          orderNote: orderNote || undefined,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            note: i.note,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order");

      router.push(`/checkout/pay/${data.id}`);
    } catch (err) {
      setSubmitting(false);
      setError("Something went wrong placing your order. Please try again.");
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-2 font-body text-ink/60">
          Add something from the shop before checking out.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
          <div>
            <h2 className="font-display text-xl text-ink">1. Sender information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-body text-sm text-ink/70">Full name *</label>
                <input
                  value={sender.name}
                  onChange={(e) => setSender({ ...sender, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink/70">Phone number *</label>
                <input
                  value={sender.phone}
                  onChange={(e) => setSender({ ...sender, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-sm text-ink/70">
                  Email * <span className="text-ink/40">(for your receipt)</span>
                </label>
                <input
                  type="email"
                  value={sender.email}
                  onChange={(e) => setSender({ ...sender, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-ink">2. Receiver information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-body text-sm text-ink/70">Full name *</label>
                <input
                  value={receiver.name}
                  onChange={(e) => setReceiver({ ...receiver, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink/70">Phone number *</label>
                <input
                  value={receiver.phone}
                  onChange={(e) => setReceiver({ ...receiver, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-sm text-ink/70">
                  Email <span className="text-ink/40">(optional)</span>
                </label>
                <input
                  type="email"
                  value={receiver.email}
                  onChange={(e) => setReceiver({ ...receiver, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink/70">City/District *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-body text-sm text-ink/70">Estimated delivery date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-sm text-ink/70">Address *</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-sm text-ink/70">
                  Landmark <span className="text-ink/40">(optional)</span>
                </label>
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. near Madan Bhandari Park"
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-sm text-ink/70">
                  Order note <span className="text-ink/40">(optional)</span>
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
                />
              </div>
            </div>
          </div>

          {error && <p className="font-body text-sm text-rose-dark">{error}</p>}

          {/* On mobile this sits at the end of the form; on desktop the
              summary sidebar has its own submit button (same form, via
              the form="checkout-form" attribute) so it stays visible
              without scrolling back up. */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-rose py-3 font-body text-sm font-medium text-white transition hover:bg-rose-dark disabled:opacity-60 lg:hidden"
          >
            {submitting ? "Placing order…" : "Continue to payment"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl bg-surface p-6 ring-1 ring-green/10">
          <h2 className="font-display text-xl text-ink">Order summary</h2>
          <div className="mt-4 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm text-ink">{product.name}</p>
                  <p className="font-body text-xs text-ink/60">
                    {product.price > 0
                      ? `Rs. ${product.price.toLocaleString()} × ${quantity}`
                      : "Price on request"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-green/10 pt-4 font-body text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Sub-total</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Delivery charge</span>
              <span>Rs. {DELIVERY_CHARGE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-green/10 pt-2 font-display text-base text-ink">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={submitting}
            className="mt-6 hidden w-full rounded-full bg-rose py-3 font-body text-sm font-medium text-white transition hover:bg-rose-dark disabled:opacity-60 lg:block"
          >
            {submitting ? "Placing order…" : "Continue to payment"}
          </button>
        </aside>
      </div>
    </section>
  );
}
