import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    slug: "luminary-ds",
    title: "Luminary DS",
    tagline: "A design system built for scale and craft.",
    description:
      "Luminary DS is a fully-documented component library built with React, TypeScript, and Storybook. It enforces design tokens via CSS custom properties and ships with a comprehensive accessibility audit pipeline. Used across three internal products, it cut design-to-code handoff time by 60%.",
    tags: ["Design Systems", "React", "TypeScript", "Storybook"],
    year: 2025,
    role: "Lead Frontend Engineer",
    liveUrl: "https://example.com/luminary",
    githubUrl: "https://github.com/yourusername/luminary-ds",
    thumbnail:
      "https://images.unsplash.com/photo-1573805672213-81b449b17e8a?auto=format&fit=crop&w=1200&q=80",
    videoPreview: "/videos/projects/luminary-ds-preview.mp4",
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
];

export const featuredProject = projects.find((p) => p.featured)!;
