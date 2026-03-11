"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ShaderBackground } from "./ShaderBackground";
import { HeroText } from "./HeroText";
import { ScrollIndicator } from "./ScrollIndicator";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Hero section — "The Arrival".
 *
 * Layout:
 *   Outer: full-viewport section with ShaderBackground
 *   Inner: Card with split layout
 *     Left  — HeroText (title, subtitle, CTA) + Spotlight effect
 *     Right — Spline interactive 3D scene
 *
 * On scroll (ScrollTrigger):
 *   - Card parallaxes up slightly
 *   - Shader darkens (via scrollProgressRef)
 */
export function HeroSection() {
  const heroRef   = useRef<HTMLElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);

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

      // Card entrance — slight upward drift
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.2,
      });

      // Parallax on scroll
      gsap.to(cardRef.current, {
        y: "-12%",
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
      });
    },
    { scope: heroRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full h-svh overflow-hidden bg-steel-deep flex items-center justify-center"
      aria-label="Hero — The Arrival"
    >
      {/* WebGL noise background — full bleed */}
      <div ref={shaderRef} className="absolute inset-0 z-0">
        <ShaderBackground scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Hero card — split: text left, Spline right */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6"
      >
        <Card
          className={cn(
            "w-full h-[520px] md:h-[580px]",
            "bg-steel/60 border-steel-border/50",
            "backdrop-blur-md overflow-hidden",
          )}
        >
          {/* Mouse-tracking spotlight */}
          <Spotlight size={400} className="z-0" />

          <div className="flex h-full relative z-10">
            {/* Left — copy */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-6">
              <HeroText />
            </div>

            {/* Right — Spline 3D scene */}
            <div className="hidden md:flex flex-1 relative">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Scroll indicator */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <ScrollIndicator />
      </div>
    </section>
  );
}
