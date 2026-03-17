// src/components/layout/PreloaderWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// dynamic with ssr:false must live inside a Client Component
const Preloader = dynamic(
  () => import("@/components/layout/Preloader").then((m) => m.Preloader),
  { ssr: false }
);

export function PreloaderWrapper() {
  return <Preloader />;
}
