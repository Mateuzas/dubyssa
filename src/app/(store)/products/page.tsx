import { and, asc, desc, eq, ilike } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import { ProductFilterBar } from "@/components/store/product-filter-bar";
import { ProductGrid } from "@/components/store/product-grid";

// Keep in sync with header NAV_LINKS / ProductFilterBar category slugs.
const CATEGORY_LABELS: Record<string, string> = {
  "new-arrivals": "New Arrivals",
  men: "Men",
  women: "Women",
  accessories: "Accessories",
};

async function getProducts({
  category,
  q,
  sort,
}: {
  category?: string;
  q?: string;
  sort?: string;
}) {
  try {
    const db = getDb();
    const conditions = [eq(schema.products.isPublished, true)];

    // "new-arrivals" isn't a real category value — it just means "show
    // everything, newest first", which is already the default ordering.
    if (category && category !== "new-arrivals") {
      conditions.push(eq(schema.products.category, category));
    }
    if (q) {
      conditions.push(ilike(schema.products.name, `%${q}%`));
    }

    const orderBy =
      sort === "price-asc"
        ? asc(schema.products.priceCents)
        : sort === "price-desc"
          ? desc(schema.products.priceCents)
          : desc(schema.products.createdAt);

    return await db
      .select()
      .from(schema.products)
      .where(and(...conditions))
      .orderBy(orderBy);
  } catch (error) {
    // Keep the page rendering (filter bar, empty grid) even if the
    // database is unreachable, rather than throwing a 500.
    console.error("Failed to load products:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort } = await searchParams;
  const products = await getProducts({ category, q, sort });

  const heading = q
    ? `Results for "${q}"`
    : (category && CATEGORY_LABELS[category]) || "All Products";

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="heading-display mb-8 text-3xl sm:text-4xl">{heading}</h1>
      <ProductFilterBar category={category} q={q} sort={sort} />
      <div className="pt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
