import type { Project } from "@/types/project";

/** Maps tech tags to palette accent colors by category */
const TAG_COLORS: Record<string, string> = {
  // Frameworks — Terracotta
  "React":          "#c8602a",
  "Next.js":        "#c8602a",
  "Node.js":        "#c8602a",
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
  "AI Integration": "#52b788",
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
    tags: ["Design Systems","AI Integration", "Next.js", "TypeScript", "GSAP", "Creative Coding"],
    year: 2026,
    role: "Lead Frontend Engineer",
    liveUrl: "https://drift-ai-brown.vercel.app/",
    thumbnail:
      "/images/projects/drift-app.png",
    videoPreview: "/videos/projects/drift-app.mp4",
    featured: true,
  },
  {
    slug: "obsidian-cryptoBoard",
    title: "Obsidian-CryptoBoard",
    tagline: "Real-time analytics that actually feels real-time.",
    description:
      "A production-grade crypto market dashboard built to showcase data visualization at scale. It pulls live data for 50+ coins from the CoinGecko API, renders custom D3 charts (candlestick, sparklines, area, donut), and tracks portfolio performance with real P&L breakdowns. An integrated AI chat widget — backed by the GROQ API — lets users ask natural-language questions about market conditions. The entire app is built with React 19, TypeScript, Vite, and Tailwind CSS, with glassmorphism UI, staggered animations, and fully persistent settings.",
    tags: ["Next.js","AI Integration", "WebSockets", "D3.js", "TypeScript"],
    year: 2025,
    role: "Fullstack Engineer",
    liveUrl: "https://cryptoo-dashboard-beta.vercel.app/",
    githubUrl: "https://github.com/alaaelghamry88/crypto-dashboard",
    thumbnail:
      "/images/projects/obsidian-dash.png",
    videoPreview: "/videos/projects/obsidian-dash.mp4",
    featured: false,
  },
  {
    slug: "standup-board",
    title: "Standup Board",
    tagline: "A real-time team dashboard for daily standups.",
    description:
      "A real-time team dashboard for daily standups that solves a critical pain point: making sprint progress visible at a glance during shared-screen standups. Instead of each team member hunting through individual Jira boards, the app aggregates everyone's tasks into one shared, highly scannable interface. Built with React + TypeScript frontend and Express backend, featuring drag-and-drop task management powered by dnd-kit, efficient data fetching with React Query, and lightweight state management with Zustand. Designed with a clean, Linear-inspired aesthetic that prioritizes information density and readability at distance. Includes TypeScript for type safety, Vite for fast development, comprehensive test coverage with Vitest, and Docker containerization for production deployments.",
    tags: ["Next.js","Node.js","TypeScript"],
    year: 2024,
    role: "Creative Developer",
    thumbnail:
      "/images/projects/standup-board.png",
    videoPreview: "/videos/projects/standup-board.mp4",
    featured: false,
  },
];

export const featuredProject = projects.find((p) => p.featured)!;
