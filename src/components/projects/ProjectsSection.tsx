"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppDispatch } from "@/store/hooks";
import { setProjects } from "@/store/slices/projectsSlice";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const GAP = 32;
const STACK_Y   = [28, 14, 0]   as const; // card 0 deepest, card 2 on top
const STACK_ROT = [-5,  2, -2]  as const;
const STACK_Z   = [ 3,  2,  1]  as const; // card 0 (featured) on top of pile

export function ProjectsSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const pinnedRef    = useRef<HTMLDivElement>(null);
  const cardsAreaRef = useRef<HTMLDivElement>(null);

  const isMobile      = useMediaQuery("(max-width: 767px)");
  const prefersReduced = usePrefersReducedMotion();
  const dispatch      = useAppDispatch();

  useEffect(() => {
    dispatch(setProjects(projects));
  }, [dispatch]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("projects")); },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  useGSAP(
    () => {
      if (isMobile || prefersReduced) return;

      const area      = cardsAreaRef.current;
      const pinTarget = pinnedRef.current;
      if (!area || !pinTarget) return;

      let st: ScrollTrigger | undefined;

      const setup = () => {
        st?.kill();
        gsap.set(area.querySelectorAll("[data-card]"), { clearProps: "all" });

        const cards = Array.from(area.querySelectorAll<HTMLElement>("[data-card]"));
        if (cards.length === 0) return;

        const N        = cards.length;
        const areaW    = area.offsetWidth;
        const cardW    = Math.floor((areaW - (N - 1) * GAP) / N);
        const cardH    = Math.round(cardW * 1.25);
        const stackX   = areaW / 2 - cardW / 2;

        gsap.set(area, { height: cardH + STACK_Y[0] });

        cards.forEach((card, i) => {
          gsap.set(card, {
            position:        "absolute",
            top:             0,
            width:           cardW,
            height:          cardH,
            x:               stackX,
            y:               STACK_Y[i] ?? 0,
            rotation:        STACK_ROT[i] ?? 0,
            zIndex:          STACK_Z[i] ?? 1,
            opacity:         0,
            transformOrigin: "center center",
          });
        });

        const totalW    = N * cardW + (N - 1) * GAP;
        const fanStartX = (areaW - totalW) / 2;
        const fanX      = cards.map((_, i) => fanStartX + i * (cardW + GAP));

        // Step 1 — entrance: cards slide up into the stacked position (no pin).
        // Fires once when the section scrolls into view (~75% from top).
        ScrollTrigger.create({
          trigger: pinTarget,
          start:   "top 75%",
          once:    true,
          onEnter: () => {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 50 },
              {
                opacity:  1,
                y:        (i) => STACK_Y[i] ?? 0,
                duration: 0.6,
                stagger:  0.08,
                ease:     "power3.out",
              },
            );
          },
        });

        // Step 2 — fan-out: scrub timeline drives cards to horizontal row.
        // Pin only engages when the section reaches the top of the viewport
        // (i.e. the user has already seen the stack).
        const tl = gsap.timeline({ paused: true });

        cards.forEach((card, i) => {
          tl.to(
            card,
            { x: fanX[i], y: 0, rotation: 0, zIndex: 1, duration: 1, ease: "power3.inOut" },
            0,
          );
        });

        st = ScrollTrigger.create({
          trigger:             pinTarget,
          start:               "top top",
          end:                 "+=700",
          pin:                 true,
          pinSpacing:          true,
          scrub:               1.2,
          animation:           tl,
          invalidateOnRefresh: true,
          anticipatePin:       1,
          onToggle: (self) => {
            area.dataset.animating = self.isActive ? "true" : "";
          },
        });

        ScrollTrigger.refresh();
      };

      const ro = new ResizeObserver(setup);
      ro.observe(area);

      const id = setTimeout(setup, 0);

      return () => {
        clearTimeout(id);
        st?.kill();
        ro.disconnect();
      };
    },
    { scope: sectionRef, dependencies: [isMobile, prefersReduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="container-site"
      aria-label="Projects — The Work"
    >
      <div ref={pinnedRef} className="pt-24 md:pt-32 pb-16">
        {/* Heading row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-6">
          <SectionHeading kicker="03 · The Work" title={"Selected\nProjects"} />
          <MagneticButton>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-terracotta/40 text-terracotta font-body font-medium text-sm rounded-full transition-colors duration-200 hover:border-terracotta hover:bg-terracotta/10 whitespace-nowrap"
            >
              Get in touch →
            </Link>
          </MagneticButton>
        </div>

        {/* Sub-copy */}
        <p className="font-body text-muted-foreground leading-relaxed max-w-xl mb-12 md:mb-16">
          A handful of projects that pushed my skills forward — from design
          systems to real-time dashboards to creative experiments.
        </p>

        {/* Cards area */}
        <div
          ref={cardsAreaRef}
          className={cn("relative", isMobile && "flex flex-col gap-6")}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              data-card="true"
              className={isMobile ? "w-full" : undefined}
              style={
                isMobile
                  ? { minHeight: project.featured ? "520px" : "280px" }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
