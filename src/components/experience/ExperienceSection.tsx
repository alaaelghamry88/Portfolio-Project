// src/components/experience/ExperienceSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { experiences } from "@/data/experience";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExperienceAccordion } from "./ExperienceAccordion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const rowsRef        = useRef<HTMLDivElement>(null);
  const lineRef        = useRef<HTMLDivElement>(null);
  const dispatch       = useAppDispatch();
  const [hasEntered, setHasEntered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(setActiveSection("experience"));
          setHasEntered(true);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  useGSAP(
    () => {
      if (!rowsRef.current) return;

      const rows = rowsRef.current.querySelectorAll("[data-exp-row]");

      if (prefersReduced) {
        gsap.set(rows, { opacity: 1, x: 0 });
        return;
      }

      // Thread line draws downward
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: rowsRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // Rows clip in from the left
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: rowsRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="container-site py-24 md:py-32"
      aria-label="Experience — The Journey"
    >
      <SectionHeading
        kicker="03 · The Journey"
        title={"Where I've\nShipped."}
      />

      <div ref={rowsRef} className="relative mt-16 md:mt-20">
        {/* Vertical thread line — draws from top as section enters */}
        <div
          ref={lineRef}
          className="absolute left-0 top-0 bottom-0 w-px origin-top pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(200,96,42,0.55) 0%, rgba(200,96,42,0.15) 65%, transparent 100%)",
          }}
        />

        <ExperienceAccordion
          experiences={experiences}
          defaultOpenFirst={hasEntered}
        />
      </div>
    </section>
  );
}
