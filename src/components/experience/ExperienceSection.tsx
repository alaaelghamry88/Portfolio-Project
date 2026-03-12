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
  const dispatch       = useAppDispatch();
  const [hasEntered, setHasEntered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // IntersectionObserver — dispatch activeSection + flip hasEntered on first entry
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
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  // Stagger entrance animation on accordion rows
  useGSAP(
    () => {
      if (prefersReduced || !rowsRef.current) return;

      const rows = rowsRef.current.querySelectorAll("[data-exp-row]");
      if (rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 24 },
        {
          opacity:  1,
          y:        0,
          duration: 0.6,
          ease:     "power3.out",
          stagger:  0.08,
          scrollTrigger: {
            trigger: rowsRef.current,
            start:   "top 80%",
            once:    true,
          },
        },
      );
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
      <div className="max-w-3xl">
        <SectionHeading
          kicker="03 · The Journey"
          title={"Where I've\nShipped."}
        />

        <div ref={rowsRef} className="mt-12 md:mt-16" data-exp-rows>
          <ExperienceAccordion
            experiences={experiences}
            defaultOpenFirst={hasEntered}
          />
        </div>
      </div>
    </section>
  );
}
