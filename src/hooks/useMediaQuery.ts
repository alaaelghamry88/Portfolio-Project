"use client";

import { useState, useEffect } from "react";
import { BREAKPOINTS, type Breakpoint } from "@/lib/constants";

/**
 * Returns true if the viewport matches the given media query string.
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 767px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
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
