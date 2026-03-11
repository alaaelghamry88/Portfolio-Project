"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins at module scope — runs once per client bundle
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Global animation defaults — "The Craftsman's Journal" motion language
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

/**
 * Registers GSAP plugins and sets global defaults.
 * Must wrap the entire app tree (inside layout.tsx) so ScrollTrigger
 * is available to all components before they mount.
 */
export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh after hydration so ScrollTrigger recalculates element positions
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
