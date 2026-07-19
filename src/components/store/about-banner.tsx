"use client";

import Image from "next/image";
import Link from "next/link";

import { siteMedia } from "@/lib/media";
import { buttonVariants } from "@/components/ui/button";
import { usePinnedViewportHeight } from "@/hooks/use-pinned-viewport-height";

const ABOUT_IMAGE_SRC = siteMedia(
  "products/image.png"
);

// Full-screen editorial section, same treatment as the hero: a single photo
// filling the viewport with a headline + CTA overlaid, linking through to
// the About page (where the brand's story/principles will live).
export function AboutBanner() {
  // See the hook's own comment for why this is needed on top of `h-svh`.
  const sectionRef = usePinnedViewportHeight<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative h-svh min-h-[560px] w-full overflow-hidden bg-[#1a1c1d]"
    >
      <Image
        src={ABOUT_IMAGE_SRC}
        alt="Behind the scenes at the Dubyssa studio"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 pb-[12vh] text-center text-white">
        <span className="kicker text-white/70">The Studio</span>
        <h2 className="heading-display max-w-lg text-3xl sm:text-4xl md:text-5xl">
          Every piece has a story. So do we.
        </h2>
        <Link href="/about" className={buttonVariants({ size: "cta" })}>
          About Us
        </Link>
      </div>
    </section>
  );
}
