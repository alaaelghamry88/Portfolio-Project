// src/components/layout/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Make cursor elements visible
    dot.style.opacity  = "1";
    ring.style.opacity = "1";

    // Hide native cursor on the whole page
    document.documentElement.style.cursor = "none";

    const moveX = gsap.quickTo(dot,  "x", { duration: 0,    ease: "none" });
    const moveY = gsap.quickTo(dot,  "y", { duration: 0,    ease: "none" });
    const lagX  = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
    const lagY  = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
      lagX(e.clientX);
      lagY(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.65, duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { opacity: 0,  duration: 0.15 });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1,   duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { opacity: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMove);

    // Watch for interactive elements entering/leaving
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    function attachListeners() {
      document
        .querySelectorAll("a, button, [role='button'], input, textarea, select, label")
        .forEach((el) => {
          el.removeEventListener("mouseenter", onEnterInteractive);
          el.removeEventListener("mouseleave", onLeaveInteractive);
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });
    }
    attachListeners();

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      document.documentElement.style.cursor = "";
    };
  }, []);

  // Dot and ring start invisible; shown only on pointer:fine devices
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          background: "#c8602a",
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
          border: "1.5px solid rgba(200,96,42,0.5)",
          opacity: 0,
        }}
      />
    </>
  );
}
