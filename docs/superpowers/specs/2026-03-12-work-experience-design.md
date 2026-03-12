# Design Spec: Work Experience Section

**Date:** 2026-03-12
**Project:** Alaa Elghamry — "The Craftsman's Journal" portfolio
**Status:** Approved

---

## Overview

Add a Work Experience section to the portfolio as section 03, positioned after About. Uses a numbered accordion layout — bold role numbers collapsed by default, clicking a row expands it to reveal full details. No second thread line; all motion driven by GSAP following existing patterns.

---

## 1. Page Structure Changes

### New section order

```
01 Hero → 02 About → 03 Experience → 04 Projects → 05 Skills → 06 Contact
```

### SectionThread

`SECTIONS` array in `src/components/layout/SectionThread.tsx` gains a 6th entry:

```ts
const SECTIONS = [
  { id: "hero",       label: "01" },
  { id: "about",      label: "02" },
  { id: "experience", label: "03" },
  { id: "projects",   label: "04" },
  { id: "skills",     label: "05" },
  { id: "contact",    label: "06" },
] as const;
```

### Section kicker renumbering

| Section | Old kicker | New kicker |
|---|---|---|
| About | `02 · The Origin` | unchanged |
| Projects | `03 · The Work` | `04 · The Work` |
| Skills | `04 · The Craft` | `05 · The Craft` |
| Contact | `05 · The Next Step` | `06 · The Next Step` |

---

## 2. Navbar Changes

### Updated nav items

Add Experience between About and Projects. Remove the "Hire Me" CTA button entirely.

The full updated `navItems` array (replace existing):

```ts
const navItems: NavItem[] = [
  {
    href: "#about",
    label: "About",
    icon: <User className="h-4 w-4" />,
    gradient: "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0.06) 50%, rgba(251,191,36,0) 100%)",
    iconColor: "group-hover:text-amber-400",
    activeColor: "text-amber-400",
  },
  {
    href: "#experience",
    label: "Experience",
    icon: <Briefcase className="h-4 w-4" />,
    gradient: "radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(251,146,60,0.05) 50%, rgba(251,146,60,0) 100%)",
    iconColor: "group-hover:text-orange-400",
    activeColor: "text-orange-400",
  },
  {
    href: "#projects",
    label: "Projects",
    icon: <FolderKanban className="h-4 w-4" />,
    gradient: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, rgba(52,211,153,0.05) 50%, rgba(52,211,153,0) 100%)",
    iconColor: "group-hover:text-emerald-400",
    activeColor: "text-emerald-400",
  },
  {
    href: "#skills",
    label: "Skills",
    icon: <Code2 className="h-4 w-4" />,
    gradient: "radial-gradient(circle, rgba(125,211,252,0.18) 0%, rgba(125,211,252,0.05) 50%, rgba(125,211,252,0) 100%)",
    iconColor: "group-hover:text-sky-300",
    activeColor: "text-sky-300",
  },
  {
    href: "#contact",
    label: "Contact",
    icon: <Mail className="h-4 w-4" />,
    gradient: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0.05) 50%, rgba(167,139,250,0) 100%)",
    iconColor: "group-hover:text-violet-400",
    activeColor: "text-violet-400",
  },
];
```

Replace the existing `Briefcase` import usage (currently on the Work item) with `FolderKanban` for Projects. Import `FolderKanban` from `lucide-react`.

### `SECTION_TO_NAV` map update

Update **atomically** — both the map value and the nav item label must change together, or the active-state check `activeLabel === item.label` will break:

```ts
const SECTION_TO_NAV: Record<string, string> = {
  about:      "About",
  experience: "Experience",
  projects:   "Projects",   // was "Work"
  skills:     "Skills",
  contact:    "Contact",
};
```

### Hire Me button

Remove the `<Link href="#contact">` CTA button from `Navbar.tsx`. Contact is reachable via the nav item and the SectionThread — the button is redundant.

---

## 3. Data Layer

### File: `src/data/experience.ts`

```ts
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
}

export const experiences: Experience[] = [
  // populate with real data
];
```

### Logo fallback

If `logo` is undefined or the image fails to load, render a `32×32` rounded square with the company's initial letter. Colour is determined by: sum the char codes of `company`, modulo 5, then index into `["#f59e0b", "#10b981", "#7dd3fc", "#a78bfa", "#fb923c"]` (amber / emerald / sky / violet / orange). This is a pure function — same company name always produces the same colour.

Logo images live in `public/images/logos/`.

---

## 4. Component Architecture

All new files live in `src/components/experience/`.

### `ExperienceSection.tsx`

- `"use client"` — uses Redux dispatch and IntersectionObserver
- Section element: `id="experience"`, `ref={sectionRef}`
- `IntersectionObserver` with `threshold: 0.3` → dispatches `setActiveSection("experience")` on first intersection. This is the only coordination needed with the accordion — pass `defaultOpenFirst={hasEntered}` as a boolean derived from a `useState<boolean>` that flips to `true` on first intersection.
- Renders:
  - Kicker: `03 · The Journey` (mono, terracotta, uppercase)
  - Heading: two-line split matching existing `SectionHeading` component pattern
  - `<ExperienceAccordion experiences={experiences} defaultOpenFirst={hasEntered} />`
- Scroll entrance animation via `useGSAP` + `ScrollTrigger`: stagger rows in on first viewport entry (fires once, not on every scroll)

### `ExperienceAccordion.tsx`

- `"use client"` — manages open/close state
- Props: `{ experiences: Experience[]; defaultOpenFirst?: boolean }`
- When `defaultOpenFirst` transitions from `false` to `true` (via `useEffect` watching the prop), set `openId` to `experiences[0].id`. This avoids any imperative ref handle or parent-calls-child inversion.
- State: `openId: string | null` — only one item open at a time; `null` initially
- Renders a list of `<ExperienceItem>` components
- Close sequence: start the open animation in the `onComplete` callback of the close tween — do not use `setTimeout`

### `ExperienceItem.tsx`

- Props: `experience: Experience`, `index: number`, `isOpen: boolean`, `onToggle: () => void`
- **Collapsed state:**
  - Left: large bold number (`01`–`04`), muted terracotta (`rgba(200,96,42,0.25)`)
  - Centre: role title (foreground), company · location · date range (muted)
  - Right: chevron icon (`▾`)
  - Bottom border: `1px solid border`
- **Expanded state:**
  - Number animates to full `#c8602a`, scales `1.05` then settles at `1.0`
  - `2px` terracotta left-border accent on the content area (`scaleY: 0 → 1` from top)
  - Company logo (or initial fallback) + description + bullet achievements slide in
  - Chevron rotates `180deg`
- Content area uses a `ref` for GSAP height animation. Technique: before opening, read `el.scrollHeight` to get the natural pixel height, then animate `height: 0 → scrollHeight + "px"`. On close, animate `height → 0`. Do not animate to `"auto"` — GSAP requires a pixel value as the target.

---

## 5. Animations

All motion uses `useGSAP` + GSAP 3.14. Respects `usePrefersReducedMotion` — skip all transitions if true.

### Section entrance (fires once on scroll-in)

```
ScrollTrigger → stagger accordion rows:
  from: { opacity: 0, y: 24 }
  to:   { opacity: 1, y: 0 }
  duration: 0.6
  ease: "power3.out"
  stagger: 0.08
  once: true
```

### Accordion open

```
Content height:    0 → el.scrollHeight px,  duration: 0.4, ease: "power3.out"
Left border scaleY: 0 → 1,                  duration: 0.3, ease: "power3.out", transformOrigin: "top"
Row number color:  muted → #c8602a + scale 1.05 → 1.0
Chevron rotation:  0 → 180deg,              duration: 0.3
```

### Accordion close

```
Content height:    current px → 0,   duration: 0.3, ease: "power3.in"
Left border scaleY: 1 → 0,           duration: 0.2
Row number color:  #c8602a → muted
Chevron rotation:  180 → 0deg,       duration: 0.3
```

**Sequencing close → open:** When the user clicks a new item while one is open, run the close tween on the current item first. Start the open tween for the new item in the close tween's `onComplete` callback. Do not use `setTimeout`.

---

## 6. Files to Create / Modify

### New files

| File | Responsibility |
|---|---|
| `src/data/experience.ts` | Experience data + TypeScript interface |
| `src/components/experience/ExperienceSection.tsx` | Section wrapper, IntersectionObserver, entrance animation |
| `src/components/experience/ExperienceAccordion.tsx` | Accordion state manager |
| `src/components/experience/ExperienceItem.tsx` | Single expandable row |

### Modified files

| File | Change |
|---|---|
| `src/lib/constants.ts` | Replace `SECTION_IDS` and `NAV_LINKS` with the final versions shown below |
| `src/components/layout/Navbar.tsx` | Add Experience nav item, rename projects label "Work" → "Projects", update `SECTION_TO_NAV`, remove Hire Me button |
| `src/components/layout/SectionThread.tsx` | Add experience node, extend to 6 sections |
| `src/components/projects/ProjectsSection.tsx` | Kicker `03 →` `04 · The Work` |
| `src/components/skills/SkillsSection.tsx` | Kicker `04 →` `05 · The Craft` |
| `src/components/contact/ContactSection.tsx` | Kicker `05 →` `06 · The Next Step` |
| `src/app/page.tsx` | Add `<ExperienceSection />` between `<AboutSection />` and `<ProjectsSection />` |

### Final `src/lib/constants.ts` values

```ts
export const SECTION_IDS = [
  "hero", "about", "experience", "projects", "skills", "contact",
] as const;

export const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Skills",     href: "#skills"     },
  { label: "Contact",    href: "#contact"    },
] as const;
```

> **Footer note:** `Footer.tsx` iterates `NAV_LINKS` from `src/lib/constants.ts`. Updating `NAV_LINKS` in `constants.ts` will automatically include Experience in the footer nav — no direct change to `Footer.tsx` is required.

---

## Out of Scope

- Company logo assets (user provides these to `public/images/logos/`)
- Actual experience data (user populates `src/data/experience.ts`)
- Mobile-specific accordion behaviour (follows same pattern, stack layout)
- Filtering by role type or technology
