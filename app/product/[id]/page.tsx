import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById, products } from "@/data/products";
import ProductActions from "./ProductActions";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return notFound();

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-body text-xs uppercase tracking-wide text-gold">
          {product.category}
        </p>
        <h1 className="mt-1 font-display text-4xl text-ink">{product.name}</h1>
        <p className="mt-3 font-body text-lg text-ink/80">
          {product.price > 0
            ? `Rs. ${product.price.toLocaleString()}`
            : "Price confirmed after details are shared"}
        </p>
        <p className="mt-6 max-w-md font-body text-ink/70">
          {product.description}
        </p>
        {product.colors && (
          <p className="mt-4 font-body text-sm text-ink/60">
            Available colors: {product.colors.join(", ")}
          </p>
        )}
        <ProductActions product={product} />
      </div>
    </section>
  );
}
