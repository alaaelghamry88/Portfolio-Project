"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderBackground } from "./ShaderBackground";
import { HeroModel } from "./HeroModel";
import { HeroText } from "./HeroText";
import { ScrollIndicator } from "./ScrollIndicator";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Hero section — "The Arrival".
 *
 * 3-layer absolute stack:
 *   z-0  ShaderBackground (WebGL noise canvas)
 *   z-10 HeroModel        (R3F icosahedron, lazy)
 *   z-20 HeroText         (title, subtitle, CTA)
 *
 * Entrance timeline:
 *   0.0s  Shader fades in
 *   0.3s  3D model scales in (handled inside Scene.tsx)
 *   0.5s  Title chars slide up (handled inside HeroText.tsx)
 *   0.8s  Subtitle fades up
 *   1.2s  CTA appears
 *   1.8s  Scroll indicator fades in
 *
 * On scroll (ScrollTrigger):
 *   - Text layer parallaxes up faster than the page
 *   - Shader wrapper darkens (via scrollProgressRef)
 *   - Hero section opacity falls to 0 at 60% scroll past hero
 */
export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const shaderWrapRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);

  // Shared ref — shader reads this directly each frame (no React state)
  const scrollProgressRef = useRef(0);

  const prefersReduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReduced) return;

      /* ── Shader entrance ────────────────────────────────────────── */
      gsap.from(shaderWrapRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });

      /* ── ScrollTrigger: parallax + fade on scroll ───────────────── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      // Text moves up faster than the page scroll (parallax depth)
      tl.to(
        textWrapRef.current,
        { y: "-25%", opacity: 0, ease: "none" },
        0,
      );

      // Hero overall slightly fades out
      tl.to(heroRef.current, { opacity: 0.4, ease: "none" }, 0);
    },
    { scope: heroRef, dependencies: [prefersReduced] },
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full h-svh overflow-hidden bg-steel-deep"
      aria-label="Hero — The Arrival"
    >
      {/* Layer 0 — WebGL shader background */}
      <div ref={shaderWrapRef} className="absolute inset-0 z-0">
        <ShaderBackground scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Layer 1 — 3D breathing geometry (lazy, no SSR) */}
      <div className="absolute inset-0 z-10">
        <HeroModel />
      </div>

      {/* Layer 2 — Foreground: title, subtitle, CTA */}
      <div ref={textWrapRef} className="absolute inset-0 z-20">
        <HeroText />
      </div>

      {/* Scroll indicator — sits above all layers */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <ScrollIndicator />
      </div>
    </section>
  );
}
