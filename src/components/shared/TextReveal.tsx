"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function TextReveal({ children, delay = 0, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const items = Array.from(el.children) as HTMLElement[];
      if (items.length === 0) return;

      if (prefersReduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.7,
          ease: "power3.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        },
      );
    },
    { scope: containerRef, dependencies: [prefersReduced, delay] },
  );

  return (
    <div ref={containerRef} className={cn(className)}>
      {children}
    </div>
  );
}
