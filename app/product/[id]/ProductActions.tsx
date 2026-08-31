"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useCart } from "@/components/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, quantity, note || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-8 space-y-4">
      {product.category === "Custom" && (
        <div>
          <label className="font-body text-sm text-ink/70" htmlFor="note">
            Tell us about the occasion, colors, and size
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
            placeholder="e.g. Birthday bouquet, blush and cream, medium size"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="font-body text-sm text-ink/70" htmlFor="qty">
          Quantity
        </label>
        <div className="flex items-center rounded-lg border border-green/20 bg-surface">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-3 py-2 font-body text-lg leading-none text-ink"
          >
            −
          </button>
          <input
            id="qty"
            type="number"
            min={1}
            inputMode="numeric"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-10 border-0 bg-transparent p-0 text-center font-body text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="px-3 py-2 font-body text-lg leading-none text-ink"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleAdd}
          className="rounded-full bg-rose px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-rose-dark"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
        <button
          onClick={() => {
            addItem(product, quantity, note || undefined);
            router.push("/checkout");
          }}
          className="rounded-full border border-green px-6 py-3 font-body text-sm font-medium text-green transition hover:bg-green/5"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
