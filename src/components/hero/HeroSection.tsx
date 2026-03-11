"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShaderBackground } from "./ShaderBackground";
import { HeroText } from "./HeroText";
import { HeroDataBar } from "./HeroDataBar";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Hero section — "The Arrival".
 *
 * Layers (bottom → top):
 *   z-0    ShaderBackground — WebGL noise canvas
 *   z-[1]  Grain — subtle film-grain texture
 *   z-[3]  Vignette — cinematic corner darkening
 *   z-[5]  Spotlight — mouse-tracked terracotta glow
 *   z-10   Content — HeroText left, Spline 3D right
 *   z-[15] Decoratives — top rule, coords (pointer-events-none)
 *   z-[20] HeroDataBar — bottom status / scroll bar
 */
export function HeroSection() {
  const heroRef    = useRef<HTMLElement>(null);
  const shaderRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Written each frame by ScrollTrigger; read each frame by the WebGL loop
  const scrollProgressRef = useRef(0);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      // Shader fades in on load
      gsap.from(shaderRef.current, {
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
      });

      // Content entrance — slight upward drift
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.2,
      });

      // Parallax on scroll
      gsap.fromTo(
        contentRef.current,
        { y: 0, opacity: 1 },
        {
          y: "-10%",
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        },
      );
    },
    { scope: heroRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full h-svh overflow-hidden"
      aria-label="Hero — The Arrival"
    >
      {/* WebGL noise background — full bleed (sits over global grain/vignettes) */}
      <div ref={shaderRef} className="absolute inset-0 z-0">
        <ShaderBackground scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Full-section mouse spotlight */}
      <Spotlight
        size={520}
        className="z-[5]"
        springOptions={{ bounce: 0, stiffness: 80, damping: 18 }}
      />

      {/* Full-bleed content split */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex items-center"
      >
        {/* Left — copy (slightly wider than scene) */}
        <div className="basis-[56%] px-8 md:px-16 lg:px-24 flex flex-col justify-center gap-6">
          <HeroText />
        </div>

        {/* Right — Spline 3D scene, full height */}
        <div
          className="hidden md:flex basis-[44%] h-full relative overflow-hidden"
        >
          {/* Left-edge gradient: blends Spline into shader background */}
          <div
            className="absolute left-0 inset-y-0 w-48 z-10 pointer-events-none"
          />
          {/* Bottom-edge gradient for subtle grounding */}
          <div
            className="absolute bottom-0 inset-x-0 h-24 z-10 pointer-events-none"
          />
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Mobile 3D hint — smaller, softened, and tucked to the right */}
      <div className="absolute inset-y-28 right-0 z-[4] flex items-center justify-end md:hidden pointer-events-none">
        <div
          className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] mr-[-40px] opacity-40"
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Bottom data bar */}
      <HeroDataBar />
    </section>
  );
}
