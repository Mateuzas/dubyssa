"use client";

import Image from "next/image";
import Link from "next/link";

import { siteMedia } from "@/lib/media";
import { usePinnedViewportHeight } from "@/hooks/use-pinned-viewport-height";

// Same category slugs as NAV_LINKS/footer. Each `image` path resolves via
// `siteMedia()` — see src/lib/media.ts — so to swap in real photography just
// drop the file at the matching path under public/dev-media/ locally (and
// upload it to the `site-media` Supabase bucket at the same path for prod).
const CATEGORIES = [
  {
    label: "Men",
    href: "/products?category=men",
    image: "website_pics/Generated Image July 16, 2026 - 7_53PM.png",
  },
  {
    label: "Women",
    href: "/products?category=women",
    image: "website_pics/Generated Image July 16, 2026 - 7_51PM.png",
  },
  {
    label: "Accessories",
    href: "/products?category=accessories",
    image: "website_pics/Generated Image July 16, 2026 - 7_58PM.png",
  },
] as const;

type Category = (typeof CATEGORIES)[number];

// Each tile pins its own height to one full viewport (see the hook's
// comment for why) rather than the section as a whole. That's deliberate:
// on phones the tiles stack in a single column, so pinning each one
// individually means every tile is its own full-screen "slide" you scroll
// through, matching the hero. On sm+ they sit side by side in a row instead,
// and since every tile resolves to the same viewport-height value, the row
// naturally comes out exactly one screen tall too.
function CategoryTile({ category }: { category: Category }) {
  const tileRef = usePinnedViewportHeight<HTMLAnchorElement>();

  return (
    <Link
      ref={tileRef}
      href={category.href}
      className="group flex h-svh min-h-[640px] w-full flex-col items-center gap-4"
    >
      <div className="relative w-full flex-1 overflow-hidden bg-muted">
        <Image
          src={siteMedia(category.image)}
          alt={category.label}
          fill
          sizes="(min-width: 640px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <span className="kicker shrink-0 border-b border-transparent pb-1 transition-colors group-hover:border-foreground">
        Shop {category.label}
      </span>
    </Link>
  );
}

export function CategoryShowcase() {
  return (
    <section className="w-full px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {CATEGORIES.map((category) => (
          <CategoryTile key={category.label} category={category} />
        ))}
      </div>
    </section>
  );
}
