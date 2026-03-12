"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Download } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface Props {
  /** Called when the text entrance animation completes */
  onEntranceComplete?: () => void;
}

/**
 * Hero foreground typography layer.
 *
 * - Title: "Clash Display", massive, char-by-char GSAP entrance
 * - "Portfolio" highlighted in terracotta (#c8602a) on its own line
 * - Subtitle: fades up after title
 * - CTA link: appears last
 *
 * Each title line is a `.title-line` span so GSAP splits them
 * individually without destroying the terracotta color on "Portfolio".
 */
export function HeroText({ onEntranceComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const kickerRef   = useRef<HTMLParagraphElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const kicker   = kickerRef.current;
      const title    = titleRef.current;
      const subtitle = subtitleRef.current;
      const cta      = ctaRef.current;
      if (!kicker || !title || !subtitle || !cta) return;

      if (prefersReduced) {
        gsap.set([kicker, subtitle, cta], { opacity: 1 });
        return;
      }

      /* ── Split each title line into per-character spans ─────────── */
      const lines = title.querySelectorAll<HTMLElement>(".title-line");
      lines.forEach((line) => {
        const text = line.textContent ?? "";
        // Preserve the original class (e.g. text-terracotta) on the wrapper
        line.innerHTML = text
          .split("")
          .map(
            (ch) =>
              `<span class="char-wrap" style="display:inline-block;overflow:hidden;vertical-align:top">` +
              `<span class="char" style="display:inline-block">${ch === " " ? "&nbsp;" : ch}</span>` +
              `</span>`,
          )
          .join("");
      });

      const chars = title.querySelectorAll<HTMLElement>(".char");

      /* ── Master entrance timeline ───────────────────────────────── */
      const tl = gsap.timeline({ delay: 0.5 });

      // 0. Kicker fades in just ahead of title chars
      tl.from(kicker, {
        y: 8,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // 1. Characters slide up from below their container (masked)
      tl.from(chars, {
        y: "110%",
        opacity: 0,
        duration: 0.75,
        ease: "power4.out",
        stagger: 0.035,
      });

      // 2. Subtitle fades up
      tl.from(
        subtitle,
        { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3",
      );

      // 3. CTA
      tl.from(
        cta,
        { y: 16, opacity: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      ).then(() => {
        onEntranceComplete?.();
      });
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-start md:gap-[50px] gap-[20px]"
    >
      {/* ── Accent bar + Kicker + Title ─────────────────────────────── */}
      <div className="flex items-start gap-[20px]">
        {/* Left accent bar — fixed height, offset down to align with kicker */}
        <div
          className="flex-none w-[3px] rounded-[2px] md:h-[150px] h-[80px] mt-[6px]"
          style={{ background: "linear-gradient(to bottom, #c8602a, rgba(200,96,42,0.1))" }}
          aria-hidden="true"
        />

        {/* Kicker + Title stacked */}
        <div className="flex flex-col gap-2">
          <p
            ref={kickerRef}
            className="font-mono text-[15px] tracking-[0.2em] text-terracotta uppercase"
          >
            01 · The Arrival
          </p>
          <h1
            ref={titleRef}
            className={cn(
              "font-display font-bold text-paper",
              "text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem]",
              "leading-[1.2] tracking-[-0.03em] will-change-transform",
            )}
            aria-label="Alaa Elghamry's Portfolio"
          >
            {/* Mobile: single-line title to avoid awkward breaks */}
            <span className="title-line block whitespace-nowrap md:hidden">
              Alaa Elghamry&apos;s Portfolio
            </span>
            {/* Desktop+: two-line layout like the mock */}
            <span className="title-line hidden md:block mb-2 md:mb-6 whitespace-nowrap">
              Alaa Elghamry&apos;s
            </span>
            <span className="title-line hidden md:block text-terracotta whitespace-nowrap">
              Portfolio
            </span>
          </h1>
        </div>
      </div>

      {/* ── Subtitle ───────────────────────────────────────────────── */}
      <p
        ref={subtitleRef}
        className="font-body text-md text-paper-muted max-w-[500px] leading-relaxed"
      >
        Crafting bold, expressive digital experiences with React, Next.js &amp; motion design.
      </p>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div ref={ctaRef} className="flex gap-3">
        <a
          href="/Alaa-Elghamry-Mid-Senior-Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3",
            "bg-terracotta text-paper font-body font-medium text-sm",
            "rounded-full transition-colors duration-200",
            "hover:bg-terracotta-light",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-steel-deep",
          )}
        >
          My Resume
          <Download className="h-4 w-4" />
        </a>
        <a
          href="#contact"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3",
            "border border-terracotta/40 text-terracotta font-body font-medium text-sm",
            "rounded-full transition-colors duration-200",
            "hover:border-terracotta hover:bg-terracotta/10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-steel-deep",
          )}
        >
          Contact Me
        </a>
      </div>
    </div>
  );
}
