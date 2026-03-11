"use client";

import { useState, useEffect } from "react";

/**
 * Returns true if the user has requested reduced motion in their OS settings.
 * Use this to disable or simplify GSAP animations for accessibility.
 *
 * @example
 * const reduced = usePrefersReducedMotion();
 * if (!reduced) gsap.to(el, { y: -20, duration: 0.8 });
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
