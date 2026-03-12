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

    const gsapTicker = (time: number) => lenis.raf(time * 1000);
    import("gsap").then(({ default: gsap }) => {
      gsap.ticker.add(gsapTicker);
      gsap.ticker.lagSmoothing(0);
    });

    const t1 = setTimeout(() => ScrollTrigger.refresh(true), 150);
    const t2 = setTimeout(() => ScrollTrigger.refresh(true), 600);
    const onLoad = () => ScrollTrigger.refresh(true);
    window.addEventListener("load", onLoad);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
      import("gsap").then(({ default: gsap }) => {
        gsap.ticker.remove(gsapTicker);
      });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
