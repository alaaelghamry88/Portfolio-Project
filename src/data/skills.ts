import type { Skill } from "@/types/skill";

export const skills: Skill[] = [
  { name: "React",        category: "frontend",   proficiency: 5, orbit: "inner" },
  { name: "Next.js",      category: "frontend",   proficiency: 5, orbit: "inner" },
  { name: "TypeScript",   category: "frontend",   proficiency: 5, orbit: "inner" },
  { name: "Tailwind CSS", category: "frontend",   proficiency: 4, orbit: "inner" },
  { name: "HTML / CSS",   category: "frontend",   proficiency: 5, orbit: "inner" },
  { name: "GSAP",         category: "animation",  proficiency: 5, orbit: "outer" },
  { name: "Framer Motion",category: "animation",  proficiency: 4, orbit: "outer" },
  { name: "Three.js / R3F",category:"animation",  proficiency: 4, orbit: "outer" },
  { name: "CSS Animations",category:"animation",  proficiency: 5 },
  { name: "Node.js",      category: "backend",    proficiency: 3, orbit: "outer" },
  { name: "REST APIs",    category: "backend",    proficiency: 4 },
  { name: "PostgreSQL",   category: "backend",    proficiency: 3 },
  { name: "Prisma",       category: "backend",    proficiency: 3 },
  { name: "Figma",        category: "tools",      proficiency: 4, orbit: "outer" },
  { name: "Git / Vercel", category: "tools",      proficiency: 5, orbit: "outer" },
  { name: "VS Code",      category: "tools",      proficiency: 5 },
  { name: "Docker",       category: "tools",      proficiency: 2 },
  { name: "Design Systems",       category: "design", proficiency: 4 },
  { name: "Component Architecture",category:"design",  proficiency: 5 },
  { name: "Accessibility",         category: "design",  proficiency: 4 },
  { name: "Responsive Design",     category: "design",  proficiency: 5 },
];

export const INNER_RING_SKILLS = skills.filter((s) => s.orbit === "inner");
export const OUTER_RING_SKILLS = skills.filter((s) => s.orbit === "outer");
