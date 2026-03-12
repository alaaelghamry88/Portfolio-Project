"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { INNER_RING_SKILLS, OUTER_RING_SKILLS, skills } from "@/data/skills";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { OrbitRing } from "./OrbitRing";

gsap.registerPlugin(ScrollTrigger);

const CANVAS_SIZE = 440;

export function SkillsSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const canvasRef    = useRef<HTMLDivElement>(null);
  const isPausedRef  = useRef(false);
  const dispatch     = useAppDispatch();

  const prefersReduced = usePrefersReducedMotion();
  const isMobile       = useMediaQuery("(max-width: 479px)");
  const showOrbit      = !prefersReduced && !isMobile;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("skills")); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  useGSAP(
    () => {
      if (prefersReduced) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );

      gsap.fromTo(
        canvas,
        { scale: 0.85 },
        {
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    },
    { scope: sectionRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="container-site py-24 md:py-32"
      aria-label="Skills — The Practice"
      style={{ opacity: prefersReduced ? 1 : 0 }}
    >
      <div className="grid md:grid-cols-[9fr_11fr] gap-12 md:gap-16 items-center">
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="04 · The Practice"
            title={"The Tools\nof the Craft"}
          />
          <p className="font-body text-muted-foreground leading-relaxed max-w-sm">
            The technologies I reach for every day — from UI frameworks to
            animation runtimes to deployment pipelines.
          </p>
          {showOrbit && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ background: "#c8602a" }} aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">Inner — Frontend core</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ background: "#e8895a" }} aria-hidden="true" />
                <span className="font-mono text-xs text-muted-foreground">Outer — Animation, tools & backend</span>
              </div>
            </div>
          )}
        </div>
        {showOrbit ? (
          <div className="flex justify-center">
            <div
              ref={canvasRef}
              className="relative"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
              onMouseEnter={() => { isPausedRef.current = true; }}
              onMouseLeave={() => { isPausedRef.current = false; }}
              aria-label="Orbiting skills diagram"
              role="img"
            >
              <OrbitRing radius={110} skills={INNER_RING_SKILLS} speed={18} direction="cw" color="inner" isPausedRef={isPausedRef} canvasSize={CANVAS_SIZE} />
              <OrbitRing radius={190} skills={OUTER_RING_SKILLS} speed={28} direction="ccw" color="outer" isPausedRef={isPausedRef} canvasSize={CANVAS_SIZE} />
              <div
                className="absolute font-display font-bold text-terracotta flex items-center justify-center rounded-full"
                style={{
                  width: 72,
                  height: 72,
                  left: CANVAS_SIZE / 2 - 36,
                  top:  CANVAS_SIZE / 2 - 36,
                  background: "linear-gradient(135deg, #2a3240, #1a1e24)",
                  border: "1.5px solid #3a4555",
                  fontSize: 18,
                  boxShadow: "0 0 30px #c8602a33",
                }}
              >
                AE
                {[8, 16].map((offset) => (
                  <span
                    key={offset}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      inset: -offset,
                      border: "1px solid #c8602a33",
                      animation: "orb-pulse 2.5s ease-in-out infinite",
                      animationDelay: `${offset * 0.1}s`,
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.filter((s) => s.orbit).map((skill) => (
              <div
                key={skill.name}
                className="px-3 py-1.5 rounded-full border border-border font-mono text-xs text-foreground"
                style={{
                  borderColor: skill.orbit === "inner" ? "#c8602a55" : "#e8895a44",
                  color: skill.orbit === "inner" ? "#c8602a" : "#e8895a",
                }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
