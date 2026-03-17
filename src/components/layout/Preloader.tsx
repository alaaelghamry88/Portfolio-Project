// src/components/layout/Preloader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TITLE_TEXT = "The Craftsman\u2019s Journal";
const SESSION_KEY = "journal-loaded";

export function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReduced = usePrefersReducedMotion();

  const overlayRef     = useRef<HTMLDivElement>(null);
  const avatarWrapRef  = useRef<HTMLDivElement>(null);
  const ringRef        = useRef<HTMLDivElement>(null);
  const monogramRef    = useRef<HTMLDivElement>(null);
  const underlineRef   = useRef<HTMLDivElement>(null);
  const titleRef       = useRef<HTMLDivElement>(null);
  const kickerRef      = useRef<HTMLDivElement>(null);
  const progressRowRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef     = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";

    // In production: skip if already shown this session
    if (!isDev && sessionStorage.getItem(SESSION_KEY)) {
      setIsVisible(false);
      return;
    }

    // Respect reduced-motion: skip entirely
    if (prefersReduced) {
      if (!isDev) sessionStorage.setItem(SESSION_KEY, "1");
      setIsVisible(false);
      return;
    }

    // Guard against React StrictMode double-invoke cancelling the animation
    let cancelled = false;

    const overlay     = overlayRef.current;
    const avatarWrap  = avatarWrapRef.current;
    const ring        = ringRef.current;
    const monogram    = monogramRef.current;
    const underline   = underlineRef.current;
    const title       = titleRef.current;
    const kicker      = kickerRef.current;
    const progressRow = progressRowRef.current;
    const progressBar = progressBarRef.current;
    const counter     = counterRef.current;

    if (!overlay || !avatarWrap || !ring || !monogram || !underline ||
        !title || !kicker || !progressRow || !progressBar || !counter) return;

    // Prevent page scroll while preloader is active
    document.body.style.overflow = "hidden";

    // ── Resolve when all page resources are loaded ─────────────────────────
    const whenLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    // Minimum time the preloader is visible — gives users time to read it
    // and ensures 3D canvas/Spline/fonts have fully initialised
    const MIN_MS = 5500;
    const minDisplay = new Promise<void>((resolve) => setTimeout(resolve, MIN_MS));

    // ── Initial GSAP states ───────────────────────────────────────────────
    gsap.set(avatarWrap,  { opacity: 0, scale: 0.8 });
    gsap.set(monogram,    { opacity: 0, scale: 0.85 });
    gsap.set(underline,   { opacity: 0, scaleX: 0, transformOrigin: "left center" });
    gsap.set(kicker,      { opacity: 0 });
    gsap.set(progressRow, { opacity: 0 });
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

    // Split title into individually-animatable spans, then reveal container
    title.innerHTML = TITLE_TEXT.split("").map((char) =>
      `<span style="display:inline-block;opacity:0;transform:translateY(22px)">${
        char === " " ? "&nbsp;" : char
      }</span>`
    ).join("");
    gsap.set(title, { opacity: 1 });

    // ── Continuous ring spin (slower = more meditative) ───────────────────
    const ringTween = gsap.to(ring, {
      rotation: "+=360",
      duration: 3.5,
      ease: "none",
      repeat: -1,
    });

    // ── Counter proxy ─────────────────────────────────────────────────────
    const counter$ = { val: 0 };

    // ── Entrance timeline (leisurely, ~3s) ────────────────────────────────
    const entrance = gsap.timeline();

    // t=0.30  Avatar materialises slowly
    entrance.to(avatarWrap, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0.3);

    // t=1.00  Monogram fades up
    entrance.to(monogram,   { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 1.0);

    // t=1.60  Underline draws across
    entrance.to(underline,  { opacity: 1, scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 1.6);

    // t=2.20  Title chars stagger in — slower per-char gives a typewriter feel
    const chars = title.querySelectorAll("span");
    entrance.to(chars, {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.04,   // 25 chars × 0.04 = 1 s total spread
      ease: "power3.out",
    }, 2.2);

    // t=3.40  Kicker settles in after title finishes
    entrance.to(kicker, { opacity: 1, duration: 0.5, ease: "power2.out" }, 3.4);

    // t=3.70  Progress row appears and phase-1 begins immediately
    entrance.to(progressRow, { opacity: 1, duration: 0.3 }, 3.7);

    // ── Progress phase 1 — fast burst (0 → 45%, 1.1 s) ───────────────────
    entrance.to(progressBar, { scaleX: 0.45, duration: 1.1, ease: "power2.out" }, 3.7);
    entrance.to(counter$, {
      val: 45, duration: 1.1, ease: "power2.out",
      onUpdate() { counter.textContent = `${Math.round(counter$.val)}%`; },
    }, 3.7);

    // ── Progress phase 2 — slow crawl (45 → 88%, 2.4 s) — 3D loading ─────
    entrance.to(progressBar, { scaleX: 0.88, duration: 2.4, ease: "sine.inOut" });
    entrance.to(counter$, {
      val: 88, duration: 2.4, ease: "sine.inOut",
      onUpdate() { counter.textContent = `${Math.round(counter$.val)}%`; },
    }, "<");

    // ── Gate: wait for window.load + min time, then fire exit ─────────────
    entrance.add(() => {
      Promise.all([whenLoaded, minDisplay]).then(() => {
        if (!cancelled) runExit();
      });
    });

    // ── Exit sequence (called imperatively after gate resolves) ───────────
    function runExit() {
      if (cancelled) return;
      // Phase 3 — rush to 100%
      gsap.to(progressBar, { scaleX: 1, duration: 0.5, ease: "power2.in" });
      gsap.to(counter$, {
        val: 100, duration: 0.5, ease: "power2.in",
        onUpdate() { counter.textContent = `${Math.round(counter$.val)}%`; },
        onComplete() { counter.textContent = "100%"; },
      });

      // Ring slows to a natural stop as we hit 100%
      gsap.delayedCall(0.35, () => {
        ringTween.kill();
        const rot = gsap.getProperty(ring, "rotation") as number;
        gsap.to(ring, {
          rotation: Math.ceil(rot / 360) * 360,
          duration: 0.7,
          ease: "power3.out",
          onComplete: () => { if (ring) ring.style.borderStyle = "solid"; },
        });
      });

      // Hold 100% for a beat so the user sees it complete
      gsap.delayedCall(1.0, () => {
        // Content fades out
        gsap.to([avatarWrap, monogram, underline, title, kicker, progressRow], {
          opacity: 0, duration: 0.45, ease: "power2.in",
          onComplete() {
            // Signal the hero to start its entrance as the curtain rises
            window.dispatchEvent(new Event("preloader:done"));

            // Curtain rises
            gsap.to(overlay, {
              y: "-100vh",
              duration: 1.0,
              ease: "power4.inOut",
              onComplete() {
                if (!isDev) sessionStorage.setItem(SESSION_KEY, "1");
                document.body.style.overflow = "";
                setIsVisible(false);
              },
            });
          },
        });
      });
    }

    return () => {
      cancelled = true;
      entrance.kill();
      ringTween.kill();
      document.body.style.overflow = "";
    };
  }, [prefersReduced]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#1a1e24", zIndex: 9998 }}
    >
      {/* Grain texture — matches site-bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Centered content column */}
      <div className="relative flex flex-col items-center" style={{ gap: 20 }}>

        {/* ── Avatar + spinning ring ── */}
        <div ref={avatarWrapRef} className="relative" style={{ width: 84, height: 84 }}>
          {/* Dashed ring that spins during load */}
          <div
            ref={ringRef}
            className="absolute inset-0"
            style={{ borderRadius: "50%", border: "2px dashed #c8602a" }}
          />
          {/* Avatar photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/avatar/Alaa-Avatar.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 6, left: 6,
              width: 72, height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "top",
              boxShadow: "0 0 20px rgba(200,96,42,0.35)",
            }}
          />
        </div>

        {/* ── "AE" monogram ── */}
        <div
          ref={monogramRef}
          style={{
            fontFamily: '"Clash Display", sans-serif',
            fontSize: "clamp(3.5rem, 8vw, 5rem)",
            fontWeight: 700,
            color: "#f5f0e8",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          AE
        </div>

        {/* ── Terracotta underline ── */}
        <div
          ref={underlineRef}
          style={{
            height: 2,
            width: "100%",
            background: "#c8602a",
            boxShadow: "0 0 8px rgba(200,96,42,0.5)",
          }}
        />

        {/* ── Portfolio title — chars split by JS ── */}
        <div
          ref={titleRef}
          style={{
            fontFamily: '"Clash Display", sans-serif',
            fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
            fontWeight: 600,
            color: "rgba(245,240,232,0.65)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0, // hidden until JS replaces innerHTML
          }}
        >
          {TITLE_TEXT}
        </div>

        {/* ── Kicker ── */}
        <div
          ref={kickerRef}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.68rem",
            color: "#a89f90",
            letterSpacing: "0.06em",
          }}
        >
          01 · Forging your experience
        </div>

        {/* ── Progress bar + counter ── */}
        <div
          ref={progressRowRef}
          className="flex items-center"
          style={{ gap: 12, width: "min(280px, 80vw)", marginTop: 4 }}
        >
          {/* Track */}
          <div
            className="flex-1"
            style={{
              height: 2,
              background: "rgba(200,96,42,0.15)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {/* Fill */}
            <div
              ref={progressBarRef}
              style={{
                height: "100%",
                width: "100%",
                background: "#c8602a",
                boxShadow: "0 0 8px rgba(200,96,42,0.6)",
                borderRadius: 1,
              }}
            />
          </div>

          {/* Percentage counter */}
          <span
            ref={counterRef}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.62rem",
              color: "#a89f90",
              minWidth: "2.5rem",
              textAlign: "right",
            }}
          >
            0%
          </span>
        </div>

      </div>
    </div>
  );
}
