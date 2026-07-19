// Canonical list of top-level product categories. Used by the admin
// category dropdown (so category values can't be mistyped) and by the
// storefront nav/filters, which key off these same slugs.
export const PRODUCT_CATEGORIES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "accessories", label: "Accessories" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];
