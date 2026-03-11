"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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
 * - One word highlighted in terracotta (#c8602a)
 * - Subtitle: fades up after title
 * - CTA link: appears last
 *
 * Entrance timeline (from HeroSection):
 *   0.5s delay before chars animate, stagger 0.035s per char, power4.out
 */
export function HeroText({ onEntranceComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const cta = ctaRef.current;
      if (!title || !subtitle || !cta) return;

      if (prefersReduced) {
        // No animation — just show everything
        gsap.set([subtitle, cta], { opacity: 1 });
        return;
      }

      /* ── Split title into per-character spans ───────────────────── */
      const rawText = title.textContent ?? "";
      title.innerHTML = rawText
        .split("")
        .map(
          (ch) =>
            `<span class="char-wrap" style="display:inline-block;overflow:hidden;vertical-align:top">` +
            `<span class="char" style="display:inline-block">${ch === " " ? "&nbsp;" : ch}</span>` +
            `</span>`,
        )
        .join("");

      const chars = title.querySelectorAll<HTMLElement>(".char");

      /* ── Master entrance timeline ───────────────────────────────── */
      const tl = gsap.timeline({ delay: 0.5 });

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
      className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6"
    >
      {/* ── Title ──────────────────────────────────────────────────── */}
      <h1
        ref={titleRef}
        className={cn(
          "text-hero font-display text-paper leading-none mb-6",
          "will-change-transform",
        )}
        aria-label="The Craftsman's Journal"
      >
        {/* Word "Craftsman's" is highlighted in terracotta via CSS after split.
            The char spans get the parent colour; we override the highlight
            via a sibling component or post-animation class. */}
        The Craftsman&apos;s{" "}
        <span className="text-terracotta">Journal</span>
      </h1>

      {/* ── Subtitle ───────────────────────────────────────────────── */}
      <p
        ref={subtitleRef}
        className="font-body text-lg md:text-xl text-paper-muted max-w-md leading-relaxed mb-10 opacity-0"
        style={{ opacity: 0 }}
      >
        Frontend developer crafting bold, expressive digital experiences
        with React, Next.js &amp; motion design.
      </p>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div ref={ctaRef} className="flex gap-4 opacity-0" style={{ opacity: 0 }}>
        <a
          href="#projects"
          className={cn(
            "inline-flex items-center gap-2 px-7 py-3.5",
            "bg-terracotta text-paper font-body font-medium text-sm",
            "rounded-full transition-colors duration-200",
            "hover:bg-terracotta-light",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-steel-deep",
          )}
        >
          View Work
        </a>
        <a
          href="#about"
          className={cn(
            "inline-flex items-center gap-2 px-7 py-3.5",
            "border border-steel-border text-paper-muted font-body font-medium text-sm",
            "rounded-full transition-colors duration-200",
            "hover:border-terracotta hover:text-paper",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-steel-deep",
          )}
        >
          About
        </a>
      </div>
    </div>
  );
}
