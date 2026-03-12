import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — Alaa Elghamry` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Back nav */}
      <div className="container-site pt-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-terracotta transition-colors duration-200"
        >
          ← Back to projects
        </Link>
      </div>

      {/* Hero image / video */}
      <div className="container-site mt-8">
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-card">
          {project.videoPreview ? (
            <video
              src={project.videoPreview}
              autoPlay
              muted
              loop
              playsInline
              controls
              poster={project.thumbnail}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-16">
        <div className="grid md:grid-cols-[1fr_320px] gap-16 items-start">
          {/* Main */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-2">
              {project.featured && (
                <Badge variant="outline" className="text-terracotta border-terracotta/40">
                  Featured
                </Badge>
              )}
              <span className="font-mono text-xs text-muted-foreground self-center">
                {project.year}
              </span>
            </div>

            <div>
              <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-4">
                {project.title}
              </h1>
              <p className="font-body text-xl text-muted-foreground leading-relaxed">
                {project.tagline}
              </p>
            </div>

            <div className="w-12 h-px bg-terracotta/40" />

            <p className="font-body text-base text-foreground/80 leading-relaxed max-w-2xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-card border border-border">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Role
              </span>
              <span className="font-body text-sm text-foreground">{project.role}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Year
              </span>
              <span className="font-body text-sm text-foreground">{project.year}</span>
            </div>

            <div className="w-full h-px bg-border" />

            <div className="flex flex-col gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-paper font-body font-medium text-sm transition-colors duration-200 hover:bg-terracotta-light"
                >
                  Live site ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-body font-medium text-sm transition-colors duration-200 hover:border-terracotta/60"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
