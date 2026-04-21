"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { tagColor } from "@/data/projects";
import { cn } from "@/lib/utils";

function TagPill({ tag }: { tag: string }) {
  const color = tagColor(tag);
  return (
    <span
      className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}40`,
      }}
    >
      {tag}
    </span>
  );
}

interface Props {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
}

export function ProjectCard({ project, className, style }: Props) {
  if (project.featured) {
    return <FeaturedCard project={project} className={className} style={style} />;
  }
  return <StandardCard project={project} className={className} style={style} />;
}

/**
 * Featured card — cinematic split on desktop (video left, copy right),
 * stacked on mobile. No percentage heights — uses aspect-ratio + min-height
 * so it self-sizes reliably regardless of parent.
 */
function FeaturedCard({ project, className, style }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {/* blocked by browser policy */});
  }, []);

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={style}
      aria-label={`View case study: ${project.title}`}
      className={cn(
        "group relative grid grid-cols-1 md:grid-cols-[1.15fr_1fr]",
        "rounded-2xl overflow-hidden bg-card",
        "border border-terracotta/40",
        "transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
        "hover:border-terracotta hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(200,96,42,0.35)]",
        "md:min-h-[440px] lg:min-h-[520px]",
        className,
      )}
    >
      {/* Media — video / poster */}
      <div className="relative aspect-[16/10] md:aspect-auto md:h-full bg-steel overflow-hidden">
        {project.videoPreview && !videoFailed ? (
          <video
            ref={videoRef}
            src={project.videoPreview}
            poster={project.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 720px, 100vw"
            priority
          />
        )}

        {/* Play affordance on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-terracotta/85 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-1 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
            <svg width="18" height="20" viewBox="0 0 16 18" fill="white" aria-hidden="true">
              <path d="M0 1.5L16 9L0 16.5V1.5Z" />
            </svg>
          </div>
        </div>

        {/* Seam to the text column on desktop */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-y-0 right-0 w-20 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, var(--card) 90%)" }}
        />
        {/* Bottom gradient on mobile */}
        <div
          aria-hidden="true"
          className="md:hidden absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--card))" }}
        />
      </div>

      {/* Copy column */}
      <div className="relative p-6 md:p-8 lg:p-10 flex flex-col justify-between gap-6 md:gap-8">
        {/* Decorative corner tick */}
        <span
          aria-hidden="true"
          className="hidden md:block absolute top-5 right-5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground"
        >
          /01 · FEATURED
        </span>

        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] md:hidden text-terracotta border-terracotta/40">
              Featured
            </Badge>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {project.year}
              <span className="mx-2 text-muted-foreground/50">·</span>
              {project.role}
            </span>
          </div>

          <h3 className="font-display font-bold text-foreground text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] tracking-[-0.025em]">
            {project.title}
          </h3>

          <p className="font-body text-[0.95rem] md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-4 max-w-md">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta group-hover:tracking-[0.25em] transition-[letter-spacing] duration-500">
              case study
            </span>
            <span
              aria-hidden="true"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-terracotta/40 text-terracotta text-sm transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-rotate-45 group-hover:bg-terracotta/15"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StandardCard({ project, className, style }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{ minHeight: "280px", ...style }}
      className={cn(
        "group block rounded-2xl overflow-hidden relative",
        "border border-border",
        "transition-transform duration-300 ease-out",
        "hover:border-terracotta/60",
        className,
      )}
      aria-label={`View project: ${project.title}`}
    >
      {project.thumbnail ? (
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          sizes="(min-width: 1024px) 320px, 100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-steel" />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #1a1e24ee 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-20 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, #1a1e2466)" }}
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
        <h3 className="font-display font-bold text-lg text-foreground">{project.title}</h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-1">{project.tagline}</p>
      </div>
    </Link>
  );
}
