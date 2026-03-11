/**
 * Home page — Phase 1 skeleton.
 * Content sections will be assembled here in Phases 2–4.
 */
export default function Home() {
  return (
    <>
      {/* Phase 2: HeroSection */}
      <section
        id="hero"
        className="min-h-svh flex items-center justify-center"
        aria-label="Hero"
      >
        <div className="container-site text-center">
          <h1 className="text-hero font-display text-foreground mb-6">
            The Craftsman&apos;s Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Phase 1 skeleton — design system active, dark theme live.
          </p>
        </div>
      </section>

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
