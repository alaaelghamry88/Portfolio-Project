import { HeroSection } from "@/components/hero/HeroSection";

/**
 * Home page.
 * Phase 2: HeroSection fully implemented.
 * Phases 3–4: remaining sections assembled below.
 */
export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Phase 3: AboutSection */}
      <section id="about" className="py-24" aria-label="About" />

      {/* Phase 3: ProjectsSection */}
      <section id="projects" className="py-24" aria-label="Projects" />

      {/* Phase 3: SkillsSection */}
      <section id="skills" className="py-24" aria-label="Skills" />

      {/* Phase 3: ContactSection */}
      <section id="contact" className="py-24" aria-label="Contact" />
    </>
  );
}
