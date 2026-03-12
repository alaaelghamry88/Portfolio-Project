"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/shared/TextReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ScrollRevealText({ children, className }: Props) {
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = wrapperRef.current;
      if (!el || prefersReduced) return;

      const highlights = el.querySelectorAll<HTMLElement>("[data-highlight]");
      if (highlights.length === 0) return;

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            highlights,
            { color: "inherit", scale: 1 },
            {
              color: "#c8602a",
              scale: 1.02,
              duration: 0.3,
              delay: 0.9,
              stagger: 0.08,
              ease: "power2.out",
              yoyo: true,
              repeat: 1,
            },
          );
        },
      });
    },
    { scope: wrapperRef, dependencies: [prefersReduced] },
  );

  return (
    <div ref={wrapperRef} className={cn(className)}>
      <TextReveal>{children}</TextReveal>
    </div>
  );
}
