"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeroText } from "./HeroText";
import { HeroDataBar } from "./HeroDataBar";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";

const ShaderBackground = dynamic(
  () => import("./ShaderBackground").then((m) => m.ShaderBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />,
  },
);

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => m.SplineScene),
  {
    ssr: false,
  },
);

const Spotlight = dynamic(
  () => import("@/components/ui/spotlight").then((m) => m.Spotlight),
  {
    ssr: false,
  },
);

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
  const heroRef = useRef<HTMLElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Written each frame by ScrollTrigger; read each frame by the WebGL loop
  const scrollProgressRef = useRef(0);

  const prefersReduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dispatch = useAppDispatch();

  const [showSpline, setShowSpline] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Dispatch "hero" active section so navbar clears when scrolling back to top
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("hero")); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  // Wait for preloader to signal completion before running hero entrance
  useEffect(() => {
    // In dev the preloader always plays; in production skip-check via sessionStorage
    const alreadyLoaded =
      process.env.NODE_ENV !== "development" &&
      !!sessionStorage.getItem("journal-loaded");

    if (alreadyLoaded) {
      setPreloaderDone(true);
      return;
    }

    const handler = () => setPreloaderDone(true);
    window.addEventListener("preloader:done", handler, { once: true });
    return () => window.removeEventListener("preloader:done", handler);
  }, []);

  // Defer heavy Spline mount until after first paint / intro
  useEffect(() => {
    if (prefersReduced) return;

    const timeout = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback?: (cb: () => void) => void })
          .requestIdleCallback?.(() => setShowSpline(true));
      } else {
        setShowSpline(true);
      }
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [prefersReduced]);

  useGSAP(
    () => {
      const shaderEl = shaderRef.current;
      const contentEl = contentRef.current;
      const heroEl = heroRef.current;

      if (!shaderEl || !contentEl || !heroEl) return;

      // Wait until preloader signals done — CSS opacity:0 keeps them hidden
      if (!preloaderDone) return;

      if (prefersReduced) {
        gsap.set(shaderEl,  { opacity: 1 });
        gsap.set(contentEl, { opacity: 1, y: 0 });
      } else {
        // Shader fades in as the curtain rises
        gsap.fromTo(shaderEl,
          { opacity: 0 },
          { opacity: 1, duration: 1.0, ease: "power2.out" },
        );

        // Content drifts up into place
        gsap.fromTo(contentEl,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15 },
        );
      }

      // Parallax on scroll (always, regardless of preloader)
      gsap.fromTo(
        contentEl,
        { y: 0, opacity: 1 },
        {
          y: "-8%",
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        },
      );
    },
    { scope: heroRef, dependencies: [prefersReduced, preloaderDone] },
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full h-svh overflow-hidden"
      aria-label="Hero — The Arrival"
    >
      {/* WebGL noise background — full bleed (sits over global grain/vignettes) */}
      <div ref={shaderRef} className="absolute inset-0 z-0" style={{ opacity: 0 }}>
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
        style={{ opacity: 0 }}
      >
        {/* Left — copy (slightly wider than scene) */}
        <div className="basis-[56%] px-8 md:px-16 lg:px-24 flex flex-col justify-center gap-6">
          <HeroText ready={preloaderDone} />
        </div>

        {/* Right — Spline 3D scene, full height */}
        <div
          className="hidden md:flex basis-[44%] h-full relative overflow-hidden"
        >
          {showSpline && isDesktop && (
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      {/* Mobile 3D hint — smaller, softened, and tucked to the right */}
      <div className="absolute inset-y-28 right-0 z-[4] flex items-center justify-end md:hidden pointer-events-none">
        <div
          className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] mr-[-40px] opacity-40"
        >
          {showSpline && !isDesktop && (
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          )}
        </div>
      </div>

      {/* Bottom data bar */}
      <HeroDataBar />
    </section>
  );
}
