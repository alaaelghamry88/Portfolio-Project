"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollIndicator } from "./ScrollIndicator";

/**
 * Bottom data bar — replaces the standalone ScrollIndicator.
 * Three-column layout:
 *   Left  — tech stack labels
 *   Center — animated scroll tracker
 *   Right  — availability status
 */
export function HeroDataBar() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.from(el, { opacity: 0, y: 6, duration: 0.6, delay: 1.8, ease: "power3.out" });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="absolute bottom-0 inset-x-0 z-20 grid grid-cols-3 items-center
                 px-8 md:px-16 lg:px-24 py-3"
      style={{
        borderTop: "1px solid rgba(42,50,64,0.8)",
        background: "rgba(26,30,36,0.4)",
        backdropFilter: "blur(4px)",
      }}
      aria-hidden="true"
    >
      {/* Left — stack */}
      <span className="hidden md:block font-mono text-[11px] tracking-[0.1em] uppercase text-paper">
      </span>

      {/* Center — scroll indicator */}
      <div className="flex items-center justify-center">
        <ScrollIndicator />
      </div>

      {/* Right — availability */}
      <div className="hidden md:flex items-center justify-end gap-1.5">
        <div
          className="w-[5px] h-[5px] rounded-full bg-[#2d6a4f]"
          style={{ boxShadow: "0 0 6px #2d6a4f" }}
        />
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-paper">
          Available for work
        </span>
      </div>
    </div>
  );
}
