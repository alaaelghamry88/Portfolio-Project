"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppDispatch } from "@/store/hooks";
import { setProjects } from "@/store/slices/projectsSlice";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectIndexRow } from "./ProjectIndexRow";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ProjectsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const indexRef    = useRef<HTMLDivElement>(null);

  const prefersReduced = usePrefersReducedMotion();
  const dispatch       = useAppDispatch();

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
      const featuredEl = featuredRef.current;
      const indexEl    = indexRef.current;
      if (!featuredEl) return;

      const rows = indexEl
        ? gsap.utils.toArray<HTMLElement>("[data-index-row]", indexEl)
        : [];

      if (prefersReduced) {
        gsap.set(featuredEl, { opacity: 1, y: 0 });
        if (rows.length) gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        featuredEl,
        { opacity: 0, y: 32 },
        {
          opacity:  1,
          y:        0,
          duration: 0.9,
          ease:     "power3.out",
          scrollTrigger: { trigger: featuredEl, start: "top 82%", once: true },
        },
      );

      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 24 },
          {
            opacity:  1,
            y:        0,
            duration: 0.7,
            delay:    i * 0.1,
            ease:     "power3.out",
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  const featured = projects.find((p) => p.featured);
  const rest     = projects.filter((p) => !p.featured);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="container-site pt-24 md:pt-32 pb-24 md:pb-32"
      aria-label="Projects — The Work"
    >
      {/* Heading row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-8 md:mb-12">
        <SectionHeading kicker="04 · The Work" title={"Selected\nProjects"} />
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
      <p className="font-body text-muted-foreground leading-relaxed max-w-xl mb-12 md:mb-20">
        A handful of projects that pushed my skills forward — from design
        systems to real-time dashboards to creative experiments.
      </p>

      {/* Featured card */}
      {featured && (
        <div ref={featuredRef} className="opacity-0 mb-16 md:mb-24">
          <ProjectCard project={featured} />
        </div>
      )}

      {/* Index — "Also in the work" */}
      {rest.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-2 md:mb-4">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Also · in · the · work
            </span>
            <span className="flex-1 h-px bg-border" aria-hidden="true" />
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {String(rest.length).padStart(2, "0")} entries
            </span>
          </div>

          <div ref={indexRef} className="flex flex-col">
            {rest.map((project, i) => (
              <ProjectIndexRow
                key={project.slug}
                project={project}
                index={i + 2}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archive note */}
      <div className="mt-14 md:mt-20 flex items-center justify-center">
        <Link
          href="#contact"
          className="group inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-terracotta transition-colors duration-300"
        >
          <span className="w-10 h-px bg-current opacity-40 transition-[width,opacity] duration-500 group-hover:w-16 group-hover:opacity-100" aria-hidden="true" />
          want to see more? ask.
          <span className="w-10 h-px bg-current opacity-40 transition-[width,opacity] duration-500 group-hover:w-16 group-hover:opacity-100" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
