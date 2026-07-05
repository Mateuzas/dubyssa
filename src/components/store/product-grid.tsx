import { ProductCard } from "./product-card";

type GridProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  images: string[];
};

export function ProductGrid({ products }: { products: GridProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-sm text-muted-foreground">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
