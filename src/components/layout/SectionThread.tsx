// src/components/layout/SectionThread.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppSelector } from "@/store/hooks";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero",     label: "01" },
  { id: "about",    label: "02" },
  { id: "projects", label: "03" },
  { id: "skills",   label: "04" },
  { id: "contact",  label: "05" },
] as const;

export function SectionThread() {
  const fillRef    = useRef<HTMLDivElement>(null);
  const activeSection = useAppSelector((s) => s.navigation.activeSection);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const setScale = gsap.quickTo(fill, "scaleY", { duration: 0.1, ease: "none" });

    const trigger = ScrollTrigger.create({
      start:   "top top",
      end:     "bottom bottom",
      scrub:   true,
      onUpdate: (self) => {
        setScale(self.progress);
      },
    });

    return () => trigger.kill();
  }, []);

  // Node positions: distribute within 6%–94% so first/last nodes stay in viewport
  const nodeCount = SECTIONS.length;

  return (
    <div
      aria-hidden="true"
      className="fixed left-6 top-0 h-screen z-30 pointer-events-none hidden md:block"
      style={{ width: 20 }}
    >
      {/* Base line — full height, faint */}
      <div
        className="absolute inset-x-0 mx-auto"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: "100%",
          background: "rgba(200,96,42,0.15)",
        }}
      />

      {/* Filled portion — grows as page scrolls */}
      <div
        ref={fillRef}
        className="absolute top-0"
        style={{
          left: "50%",
          transformOrigin: "top center",
          transform: "translateX(-50%) scaleY(0)",
          width: 1,
          height: "100%",
          background: "#c8602a",
          boxShadow: "0 0 6px rgba(200,96,42,0.5)",
        }}
      />

      {/* Section nodes */}
      {SECTIONS.map((section, i) => {
        const isActive = activeSection === section.id;
        const pct = nodeCount > 1 ? 6 + (i / (nodeCount - 1)) * 88 : 50;

        return (
          <div
            key={section.id}
            className="absolute flex items-center justify-center"
            style={{ top: `${pct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {/* Pulse ring — visible only on active */}
            {isActive && (
              <span
                className="absolute rounded-full"
                style={{
                  inset: -6,
                  border: "1px solid rgba(200,96,42,0.4)",
                  animation: "orb-pulse 2.5s ease-in-out infinite",
                }}
              />
            )}

            {/* Node circle */}
            <div
              className="flex items-center justify-center rounded-full transition-all duration-400"
              style={{
                width:      isActive ? 16 : 10,
                height:     isActive ? 16 : 10,
                background: isActive ? "#c8602a" : "transparent",
                border:     isActive ? "none" : "1px solid rgba(58,69,85,0.8)",
                boxShadow:  isActive ? "0 0 10px rgba(200,96,42,0.5)" : "none",
              }}
            />

            {/* Label — only when active */}
            {isActive && (
              <span
                className="absolute font-mono text-[9px] text-terracotta"
                style={{ left: 20, whiteSpace: "nowrap" }}
              >
                {section.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
