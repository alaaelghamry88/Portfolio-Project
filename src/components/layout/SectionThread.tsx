// src/components/layout/SectionThread.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero",       label: "01" },
  { id: "about",      label: "02" },
  { id: "experience", label: "03" },
  { id: "projects",   label: "04" },
  { id: "skills",     label: "05" },
  { id: "contact",    label: "06" },
] as const;

type NodeData = { pct: number; threshold: number };

// Fallback: evenly distributed
const FALLBACK: NodeData[] = SECTIONS.map((_, i) => {
  const pct = SECTIONS.length > 1 ? 6 + (i / (SECTIONS.length - 1)) * 88 : 50;
  return { pct, threshold: pct / 100 };
});

export function SectionThread() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes]       = useState<NodeData[]>(FALLBACK);
  const [activeIdx, setActiveIdx] = useState(0);

  // Calculate real thresholds from section DOM positions
  useEffect(() => {
    const recalc = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      // Trigger when the section is ~40% into the viewport, not when its top hits the top
      const triggerOffset = window.innerHeight * 0.4;
      const thresholds = SECTIONS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? Math.max(0, el.offsetTop - triggerOffset) / maxScroll : null;
      });

      if (thresholds.every((t) => t !== null)) {
        setNodes(
          (thresholds as number[]).map((t) => ({
            pct: Math.min(Math.max(t * 100, 2), 98),
            threshold: t,
          }))
        );
      }
    };

    // Wait for layout (fonts, images, dynamic content)
    const t = setTimeout(recalc, 300);
    window.addEventListener("resize", recalc);
    return () => { clearTimeout(t); window.removeEventListener("resize", recalc); };
  }, []);

  // Scroll-driven fill + active index
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

        let idx = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].threshold <= self.progress + 0.01) idx = i;
        }
        setActiveIdx(idx);
      },
    });

    return () => trigger.kill();
  }, [nodes]); // re-create trigger when nodes recalculate

  return (
    <div
      aria-hidden="true"
      className="fixed left-6 top-0 h-screen z-30 pointer-events-none hidden md:block"
      style={{ width: 20 }}
    >
      {/* Base line */}
      <div
        className="absolute"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: "100%",
          background: "rgba(200,96,42,0.15)",
        }}
      />

      {/* Filled portion */}
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
      {nodes.map(({ pct }, i) => {
        const isActive = activeIdx === i;
        const section  = SECTIONS[i];

        return (
          <div
            key={section.id}
            className="absolute flex items-center justify-center"
            style={{ top: `${pct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
          >
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
