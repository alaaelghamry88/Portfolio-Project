import { HeroSection }     from "@/components/hero/HeroSection";
import { AboutSection }    from "@/components/about/AboutSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SkillsSection }   from "@/components/skills/SkillsSection";
import { ContactSection }  from "@/components/contact/ContactSection";

/**
 * Home page — Phase 3 complete.
 * All content sections assembled.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
