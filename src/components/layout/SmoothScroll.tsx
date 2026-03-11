"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Initialises Lenis smooth scroll and wires it up to GSAP ScrollTrigger.
 * Render this once inside the root layout, inside GSAPProvider.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis ticker to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis with GSAP's ticker for frame-perfect sync
    const gsapTicker = (time: number) => lenis.raf(time * 1000);
    // Import gsap dynamically to avoid SSR issues
    import("gsap").then(({ default: gsap }) => {
      gsap.ticker.add(gsapTicker);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      import("gsap").then(({ default: gsap }) => {
        gsap.ticker.remove(gsapTicker);
      });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
