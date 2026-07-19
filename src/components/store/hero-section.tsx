"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { siteMedia } from "@/lib/media";
import { buttonVariants } from "@/components/ui/button";
import { usePinnedViewportHeight } from "@/hooks/use-pinned-viewport-height";

// Same breakpoint as everywhere else on the site (Tailwind's `sm`, 640px).
// Below it we're on a phone-sized viewport and swap in the vertical video —
// its 9:16 crop only makes sense there, so there's no reason to ever fetch
// it on desktop (and vice versa for the landscape photo).
const MOBILE_QUERY = "(max-width: 639.98px)";

const HERO_VIDEO_SRC = siteMedia(
  "website_pics/dubyssa_1776193544_3875313699762218249_2289332988.mp4"
);

export function HeroSection() {
  // See the hook's own comment for why this is needed on top of `h-svh`.
  const sectionRef = usePinnedViewportHeight<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Which element is *visible* is decided purely by the `sm:hidden` /
  // `hidden sm:block` CSS below, so it's correct from the very first paint
  // with zero JS-timing flash (unlike deciding via JS state, which can only
  // resolve after hydration and briefly shows the wrong one).
  //
  // The video's `src` is a different story: we only want to actually fetch
  // that (multi-MB) file on phones, never on desktop. So it's left empty in
  // the markup and only assigned here, after confirming via matchMedia that
  // we're really on a phone-sized viewport.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mql = window.matchMedia(MOBILE_QUERY);

    const sync = () => {
      if (mql.matches && !video.src) {
        video.src = HERO_VIDEO_SRC;
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-11 h-svh min-h-[640px] w-full overflow-hidden bg-[#1a1c1d] sm:-mt-12"
    >
      {/* Phone: vertical video, sized by width so it always fills the full
          horizontal space edge-to-edge with no cropping/zoom — height
          follows its native aspect ratio and is vertically centered,
          letting the dark background frame the top/bottom instead of
          forcing a crop to cover the (very tall) viewport height. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-auto w-full -translate-y-1/2 sm:hidden"
      />
      {/* Laptop/desktop: the video's 9:16 crop looks cramped on wide
          viewports, so use the landscape photo instead. */}
      <Image
        src={siteMedia(
          "website_pics/dubyssa_1719872656_3402860936308029633_2289332988 (1).jpg"
        )}
        alt="Fall / Winter Collection"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[12vh]">
        <Link href="/products" className={buttonVariants({ size: "cta" })}>
          Shop the Collection
        </Link>
      </div>
    </section>
  );
}
