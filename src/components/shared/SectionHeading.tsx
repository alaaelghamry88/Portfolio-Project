"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  kicker: string;
  title: string;
  className?: string;
}

export function SectionHeading({ kicker, title, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const kickerRef    = useRef<HTMLParagraphElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const kickerEl = kickerRef.current;
      const titleEl  = titleRef.current;
      if (!kickerEl || !titleEl) return;

      if (prefersReduced) {
        gsap.set([kickerEl, titleEl], { opacity: 1 });
        return;
      }

      const lines = titleEl.querySelectorAll<HTMLElement>(".title-line");
      lines.forEach((line) => {
        const text = line.textContent ?? "";
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

      const chars = titleEl.querySelectorAll<HTMLElement>(".char");
      const trigger = { trigger: containerRef.current, start: "top 80%" };

      gsap.fromTo(
        kickerEl,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", scrollTrigger: trigger },
      );

      gsap.fromTo(
        chars,
        { y: "110%", opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.03,
          scrollTrigger: trigger,
        },
      );
    },
    { scope: containerRef, dependencies: [prefersReduced] },
  );

  const titleLines = title.split("\n");

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-3", className)}>
      <p
        ref={kickerRef}
        className="font-mono text-xs tracking-[0.2em] text-terracotta uppercase opacity-0"
      >
        {kicker}
      </p>
      <h2
        ref={titleRef}
        className="font-display font-bold text-foreground text-4xl md:text-5xl leading-tight tracking-[-0.03em] opacity-0"
        style={{ willChange: "transform" }}
      >
        {titleLines.map((line, i) => (
          <span key={i} className="title-line block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
