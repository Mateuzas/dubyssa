import Link from "next/link";

import { cn } from "@/lib/utils";

// Freeform `category` text column (see src/lib/db/schema.ts) — keep these
// slugs in sync with whatever gets seeded, same as header NAV_LINKS.
const CATEGORY_FILTERS = [
  { label: "All", value: undefined },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest", value: undefined },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const;

function buildHref(
  current: { category?: string; q?: string; sort?: string },
  next: { category?: string; sort?: string }
) {
  const params = new URLSearchParams();
  const category = "category" in next ? next.category : current.category;
  const sort = "sort" in next ? next.sort : current.sort;
  if (category) params.set("category", category);
  if (current.q) params.set("q", current.q);
  if (sort) params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function ProductFilterBar({
  category,
  q,
  sort,
}: {
  category?: string;
  q?: string;
  sort?: string;
}) {
  const current = { category, q, sort };

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        {CATEGORY_FILTERS.map((filter) => {
          const active = (category ?? undefined) === filter.value;
          return (
            <Link
              key={filter.label}
              href={buildHref(current, { category: filter.value })}
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

      <nav className="flex flex-wrap gap-x-5 gap-y-2">
        {SORT_OPTIONS.map((option) => {
          const active = (sort ?? undefined) === option.value;
          return (
            <Link
              key={option.label}
              href={buildHref(current, { sort: option.value })}
              className={cn(
                "kicker transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
