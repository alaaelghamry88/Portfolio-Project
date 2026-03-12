import { HeroSection }       from "@/components/hero/HeroSection";
import { AboutSection }      from "@/components/about/AboutSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { ProjectsSection }   from "@/components/projects/ProjectsSection";
import { SkillsSection }     from "@/components/skills/SkillsSection";
import { ContactSection }    from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
