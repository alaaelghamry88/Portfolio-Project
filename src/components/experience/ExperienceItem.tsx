// src/components/experience/ExperienceItem.tsx
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
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
    const dotRef     = useRef<HTMLDivElement>(null);

    const prefersReduced = usePrefersReducedMotion();
    const { color }      = experience;

    useImperativeHandle(ref, () => ({
      open() {
        const el  = contentRef.current;
        const num = numRef.current;
        const dot = dotRef.current;
        if (!el) return;

        if (prefersReduced) { el.style.height = "auto"; return; }

        const h = el.scrollHeight;
        gsap.to(el,  { height: h, duration: 0.5, ease: "power3.out", overwrite: true });
        if (num) gsap.to(num, { color, duration: 0.3 });
        if (dot) gsap.to(dot, { backgroundColor: color, scale: 1.6, duration: 0.3 });
      },

      close(onComplete) {
        const el  = contentRef.current;
        const num = numRef.current;
        const dot = dotRef.current;
        if (!el) { onComplete?.(); return; }

        if (prefersReduced) { el.style.height = "0px"; onComplete?.(); return; }

        gsap.to(el,  { height: 0, duration: 0.35, ease: "power3.in", overwrite: true, onComplete });
        if (num) gsap.to(num, { color: alpha(color, 0.18), duration: 0.3 });
        if (dot) gsap.to(dot, { backgroundColor: alpha(color, 0.3), scale: 1, duration: 0.3 });
      },
    }));

    const num   = String(index + 1).padStart(2, "0");
    const dates = `${experience.startDate} – ${experience.endDate ?? "Present"}`;
    const place = experience.remote
      ? `${experience.location} · Remote`
      : experience.location;

    return (
      <div
        data-exp-row
        className="relative border-b border-border/30 last:border-b-0"
      >
        {/* Node dot sitting on the thread line */}
        <div
          ref={dotRef}
          className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ backgroundColor: alpha(color, 0.3) }}
        />

        {/* ── Collapsed header ────────────────────────────────── */}
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group w-full text-left pl-8 pr-2 py-8 flex items-start gap-6 md:gap-10 hover:bg-white/[0.02] rounded-sm transition-colors duration-200 cursor-pointer"
        >
          {/* Giant index number */}
          <span
            ref={numRef}
            className="font-mono font-black leading-none flex-shrink-0 select-none text-[4.5rem] md:text-[5.5rem] w-20 md:w-24"
            style={{ color: alpha(color, 0.18) }}
            aria-hidden="true"
          >
            {num}
          </span>

          {/* Role + company */}
          <div className="flex-1 min-w-0 pt-2 md:pt-3">
            <p className="font-display font-semibold text-foreground text-2xl md:text-[1.85rem] leading-tight group-hover:text-foreground transition-colors">
              {experience.role}
            </p>
            <p className="font-mono text-sm mt-2 text-muted-foreground tracking-wide">
              <span style={{ color }}>{experience.company}</span>
              {"  ·  "}
              {place}
            </p>
          </div>

          {/* Date range + expand indicator — desktop only */}
          <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0 pt-3">
            <span className="font-mono text-xs text-muted-foreground/50 tracking-wide tabular-nums whitespace-nowrap">
              {dates}
            </span>
            <span
              className="font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ color: isOpen ? color : "rgba(255,255,255,0.18)" }}
            >
              {isOpen ? "↑ collapse" : "↓ expand"}
            </span>
          </div>
        </button>

        {/* ── Expandable body ──────────────────────────────────── */}
        <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
          <div
            className="pl-8 pr-4 pb-10 pt-1"
            style={{ borderTop: `1px solid ${alpha(color, 0.12)}` }}
          >
            {/* Description */}
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-5 mb-5 max-w-2xl">
              {experience.description}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {experience.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                  style={{
                    color,
                    background: alpha(color, 0.08),
                    border: `1px solid ${alpha(color, 0.22)}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Achievements */}
            {experience.achievements.length > 0 && (
              <ul className="flex flex-col gap-3">
                {experience.achievements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-muted-foreground">
                    <span
                      className="flex-shrink-0 font-mono text-xs mt-0.5 tabular-nums"
                      style={{ color }}
                    >
                      {String(i + 1).padStart(2, "0")} ·
                    </span>
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
