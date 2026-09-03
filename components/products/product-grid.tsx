import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: readonly Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id} className={`min-w-0 ${product.featured ? "md:col-span-2" : ""}`}>
          <ProductCard product={product} preloadImage={index === 0} />
        </li>
      ))}
    </ul>
  );
}
