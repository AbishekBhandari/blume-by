"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-2 font-body text-ink/60">
          Nothing here yet — go find a flower you love.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-green px-6 py-3 font-body text-sm font-medium text-bg hover:bg-green-dark"
        >
          Browse the shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Your cart</h1>

      <div className="mt-8 divide-y divide-green/10">
        {items.map(({ product, quantity, note }) => (
          <div key={product.id} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-ink">{product.name}</h3>
              <p className="font-body text-sm text-ink/60">
                {product.price > 0
                  ? `Rs. ${product.price.toLocaleString()}`
                  : "Price on request"}
              </p>
              {note && (
                <p className="mt-1 font-body text-xs italic text-ink/50">
                  Note: {note}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3">
                <label className="font-body text-xs text-ink/60">Qty</label>
                <div className="flex items-center rounded-lg border border-green/20 bg-surface">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                    className="px-2.5 py-1 font-body text-base leading-none text-ink"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(product.id, Number(e.target.value))
                    }
                    className="w-8 border-0 bg-transparent p-0 text-center font-body text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Increase quantity"
                    className="px-2.5 py-1 font-body text-base leading-none text-ink"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="font-body text-xs text-rose underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-green/10 pt-6">
        <p className="font-display text-xl text-ink">Subtotal</p>
        <p className="font-display text-xl text-ink">
          Rs. {subtotal.toLocaleString()}
        </p>
      </div>
      <p className="mt-1 font-body text-xs text-ink/50">
        Items marked "price on request" will be confirmed before payment.
      </p>

      <Link
        href="/checkout"
        className="mt-8 block w-full rounded-full bg-rose py-3 text-center font-body text-sm font-medium text-white hover:bg-rose-dark"
      >
        Proceed to checkout
      </Link>
    </section>
  );
}
