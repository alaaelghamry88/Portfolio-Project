"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

/**
 * R3F Canvas — separate file so next/dynamic can tree-shake Three.js.
 * Only ever rendered on the client (imported via `dynamic({ ssr: false })`).
 */
export function HeroCanvas() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} // Cap pixel ratio — retina rendering is expensive
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
