import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Shop</h1>
      <p className="mt-2 max-w-lg font-body text-ink/60">
        Every piece is made to order — allow a few days for your bouquet to
        be twisted by hand before it ships.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
