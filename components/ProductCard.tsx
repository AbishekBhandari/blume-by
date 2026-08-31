import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-green/5 transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="font-body text-xs uppercase tracking-wide text-gold">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-lg text-ink">{product.name}</h3>
        <p className="mt-1 font-body text-sm text-ink/70">
          {product.price > 0 ? `Rs. ${product.price.toLocaleString()}` : "Price on request"}
        </p>
      </div>
    </Link>
  );
}
