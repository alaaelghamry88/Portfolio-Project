"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/types/project";
import { tagColor } from "@/data/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project;
  index: number;
}

export function ProjectIndexRow({ project, index }: Props) {
  const rowRef         = useRef<HTMLAnchorElement>(null);
  const isMobile       = useMediaQuery("(max-width: 767px)");
  const prefersReduced = usePrefersReducedMotion();

  // Each row owns its own entrance animation so the swap between
  // DesktopRow / MobileRow (triggered by useMediaQuery firing after hydration)
  // doesn't leave the new DOM node stuck at opacity:0.
  useGSAP(
    () => {
      const el = rowRef.current;
      if (!el) return;

      if (prefersReduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    },
    { dependencies: [prefersReduced, isMobile] },
  );

  return isMobile
    ? <MobileRow ref={rowRef} project={project} index={index} />
    : <DesktopRow ref={rowRef} project={project} index={index} />;
}

// ── Desktop row ───────────────────────────────────────────────────────────────

const DesktopRow = forwardRef<HTMLAnchorElement, Props>(function DesktopRow(
  { project, index },
  ref,
) {
  const number = `/${String(index).padStart(2, "0")}`;

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      data-index-row
      aria-label={`View project: ${project.title}`}
      className="group relative block border-t border-border last:border-b"
      style={{ opacity: 0 }}
    >
      {/* Terracotta divider — sweeps in from the left on row-hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-x-100"
      />

      <div className="relative flex items-center gap-5 lg:gap-8 py-8 lg:py-10 px-2 md:px-3 transition-colors duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:bg-steel/25">
        {/* Row number */}
        <span className="flex-none w-10 lg:w-14 font-mono text-[11px] tracking-[0.2em] text-muted-foreground self-start pt-2 transition-colors duration-300 group-hover:text-terracotta">
          {number}
        </span>

        {/* Title + tagline — takes remaining space */}
        <div className="flex-1 min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-2">
          <h3 className="font-display font-bold text-foreground text-3xl md:text-4xl lg:text-[3.25rem] leading-[1.02] tracking-[-0.025em]">
            {project.title}
          </h3>
          <p className="mt-2 font-body text-sm md:text-[0.95rem] text-muted-foreground line-clamp-1 max-w-xl">
            {project.tagline}
          </p>
        </div>

        {/* Tags — hidden below lg to give typography room */}
        <div className="hidden lg:flex flex-none flex-wrap items-center gap-1.5 justify-end max-w-[220px]">
          {project.tags.slice(0, 3).map((tag) => {
            const color = tagColor(tag);
            return (
              <span
                key={tag}
                className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors duration-300"
                style={{
                  color,
                  background: `${color}14`,
                  border: `1px solid ${color}30`,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Year + role pair */}
        <div className="flex-none flex flex-col items-end text-right min-w-[56px]">
          <span className="font-mono text-xs text-foreground tabular-nums">
            {project.year}
          </span>
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1 whitespace-nowrap">
            {project.role}
          </span>
        </div>

        {/* Floating thumb — in-row, reveals on row hover (xl+) */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none hidden xl:block flex-none relative",
            "w-[120px] h-[72px] rounded-[6px] overflow-hidden",
            "ring-1 ring-terracotta/25",
            "opacity-0 translate-x-3 scale-95",
            "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
            "group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100",
          )}
        >
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="120px"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-tr from-steel-deep/40 via-transparent to-transparent" />
        </div>

        {/* Arrow */}
        <span
          aria-hidden="true"
          className={cn(
            "flex-none flex items-center justify-center w-10 h-10 rounded-full",
            "border border-border text-muted-foreground text-sm",
            "transition-[border-color,color,transform,background-color] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
            "group-hover:border-terracotta group-hover:text-terracotta group-hover:bg-terracotta/10 group-hover:-rotate-45",
          )}
        >
          →
        </span>
      </div>
    </Link>
  );
});

// ── Mobile row ────────────────────────────────────────────────────────────────

const MobileRow = forwardRef<HTMLAnchorElement, Props>(function MobileRow(
  { project, index },
  ref,
) {
  const number = `/${String(index).padStart(2, "0")}`;

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      data-index-row
      aria-label={`View project: ${project.title}`}
      className="group block border-t border-border last:border-b py-6"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-terracotta pt-2 shrink-0">
          {number}
        </span>

        <div className="flex-1 min-w-0 flex gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-2xl text-foreground leading-[1.1] tracking-[-0.02em]">
              {project.title}
            </h3>
            <p className="mt-1.5 font-body text-sm text-muted-foreground line-clamp-2">
              {project.tagline}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                {project.year}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="font-mono text-[10px] text-terracotta uppercase tracking-[0.15em]">
                view →
              </span>
            </div>
          </div>

          <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden relative ring-1 ring-border">
            <Image
              src={project.thumbnail}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  );
});
