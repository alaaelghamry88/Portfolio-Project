// src/components/layout/ScrollProgress.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // GSAP owns the transform — avoids CSS/GSAP conflict
    gsap.set(bar, { scaleX: 0 });
    const setScale = gsap.quickTo(bar, "scaleX", { duration: 0.1, ease: "none" });

    // Use ScrollTrigger (Lenis-connected) instead of native scroll events
    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setScale(self.progress),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      style={{ height: 3, background: "rgba(200,96,42,0.12)" }}
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "100%",
          transformOrigin: "left center",
          background: "#c8602a",
          boxShadow: "0 0 8px rgba(200,96,42,0.6)",
        }}
      />
    </div>
  );
}
