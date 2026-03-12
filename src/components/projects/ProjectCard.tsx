"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
  "data-card"?: string;
}

export function ProjectCard({ project, className, style, "data-card": dataCard }: Props) {
  if (project.featured) {
    return <FeaturedCard project={project} className={className} style={style} data-card={dataCard} />;
  }
  return <StandardCard project={project} className={className} style={style} data-card={dataCard} />;
}

function FeaturedCard({ project, className, style, "data-card": dataCard }: Props) {
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
      data-card={dataCard}
      style={style}
      className={cn(
        "group block rounded-2xl overflow-hidden bg-card",
        "border border-terracotta/50",
        "transition-transform duration-300 ease-out",
        "hover:border-terracotta",
        className,
      )}
      aria-label={`View case study: ${project.title}`}
    >
      <div className="relative h-[55%] bg-steel overflow-hidden">
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
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-terracotta/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="white">
              <path d="M0 1.5L16 9L0 16.5V1.5Z" />
            </svg>
          </div>
        </div>
        <div
          className="absolute inset-y-0 right-0 w-16 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, #1a1e2488)" }}
          aria-hidden="true"
        />
      </div>
      <div className="h-[45%] p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] text-terracotta border-terracotta/40">
              Featured
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
          </div>
          <h3 className="font-display font-bold text-xl text-foreground">{project.title}</h3>
          <p className="font-body text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="font-mono text-xs text-terracotta group-hover:underline">case study →</span>
        </div>
      </div>
    </Link>
  );
}

function StandardCard({ project, className, style, "data-card": dataCard }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-card={dataCard}
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
        <img
          src={project.thumbnail}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
        <h3 className="font-display font-bold text-lg text-foreground">{project.title}</h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-1">{project.tagline}</p>
      </div>
    </Link>
  );
}

