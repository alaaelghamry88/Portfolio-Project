"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { personal } from "@/data/personal";
import { Avatar } from "./Avatar";
import { ScrollRevealText } from "./ScrollRevealText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TextReveal } from "@/components/shared/TextReveal";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dispatch   = useAppDispatch();

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

  return (
    <section
      ref={sectionRef}
      id="about"
      className="container-site py-24 md:py-32"
      aria-label="About — The Origin"
    >
      <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
        <div className="flex justify-center md:justify-start">
          <Avatar />
        </div>
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="02 · The Origin"
            title={"The Person\nBehind the Code"}
          />
          <ScrollRevealText className="flex flex-col gap-4">
            <p className="font-body text-muted-foreground leading-relaxed">
              I&apos;m a{" "}
              <span data-highlight className="font-medium text-foreground">
                frontend developer
              </span>{" "}
              who cares deeply about craft, motion, and the details that make an
              interface feel alive. I build with React and Next.js, animate with
              GSAP and Framer Motion, and treat every project as an opportunity
              to push what&apos;s possible on the web.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              {personal.bio}
            </p>
          </ScrollRevealText>
          <TextReveal delay={0.3} className="flex flex-wrap gap-3">
            {[
              { value: "3+",  label: "years building" },
              { value: "20+", label: "projects shipped" },
              { value: "∞",   label: "coffee consumed" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border"
              >
                <span className="font-mono text-sm font-bold text-terracotta">
                  {value}
                </span>
                <span className="font-body text-xs text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
