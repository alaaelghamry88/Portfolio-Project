// src/components/layout/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BLOB_SHAPES = [
  "80% 20% 20% 80% / 80% 20% 80% 20%",
  "20% 80% 80% 20% / 20% 80% 20% 80%",
  "50% 50% 20% 80% / 80% 20% 50% 50%",
  "20% 80% 50% 50% / 50% 50% 80% 20%",
  "70% 30% 80% 20% / 20% 80% 30% 70%",
];

export function CustomCursor() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const blob = blobRef.current;
    if (!blob) return;

    blob.style.opacity = "1";
    document.documentElement.style.cursor = "none";

    const moveX = gsap.quickTo(blob, "x", { duration: 0.25, ease: "power2.out" });
    const moveY = gsap.quickTo(blob, "y", { duration: 0.25, ease: "power2.out" });

    const onMove = (e: MouseEvent) => { moveX(e.clientX); moveY(e.clientY); };
    window.addEventListener("mousemove", onMove);

    // Organic morph loop
    let i = 0;
    const morph = () => {
      i = (i + 1) % BLOB_SHAPES.length;
      gsap.to(blob, { borderRadius: BLOB_SHAPES[i], duration: 1.0, ease: "sine.inOut", onComplete: morph });
    };
    morph();

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.killTweensOf(blob);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        width: 24,
        height: 24,
        marginLeft: -12,
        marginTop: -12,
        background: "radial-gradient(circle at 40% 40%, #e8895a, #c8602a)",
        opacity: 0,
        filter: "blur(1.5px)",
        boxShadow: "0 0 10px rgba(200,96,42,0.5)",
        borderRadius: BLOB_SHAPES[0],
      }}
    />
  );
}
