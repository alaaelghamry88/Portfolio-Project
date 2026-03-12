"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true if the user has requested reduced motion in their OS settings.
 * Use this to disable or simplify GSAP animations for accessibility.
 *
 * @example
 * const reduced = usePrefersReducedMotion();
 * if (!reduced) gsap.to(el, { y: -20, duration: 0.8 });
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false, // SSR snapshot
  );
}
