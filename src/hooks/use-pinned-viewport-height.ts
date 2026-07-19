"use client";

import { useEffect, useRef } from "react";

/**
 * Pins an element's height to a fixed pixel value captured on mount instead
 * of relying purely on `h-svh`/`dvh`. Mobile browsers collapse/expand their
 * address bar as you scroll, and some of them recompute `*vh` units live as
 * that happens — which makes anything sized off it appear to zoom/resize
 * mid-scroll. Capturing `window.innerHeight` once (and only re-capturing on
 * a genuine orientation change, not on scroll-driven toolbar resizes) keeps
 * it visually static, matching desktop.
 *
 * Used by any full-viewport section (hero, about banner, ...) so the fix —
 * and the reasoning behind it — lives in one place.
 */
export function usePinnedViewportHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const pinHeight = () => {
      if (ref.current) {
        ref.current.style.height = `${window.innerHeight}px`;
      }
    };
    pinHeight();
    window.addEventListener("orientationchange", pinHeight);
    return () => window.removeEventListener("orientationchange", pinHeight);
  }, []);

  return ref;
}
