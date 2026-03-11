"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useBreakpoint } from "@/hooks/useMediaQuery";

/* Lazy-load the R3F Canvas so it never SSRs */
const HeroCanvas = dynamic(() => import("./HeroCanvas").then((m) => m.HeroCanvas), {
  ssr: false,
  loading: () => <ModelPlaceholder />,
});

/** Pulsing terracotta dot — shown while the 3D canvas loads */
function ModelPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="block w-3 h-3 rounded-full bg-terracotta animate-pulse" />
    </div>
  );
}

/** Static SVG fallback for mobile / no-WebGL environments */
function MobileFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center opacity-30"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        width="320"
        height="320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylised icosahedron wireframe — terracotta lines */}
        <polygon
          points="100,10 190,70 165,165 35,165 10,70"
          stroke="#c8602a"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        <polygon
          points="100,40 170,85 148,155 52,155 30,85"
          stroke="#c8602a"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <polygon
          points="100,70 145,100 130,148 70,148 55,100"
          stroke="#c8602a"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
        />
        {/* Center glow */}
        <circle cx="100" cy="105" r="8" fill="#c8602a" opacity="0.6" />
        {/* Spokes */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = 100 + 80 * Math.cos(rad - Math.PI / 2);
          const y2 = 100 + 80 * Math.sin(rad - Math.PI / 2);
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x2}
              y2={y2}
              stroke="#c8602a"
              strokeWidth="0.8"
              opacity="0.4"
            />
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Hero 3D model — R3F Canvas on desktop, SVG fallback on mobile.
 * Lazy-loaded to avoid blocking initial paint.
 */
export function HeroModel() {
  const isDesktop = useBreakpoint("md");

  if (!isDesktop) {
    return <MobileFallback />;
  }

  return (
    <Suspense fallback={<ModelPlaceholder />}>
      <HeroCanvas />
    </Suspense>
  );
}
