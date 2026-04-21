"use client";

import { type RefObject, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { Avatar } from "./Avatar";
import { ScrollRevealText } from "./ScrollRevealText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// ── Inline highlight phrase ───────────────────────────────────────────────────
// Renders children with an absolutely-positioned terracotta bar behind them.
// The bar starts scaleX:0 and is swept to scaleX:1 by the parent's GSAP tween.

function StatHighlight({
  children,
  barRef,
}: {
  children: React.ReactNode;
  barRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <span className="relative inline-block align-baseline">
      <span
        ref={barRef}
        aria-hidden="true"
        className="absolute rounded-[3px] pointer-events-none"
        style={{
          inset: "-2px -5px",
          background: "rgba(200,96,42,0.14)",
          border:     "1px solid rgba(200,96,42,0.28)",
          transformOrigin: "left center",
          transform:       "scaleX(0)",
        }}
      />
      <span className="relative font-semibold text-foreground">
        {children}
      </span>
    </span>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const proseRef   = useRef<HTMLParagraphElement>(null);
  const bar1Ref    = useRef<HTMLSpanElement>(null);
  const bar2Ref    = useRef<HTMLSpanElement>(null);
  const bar3Ref    = useRef<HTMLSpanElement>(null);
  const dispatch   = useAppDispatch();
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("about")); },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  useGSAP(
    () => {
      const bars = [bar1Ref.current, bar2Ref.current, bar3Ref.current].filter(Boolean);
      if (!proseRef.current || bars.length === 0) return;

      if (prefersReduced) {
        gsap.set(bars, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX:   1,
          duration: 0.55,
          ease:     "power3.out",
          stagger:  0.22,
          scrollTrigger: {
            trigger: proseRef.current,
            start:   "top 88%",
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
      id="about"
      className="container-site pt-24 md:pt-32"
      aria-label="About — The Origin"
    >
      {/* ── Upper: heading + bio (left) | avatar (right) ──────────── */}
      <div className="grid md:grid-cols-[3fr_2fr] gap-12 md:gap-16 items-start">
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="02 · The Origin"
            title={"The Person\nBehind the Code"}
          />
          <ScrollRevealText className="flex flex-col gap-5">
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              I&apos;m a{" "}
              <span data-highlight className="font-semibold text-foreground">
                frontend developer
              </span>{" "}
              who cares deeply about craft, motion, and the details that make an
              interface feel alive. I build with React and Next.js, animate with
              GSAP, and treat every project as an opportunity to push what&apos;s
              possible on the web.
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed">
              Currently leading frontend at a product studio — driving AI-assisted
              workflows, design system architecture, and mentoring the next
              generation of engineers.
            </p>
          </ScrollRevealText>
        </div>

        {/* Avatar — desktop right column */}
        <div className="hidden md:flex justify-end">
          <Avatar />
        </div>
      </div>

      {/* Avatar — mobile, stacked below bio */}
      <div className="mt-10 flex justify-center md:hidden">
        <div className="max-w-[260px] w-full">
          <Avatar />
        </div>
      </div>

      {/* ── Prose stats — marker sweep on scroll entry ────────────── */}
      <p
        ref={proseRef}
        className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mt-12 md:mt-16 max-w-2xl"
      >
        Built on{" "}
        <StatHighlight barRef={bar1Ref}>Four years of craft</StatHighlight>
        {", "}
        <StatHighlight barRef={bar2Ref}>twenty-plus projects shipped</StatHighlight>
        {", and a "}
        <StatHighlight barRef={bar3Ref}>B.Sc. in Communication and Electronics Engineering</StatHighlight>
        {" — every line of code carries intent."}
      </p>

      {/* ── Personal footnote ─────────────────────────────────────── */}
      <p className="font-body text-sm italic text-muted-foreground/50 mt-5">
        Outside of code — traveling somewhere new, doing yoga, or on a horse.
      </p>
    </section>
  );
}
