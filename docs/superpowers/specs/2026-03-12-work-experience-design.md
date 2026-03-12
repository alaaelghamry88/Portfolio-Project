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

| Label | `href` | Section ID | Active colour |
|---|---|---|---|
| About | `#about` | `about` | `text-amber-400` |
| Experience | `#experience` | `experience` | `text-orange-400` |
| Projects | `#projects` | `projects` | `text-emerald-400` |
| Skills | `#skills` | `skills` | `text-sky-300` |
| Contact | `#contact` | `contact` | `text-violet-400` |

### `SECTION_TO_NAV` map update

```ts
const SECTION_TO_NAV: Record<string, string> = {
  about:      "About",
  experience: "Experience",
  projects:   "Projects",
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

If `logo` is undefined or the image fails to load, render a `32×32` rounded square with the company's initial letter, coloured using a deterministic hash of the company name mapped to one of the brand-adjacent colours (`amber`, `emerald`, `sky`, `violet`, `orange`).

Logo images live in `public/images/logos/`.

---

## 4. Component Architecture

All new files live in `src/components/experience/`.

### `ExperienceSection.tsx`

- `"use client"` — uses Redux dispatch and IntersectionObserver
- Section element: `id="experience"`, `ref={sectionRef}`
- `IntersectionObserver` with `threshold: 0.3` → dispatches `setActiveSection("experience")`
- Renders:
  - Kicker: `03 · The Journey` (mono, terracotta, uppercase)
  - Heading: two-line split matching existing `SectionHeading` component pattern
  - `<ExperienceAccordion experiences={experiences} />`
- Scroll entrance animation via `useGSAP` + `ScrollTrigger`: stagger rows in on first viewport entry (fires once, not on every scroll)

### `ExperienceAccordion.tsx`

- `"use client"` — manages open/close state
- Props: `experiences: Experience[]`
- State: `openId: string | null` — only one item open at a time
- Default: first item open once section has entered viewport (set via `onEnter` callback from `ExperienceSection`)
- Renders a list of `<ExperienceItem>` components
- Close sequence: previous item closes (`duration: 0.3`) before new item opens (`duration: 0.4`) — not simultaneous

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
- Content area uses a `ref` for GSAP height animation (`height: 0 → auto`)

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
Content height:    0 → auto,   duration: 0.4, ease: "power3.out"
Left border scaleY: 0 → 1,    duration: 0.3, ease: "power3.out", transformOrigin: "top"
Row number color:  muted → #c8602a + scale 1.05 → 1.0
Chevron rotation:  0 → 180deg, duration: 0.3
```

### Accordion close

```
Content height:    auto → 0,   duration: 0.3, ease: "power3.in"
Left border scaleY: 1 → 0,    duration: 0.2
Row number color:  #c8602a → muted
Chevron rotation:  180 → 0deg, duration: 0.3
```

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
| `src/components/layout/Navbar.tsx` | Add Experience item, update `SECTION_TO_NAV`, remove Hire Me button |
| `src/components/layout/SectionThread.tsx` | Add experience node, extend to 6 sections |
| `src/components/projects/ProjectsSection.tsx` | Kicker `03 →` `04 · The Work` |
| `src/components/skills/SkillsSection.tsx` | Kicker `04 →` `05 · The Craft` |
| `src/components/contact/ContactSection.tsx` | Kicker `05 →` `06 · The Next Step` |
| `src/app/page.tsx` | Add `<ExperienceSection />` between `<AboutSection />` and `<ProjectsSection />` |

---

## Out of Scope

- Company logo assets (user provides these to `public/images/logos/`)
- Actual experience data (user populates `src/data/experience.ts`)
- Mobile-specific accordion behaviour (follows same pattern, stack layout)
- Filtering by role type or technology
