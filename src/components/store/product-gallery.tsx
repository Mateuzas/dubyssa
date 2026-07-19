import Image from "next/image";

import { PlaceholderImage } from "./placeholder-image";

export function ProductGallery({
  images,
  videoUrl,
  name,
}: {
  images: string[];
  videoUrl?: string | null;
  name: string;
}) {
  if (images.length === 0 && !videoUrl) {
    return (
      <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
        <PlaceholderImage className="absolute inset-0" label={name} />
      </div>
    );
  }

  return (
    // Fixed-size viewport onto the photo stack: scrolling (wheel/touch) inside
    // it steps through photos one by one, while `overscroll-contain` stops
    // that scroll from ever "spilling over" into a page scroll once the top
    // or bottom photo is reached — the page stays put, only the photos move.
    <div
      className="no-scrollbar flex aspect-3/4 w-full snap-y snap-mandatory flex-col overflow-y-auto overscroll-y-contain bg-muted lg:sticky lg:top-24 lg:aspect-auto lg:h-[calc(100vh-7rem)]"
      style={{ scrollSnapStop: "always" }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          className="relative aspect-3/4 w-full shrink-0 snap-start overflow-hidden lg:aspect-auto lg:h-full"
        >
          <Image
            src={src}
            alt={i === 0 ? name : ""}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={i === 0}
            className="object-cover"
          />
        </div>
      ))}
      {videoUrl && (
        <div className="relative aspect-3/4 w-full shrink-0 snap-start overflow-hidden lg:aspect-auto lg:h-full">
          <video
            src={videoUrl}
            poster={images[0]}
            controls
            playsInline
            preload="none"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
