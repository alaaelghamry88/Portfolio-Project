import type { Project } from "@/types/project";

/** Maps tech tags to palette accent colors by category */
const TAG_COLORS: Record<string, string> = {
  // Frameworks — Terracotta
  "React":          "#c8602a",
  "Next.js":        "#c8602a",
  // Language / Tooling — Blue
  "TypeScript":     "#60a5fa",
  "Storybook":      "#60a5fa",
  "WebSockets":     "#60a5fa",
  // Animation / Creative — Amber
  "GSAP":           "#f0a500",
  "Three.js":       "#f0a500",
  "D3.js":          "#f0a500",
  "Creative Coding":"#f0a500",
  // Architecture / Systems — Green
  "Design Systems": "#52b788",
};

export function tagColor(tag: string): string {
  return TAG_COLORS[tag] ?? "#a89f90"; // muted fallback
}

export const projects: Project[] = [
  {
    slug: "drift-app",
    title: "Drift-App",
    tagline: "A personalized AI intelligence app built for developers.",
    description:
      "Drift is a personalized AI intelligence layer designed to help developers navigate the fast-moving AI landscape without overwhelm. The app delivers a daily curated digest tailored to each user's stack and current project context, includes a one-click should I learn this? verdict engine powered by real-time web search, and lets users drop any link for instant relevance assessment. Built with Next.js, TypeScript, and Tailwind CSS, with Claude as the AI backbone — emphasizing calm UX, streaming interactions, and generative card components that adapt to content type.",
    tags: ["Design Systems", "Next.js", "TypeScript", "GSAP", "Creative Coding"],
    year: 2025,
    role: "Lead Frontend Engineer",
    liveUrl: "https://drift-ai-brown.vercel.app/",
    githubUrl: "#",
    thumbnail:
      "/images/projects/drift-app.png",
    videoPreview: "/videos/projects/drift-app.mp4",
    featured: true,
  },
  {
    slug: "pulseboard",
    title: "PulseBoard",
    tagline: "Real-time analytics that actually feels real-time.",
    description:
      "PulseBoard is a WebSocket-powered analytics dashboard for monitoring live event streams. Built with Next.js and D3.js, it renders thousands of data points per second without frame drops. Features customisable widget layouts with drag-and-drop powered by dnd-kit.",
    tags: ["Next.js", "WebSockets", "D3.js", "TypeScript"],
    year: 2024,
    role: "Fullstack Engineer",
    liveUrl: "https://example.com/pulseboard",
    githubUrl: "https://github.com/yourusername/pulseboard",
    thumbnail:
      "https://images.unsplash.com/photo-1771923082503-0a3381c46cef?auto=format&fit=crop&w=1200&q=80",
    videoPreview: "/videos/projects/pulseboard-preview.mp4",
    featured: false,
  },
  {
    slug: "kinetic-studio",
    title: "Kinetic Studio",
    tagline: "An animated landing page that moves like it means it.",
    description:
      "Kinetic Studio is a showcase landing page for a fictional creative agency, built to push the limits of CSS and GSAP. It features a scroll-driven 3D scene, magnetic buttons, SVG path morphing, and a colour-shift hero. Lighthouse score: 97.",
    tags: ["GSAP", "Three.js", "Next.js", "Creative Coding"],
    year: 2024,
    role: "Creative Developer",
    liveUrl: "https://example.com/kinetic",
    githubUrl: "https://github.com/yourusername/kinetic-studio",
    thumbnail:
      "https://images.unsplash.com/photo-1768141732026-55ea156f5aa9?auto=format&fit=crop&w=1200&q=80",
    videoPreview: "/videos/projects/kinetic-studio-preview.mp4",
    featured: false,
  },
  {
    slug: "Drift-Landing",
    title: "Drift Landing",
    tagline: "A modern landing page for a SaaS product.",
    description:
      "Kinetic Studio is a showcase landing page for a fictional creative agency, built to push the limits of CSS and GSAP. It features a scroll-driven 3D scene, magnetic buttons, SVG path morphing, and a colour-shift hero. Lighthouse score: 97.",
    tags: ["GSAP", "Three.js", "Next.js", "Creative Coding"],
    year: 2024,
    role: "Creative Developer",
    liveUrl: "https://example.com/kinetic",
    githubUrl: "https://github.com/yourusername/kinetic-studio",
    thumbnail:
      "https://images.unsplash.com/photo-1768141732026-55ea156f5aa9?auto=format&fit=crop&w=1200&q=80",
    videoPreview: "/videos/projects/kinetic-studio-preview.mp4",
    featured: false,
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
