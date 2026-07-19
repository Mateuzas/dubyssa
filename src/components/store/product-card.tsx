"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { PlaceholderImage } from "./placeholder-image";

type ProductCardProduct = {
  slug: string;
  name: string;
  priceCents: number;
  images: string[];
};

// The very first switch fires almost immediately, so a first-time visitor
// immediately understands hovering cycles the photos; every switch after
// that settles into the slower, more comfortable browsing pace.
const FIRST_STEP_MS = 350;
const HOVER_CYCLE_MS = 2000;

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const [hovered, setHovered] = useState(false);
  // Other photos are only mounted once the card has been hovered at least
  // once, so grids full of products don't eagerly fetch every extra photo.
  const [activated, setActivated] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasSteppedOnce, setHasSteppedOnce] = useState(false);

  const primary = product.images[0];
  const hasMultiple = product.images.length > 1;
  const slides = activated ? product.images : [primary];

  useEffect(() => {
    if (!hovered || !hasMultiple) return;

    const delay = hasSteppedOnce ? HOVER_CYCLE_MS : FIRST_STEP_MS;
    const timeout = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % product.images.length);
      setHasSteppedOnce(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [hovered, hasMultiple, activeIndex, hasSteppedOnce, product.images.length]);

  function handleMouseEnter() {
    setHovered(true);
    setActivated(true);
  }

  function handleMouseLeave() {
    setHovered(false);
    setActiveIndex(0);
    setHasSteppedOnce(false);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
        {primary ? (
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((src, i) => (
              <div key={src} className="relative h-full w-full shrink-0">
                <Image
                  src={src}
                  alt={i === 0 ? product.name : ""}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <PlaceholderImage className="absolute inset-0" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">{product.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}
