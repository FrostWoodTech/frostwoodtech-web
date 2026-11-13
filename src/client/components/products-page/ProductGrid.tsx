import ProductCard from "./ProductCard";
import type { Product } from "@/client/types";

interface ProductGridProps {
  readonly products: readonly Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[20px] border border-card-br bg-card py-20 text-center shadow-card">
        <p className="font-display text-[22px] font-medium text-text-primary">
          Nothing here yet.
        </p>
        <p className="mt-2 text-[15px] text-text-secondary">
          Check back soon — we&apos;re building out the lineup.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
