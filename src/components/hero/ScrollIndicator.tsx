"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Animated scroll prompt at the bottom of the hero.
 * Fades in at 1.8s and loops a gentle bounce.
 * Fades out when the user scrolls past the hero.
 */
export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Entrance: fade in
      gsap.from(el, { opacity: 0, y: 8, duration: 0.6, delay: 1.8 });

      // Loop: subtle bounce
      gsap.to(el, {
        y: 6,
        duration: 1.0,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.4,
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      aria-hidden="true"
    >
      <span className="font-mono text-xs tracking-widest text-paper-muted uppercase">
        scroll
      </span>
      {/* Animated track + dot */}
      <div className="w-px h-10 bg-steel-border relative overflow-hidden rounded-full">
        <div className="absolute top-0 left-0 w-full h-4 bg-terracotta rounded-full animate-[scrollDot_1.5s_ease-in-out_infinite_2.4s]" />
      </div>
    </div>
  );
}
