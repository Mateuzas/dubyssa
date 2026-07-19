import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/components/store/product-grid";

// Keep in sync with header NAV_LINKS / homepage CategoryShowcase category
// slugs.
const CATEGORY_FILTERS = [
  { label: "All", value: undefined },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
  accessories: "Accessories",
};

async function getProducts(category?: string) {
  try {
    const db = getDb();
    const conditions = [eq(schema.products.isPublished, true)];

    if (category) {
      conditions.push(eq(schema.products.category, category));
    }

    return await db
      .select()
      .from(schema.products)
      .where(and(...conditions))
      .orderBy(desc(schema.products.createdAt));
  } catch (error) {
    // Keep the page rendering (category nav, empty grid) even if the
    // database is unreachable, rather than throwing a 500.
    console.error("Failed to load products:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  const heading = (category && CATEGORY_LABELS[category]) || "All Products";

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="heading-display mb-8 text-3xl sm:text-4xl">{heading}</h1>
      <nav className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border pb-6">
        {CATEGORY_FILTERS.map((filter) => {
          const active = (category ?? undefined) === filter.value;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/products?category=${filter.value}` : "/products"}
              className={cn(
                "kicker transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </nav>
      <div className="pt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
