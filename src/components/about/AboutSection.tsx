"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { personal } from "@/data/personal";
import { Avatar } from "./Avatar";
import { ScrollRevealText } from "./ScrollRevealText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TextReveal } from "@/components/shared/TextReveal";
import { Briefcase, GraduationCap, FolderKanban } from "lucide-react";

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
          {/* Info cards */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { Icon: Briefcase,     title: "Experience", detail: "+3 years Building" },
              { Icon: GraduationCap, title: "Education",  detail: "B.Sc. in Communication Engineering" },
              { Icon: FolderKanban,  title: "Projects",   detail: "20+ successfully shipped" },
            ].map(({ Icon, title, detail }) => (
              <li
                key={title}
                className="
                  flex flex-col gap-3 px-4 py-4 rounded-xl cursor-pointer
                  border border-border
                  transition-all duration-300
                  hover:scale-105 hover:border-terracotta hover:bg-card hover:shadow-lg hover:shadow-terracotta/10
                "
              >
                <Icon size={24} className="text-terracotta mt-1" />
                <h3 className="font-display font-semibold text-foreground">{title}</h3>
                <p className="font-body text-sm text-muted-foreground">{detail}</p>
              </li>
            ))}
          </ul>

          {/* Hobbies */}
          <div>
            <p className="font-body text-sm italic text-muted-foreground mb-3">
              Outside of coding, you&apos;ll often find me:
            </p>
            <ul className="flex flex-wrap gap-2">
              {["✈️ Traveling", "🧘 Doing Yoga", "🐴 Horse Riding"].map((chip) => (
                <li
                  key={chip}
                  className="px-3 py-1 rounded-full border border-border font-body text-sm text-muted-foreground"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
