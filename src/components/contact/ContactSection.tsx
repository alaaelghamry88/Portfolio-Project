"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { personal } from "@/data/personal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TextReveal } from "@/components/shared/TextReveal";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dispatch   = useAppDispatch();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("contact")); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="container-site py-24 md:py-32"
      aria-label="Contact — The Next Step"
    >
      <div className="grid md:grid-cols-[9fr_11fr] gap-12 md:gap-20 items-start">
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="05 · The Next Step"
            title={"Let's Build\nSomething"}
          />
          <TextReveal className="flex flex-col gap-4">
            <p className="font-body text-muted-foreground leading-relaxed">
              Whether you have a project in mind, want to collaborate, or just
              want to talk craft — I&apos;d love to hear from you.
            </p>
            <a
              href={`mailto:${personal.email}`}
              className="font-mono text-sm text-terracotta hover:underline transition-all duration-200"
            >
              {personal.email}
            </a>
          </TextReveal>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
