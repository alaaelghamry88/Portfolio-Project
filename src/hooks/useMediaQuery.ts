"use client";

import { useSyncExternalStore } from "react";
import { BREAKPOINTS, type Breakpoint } from "@/lib/constants";

/**
 * Returns true if the viewport matches the given media query string.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 767px)");
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false, // SSR snapshot
  );
}

/**
 * Convenience hook — returns true if viewport is >= the named breakpoint.
 *
 * @example
 * const isDesktop = useBreakpoint("lg"); // true when width >= 1024px
 */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}
