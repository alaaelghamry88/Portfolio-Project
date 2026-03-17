// src/components/experience/ExperienceSection.tsx
"use client";

import Image from "next/image";
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
      <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center">
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

        <div className="flex justify-center md:justify-end">
          <div className="relative h-80 w-80 md:h-96 md:w-96 overflow-hidden rounded-3xl border border-slate-800/40 bg-slate-900 shadow-xl">
            <Image
              src="/images/avatar/Alaa-Avatar.png"
              alt="Portrait illustration of Alaa, software engineer"
              fill
              sizes="(min-width: 768px) 28rem, 20rem"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
