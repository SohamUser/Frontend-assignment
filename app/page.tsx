import { ProductListing } from "@/components/products/product-listing";
import { products } from "@/data/products";

export default function Home() {
  return <ProductListing products={products} />;
}
