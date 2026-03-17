export interface Experience {
  id: string;
  company: string;
  logo?: string;          // path relative to /public, e.g. "/images/logos/acme.svg"
  role: string;
  startDate: string;      // human-readable, e.g. "Jan 2023"
  endDate: string | null; // null renders as "Present"
  location: string;
  remote: boolean;
  description: string;
  achievements: string[];
  color: string;          // accent hex for number, bullets, and open-state highlights
  tags: string[];         // pill labels shown in the header (e.g. "Active", "SaaS", "Agency")
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "Trianglz LLC",
    role: "Mid-Senior Frontend Engineer",
    startDate: "Jul 2024",
    endDate: null,
    location: "Alexandria, Egypt",
    remote: true,
    color: "#c8602a", // Terracotta — active / current
    tags: ["Active", "AI-Driven", "Design Systems", "Mentorship"],
    description:
      "Leading frontend engineering at a product studio, driving AI-assisted development workflows, design system architecture, and performance optimization across multiple client products.",
    achievements: [
      "Pioneered the BMAD method to develop a Check-in/Check-out HR system, managing AI agents through the full dev lifecycle with rigorous code reviews",
      "Achieved ~40% improvement in load times for the Mimar project by optimizing Core Web Vitals and implementing advanced React patterns",
      "Designed and maintained a modular Design System and shared component libraries using Tailwind and Shadcn, improving cross-project efficiency",
      "Authored a 3-month Frontend Internship curriculum — 50% of interns successfully integrated into the core team",
      "Delivered technical talks on performance optimization and algorithms, fostering a culture of continuous learning",
    ],
  },
  {
    id: "exp-2",
    company: "eSpace",
    role: "Frontend Engineer",
    startDate: "Jun 2023",
    endDate: "Jul 2024",
    location: "Alexandria, Egypt",
    remote: false,
    color: "#60a5fa", // Blue — product / feature work
    tags: ["Product", "SaaS", "React"],
    description:
      "Developed and enhanced core frontend features for the Exceed product, building scalable React components and collaborating with backend and QA teams to ship high-quality releases.",
    achievements: [
      "Built reusable React components for notifications, leaderboards, subscriptions, surveys, and reporting dashboards",
      "Collaborated with backend and QA teams to integrate APIs and ensure high-quality, clean modular releases",
      "Applied frontend best practices to improve maintainability and support long-term scalability",
    ],
  },
  {
    id: "exp-3",
    company: "Sayegh1944",
    role: "Frontend Developer",
    startDate: "Jan 2022",
    endDate: "Mar 2023",
    location: "Alexandria, Egypt",
    remote: false,
    color: "#f0a500", // Amber — creative / interactive
    tags: ["EdTech", "Interactive", "Games"],
    description:
      "Led the development of responsive, interactive, and educational games tailored for children of varying skill levels.",
    achievements: [
      "Built engaging educational games enhancing learning outcomes across different age groups and skill levels",
      "Delivered responsive, interactive UI experiences with a focus on child-friendly design and accessibility",
    ],
  },
];
