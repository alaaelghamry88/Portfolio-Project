"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registers GSAP plugins once at the app root.
 * Must be a client component — wrap around children in RootLayout.
 */
export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register plugins on the client side only
    gsap.registerPlugin(ScrollTrigger);

    // Match Lenis scroll events with ScrollTrigger
    // (Lenis calls this in SmoothScroll.tsx — registered here as a no-op
    //  so the plugin is ready when SmoothScroll mounts)

    return () => {
      // Kill all ScrollTrigger instances on unmount (useful for HMR in dev)
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
