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
    company: "Acme Corp",
    role: "Senior Frontend Developer",
    startDate: "Jan 2023",
    endDate: null,
    location: "Cairo",
    remote: true,
    color: "#52b788", // Green — active / growing
    tags: ["Active", "SaaS", "Performance"],
    description:
      "Led UI architecture for a SaaS dashboard serving 50k daily active users, owning the component system and performance strategy.",
    achievements: [
      "Reduced bundle size by 40% via route-level code splitting and tree-shaking",
      "Shipped real-time data visualisations with D3 + React, handling 1M+ data points",
      "Mentored 3 junior engineers and established frontend code review standards",
    ],
  },
  {
    id: "exp-2",
    company: "Studio Nova",
    role: "Frontend Engineer",
    startDate: "Mar 2021",
    endDate: "Dec 2022",
    location: "Berlin",
    remote: false,
    color: "#f0a500", // Amber — creative energy
    tags: ["Agency", "Motion", "Creative Dev"],
    description:
      "Built interactive marketing sites and digital campaigns for global brands, with a focus on motion design and creative development.",
    achievements: [
      "Delivered 12 client projects on time and under budget across 18 months",
      "Pioneered a shared motion design system used across all agency projects",
      "Introduced Storybook component documentation, cutting design-handoff time by 30%",
    ],
  },
  {
    id: "exp-3",
    company: "TechStart",
    role: "UI Developer",
    startDate: "Jun 2019",
    endDate: "Feb 2021",
    location: "Cairo",
    remote: false,
    color: "#60a5fa", // Blue — foundational / technical
    tags: ["Startup", "Fintech", "Design Systems"],
    description:
      "Designed and built a component library from scratch for a fintech product, working directly with the design and product teams.",
    achievements: [
      "Built 40+ reusable, accessible components documented in Storybook",
      "Reduced design-to-development handoff time by 60%",
    ],
  },
];
