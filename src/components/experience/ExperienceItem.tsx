// src/components/experience/ExperienceItem.tsx
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Experience } from "@/data/experience";

export interface ExperienceItemHandle {
  open: () => void;
  close: (onComplete?: () => void) => void;
}

interface Props {
  experience: Experience;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

/** Hex color → same hex at ~25% opacity (appends "40" alpha byte) */
function dimColor(hex: string): string {
  return hex + "40";
}

/** Hex color → rgba string at given 0–1 opacity */
function alpha(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export const ExperienceItem = forwardRef<ExperienceItemHandle, Props>(
  function ExperienceItem({ experience, index, isOpen, onToggle }, ref) {
    const contentRef = useRef<HTMLDivElement>(null);
    const numRef     = useRef<HTMLSpanElement>(null);
    const chevronRef = useRef<HTMLDivElement>(null);

    const prefersReduced = usePrefersReducedMotion();
    const { color } = experience;

    useImperativeHandle(ref, () => ({
      open() {
        const el   = contentRef.current;
        const num  = numRef.current;
        const chev = chevronRef.current;
        if (!el) return;

        if (prefersReduced) {
          el.style.height = "auto";
          return;
        }

        const h = el.scrollHeight;
        gsap.to(el,   { height: h,    duration: 0.4, ease: "power3.out", overwrite: true });
        gsap.to(num,  { color,        duration: 0.2 });
        gsap.to(chev, { rotation: 180, duration: 0.3 });
      },

      close(onComplete) {
        const el   = contentRef.current;
        const num  = numRef.current;
        const chev = chevronRef.current;

        if (!el) { onComplete?.(); return; }

        if (prefersReduced) {
          el.style.height = "0px";
          onComplete?.();
          return;
        }

        gsap.to(el,   { height: 0,           duration: 0.3, ease: "power3.in", overwrite: true, onComplete });
        gsap.to(num,  { color: dimColor(color), duration: 0.3 });
        gsap.to(chev, { rotation: 0,           duration: 0.3 });
      },
    }));

    const num   = String(index + 1).padStart(2, "0");
    const dates = `${experience.startDate} – ${experience.endDate ?? "Present"}`;
    const place = experience.remote
      ? `${experience.location} · Remote`
      : experience.location;

    return (
      <div className="border-b border-border last:border-b-0">
        {/* ── Collapsed header ─────────────────────────────── */}
        <button
          onClick={onToggle}
          className="w-full text-left py-5 px-1 flex items-center gap-4 rounded-lg hover:bg-white/[0.02] transition-colors duration-150"
          aria-expanded={isOpen}
        >
          <span
            ref={numRef}
            className="font-mono text-4xl font-black leading-none flex-shrink-0 w-14 select-none"
            style={{ color: dimColor(color) }}
            aria-hidden="true"
          >
            {num}
          </span>

          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground text-lg leading-tight">
              {experience.role}
            </p>
            <p className="font-body text-base text-muted-foreground mt-1">
              <span style={{ color }}>{experience.company}</span>
              {" · "}
              {place}
              {" · "}
              {dates}
            </p>
          </div>

          <div ref={chevronRef} className="flex-shrink-0 text-muted-foreground" style={{ display: "flex" }}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        {/* ── Expandable content ───────────────────────────── */}
        <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
          <div className="pl-[4.75rem] pr-4 pb-6">

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {experience.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.65rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    color,
                    background: alpha(color, 0.12),
                    border: `1px solid ${alpha(color, 0.3)}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description — left-border callout strip */}
            <div
              className="pl-3 mb-4"
              style={{
                borderLeft: `2px solid ${alpha(color, 0.5)}`,
                background: alpha(color, 0.05),
                borderRadius: "0 4px 4px 0",
              }}
            >
              <p className="font-body text-base text-muted-foreground leading-relaxed py-2">
                {experience.description}
              </p>
            </div>

            {/* Achievements */}
            {experience.achievements.length > 0 && (
              <ul className="flex flex-col gap-2">
                {experience.achievements.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-body text-base text-muted-foreground"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-xs" style={{ color }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  },
);
