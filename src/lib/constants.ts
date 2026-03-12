/** Tailwind breakpoints (mirrors tailwind.config) */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Section IDs used for IntersectionObserver & Redux navigation */
export const SECTION_IDS = [
  "hero", "about", "experience", "projects", "skills", "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Nav links */
export const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Skills",     href: "#skills"     },
  { label: "Contact",    href: "#contact"    },
] as const;
