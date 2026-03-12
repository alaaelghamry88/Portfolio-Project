// src/components/layout/ScrollProgress.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const setScale = gsap.quickTo(bar, "scaleX", { duration: 0.1, ease: "none" });

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = total > 0 ? scrolled / total : 0;
      setScale(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-px pointer-events-none"
      style={{ background: "rgba(200,96,42,0.15)" }}
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "100%",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          background: "#c8602a",
          boxShadow: "0 0 8px rgba(200,96,42,0.6)",
        }}
      />
    </div>
  );
}
