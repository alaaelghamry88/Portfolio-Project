# Phase 3 Design Spec — Content Sections

**Project:** Alaa Elghamry — "The Craftsman's Journal"
**Date:** 2026-03-11
**Status:** Approved
**Approach:** Sequential (A) — data → shared → about → projects → skills → contact

---

## Overview

Phase 3 builds the four content sections that follow the hero: About, Projects, Skills, and Contact. It also populates the data layer, creates shared animation components, updates the footer with social links, and wires up a working contact form API.

---

## 1. Data Layer

**Location:** `src/data/`

### `projects.ts`

Exports `Project[]` (type from `src/types/project.ts`). Three fake entries:

| # | Title | Type | Featured | Year |
|---|-------|------|----------|------|
| 1 | Luminary DS | Design system / component library | `true` | 2025 |
| 2 | PulseBoard | Real-time analytics dashboard | `false` | 2024 |
| 3 | Kinetic Studio | Creative animated landing page | `false` | 2024 |

- **Featured project** (`Luminary DS`) gets `videoPreview` path → video strip card
- Others get `thumbnail` path → full-bleed screenshot card
- All slugs match `/projects/[slug]` routes
- Media paths point to `/public/images/projects/` and `/public/videos/` (placeholder dirs)

### `skills.ts`

Exports `Skill[]` grouped across five categories:

- **frontend** — React, Next.js, TypeScript, Tailwind CSS, HTML/CSS
- **animation** — GSAP, Framer Motion, Three.js / R3F, CSS Animations
- **backend** — Node.js, REST APIs, PostgreSQL, Prisma
- **tools** — Git, Figma, VS Code, Vercel, Docker (basic)
- **design** — Design Systems, Component Architecture, Accessibility, Responsive Design

### `personal.ts`

Exports:
- `bio`: 2–3 sentence bio as a frontend developer focused on craft, motion, and detail
- `socialLinks`: `{ github, linkedin, twitter }` — placeholder URLs (user fills in real handles)
- `email`: placeholder contact email
- `nowText`: short "what I'm working on" blurb for the `/now` page (Phase 5)

---

## 2. Shared Components

**Location:** `src/components/shared/`

### `SectionHeading.tsx`

Props: `kicker: string`, `title: string`, `className?: string`

- Kicker: JetBrains Mono, terracotta (`text-primary`), uppercase, `tracking-widest`, small size
- Title: Clash Display (`font-display`), `text-section` utility, foreground color
- GSAP entrance via `useGSAP`: kicker fades up from `y: 8, opacity: 0`; title chars split and slide from `110%` (same char-split pattern as `HeroText.tsx`)
- Triggered by ScrollTrigger at `start: "top 80%"`
- `prefers-reduced-motion` fallback: instant reveal

### `TextReveal.tsx`

Props: `children: ReactNode`, `delay?: number`, `className?: string`

- Wraps children in a div; on mount splits visible text lines into spans
- `ScrollTrigger.batch()` reveals lines: `y: 30 → 0`, `opacity: 0 → 1`, `0.06s` stagger
- Used in About bio and Contact invitation text

### `MagneticButton.tsx`

Props: `children: ReactNode`, `className?: string`, `strength?: number` (default `0.3`)

- On mouse move: GSAP `quickTo` x/y pulls element toward cursor at `strength` factor
- On mouse leave: springs back to origin (`power3.out`, `0.6s`)
- `useMediaQuery("(hover: none)")` → renders children unwrapped on touch devices
- Used for Contact submit button and any CTA that needs magnetic feel

---

## 3. About Section — "02 · The Origin"

**Location:** `src/components/about/`

### Layout

- Desktop: two-column grid — left 40% (avatar), right 60% (text)
- Mobile: single column, avatar on top

### Components

**`Avatar.tsx`**

- Renders `<img src="/images/avatar.jpg" alt="Alaa Elghamry" />`
- Duotone effect applied in-browser: CSS `mix-blend-mode: luminosity` on the image + a terracotta (`#c8602a`) tint overlay div with `mix-blend-mode: color` — no pre-processing needed
- Placeholder: styled `<div>` with initials "AE" in Clash Display, terracotta on steel background, same aspect ratio
- Entrance: `x: -60, opacity: 0` → rest, `power3.out`, ScrollTrigger `start: "top 75%"`

**`ScrollRevealText.tsx`**

- Wraps bio paragraphs; uses `TextReveal` internally
- After each line reveals, scans for emphasis words (`[data-highlight]`) and applies a terracotta color + `scale: 1.02` pulse (`0.3s` after line reveal completes)

**`AboutSection.tsx`**

- Orchestrator: `<section id="about">`
- Left: `<Avatar />`
- Right: `<SectionHeading kicker="02 · The Origin" title="The Person\nBehind the Code" />` + `<ScrollRevealText>` bio + 3 stat chips (e.g. "3+ years", "20+ projects", "∞ coffee")
- Stat chips: small mono text, terracotta number, muted label, border `#3a4555`, fade in last

---

## 4. Projects Section — "03 · The Work"

**Location:** `src/components/projects/`

### Layout

- Desktop: two-column — left (heading + meta), right (stacked cards)
- Mobile: single column, cards stack vertically with simple scroll-fade entrance

### Card Interaction

**Scroll-driven fan-out (desktop):**

- Cards start fully stacked (z-stacked via `[grid-area:stack]`, skewed `-6deg`)
- On scroll-enter, GSAP ScrollTrigger scrub (`scrub: 1.2`) fans them out:
  - Card 3 (back) peels first: `translateX(+60px) translateY(+80px)` → rest
  - Card 2 (middle) peels next
  - Card 1 (front, featured) stays, becomes fully visible with terracotta border
- Hover on any card: lifts `translateY(-12px)`, grayscale → color, border terracotta
- Click → navigates to `/projects/[slug]`

### Components

**`ProjectCard.tsx`**

Props: `project: Project`

Two visual variants based on `project.featured`:

- `featured: true` (video strip):
  - Top 55%: `<video autoPlay muted loop playsInline>` — looping screen recording
  - Play icon overlay (terracotta)
  - Bottom 45%: tag badge, title, tagline, tech badges, "case study →" link
  - Border: terracotta `#c8602a88`

- `featured: false` (full-bleed):
  - Full card: `<img>` as CSS background, `background-size: cover`
  - Dark gradient overlay `linear-gradient(to top, #1a1e24ee 50%, transparent)`
  - Text overlaid at bottom: tag, title, tagline
  - Border: `#3a4555`

Shared styles: `skewY(-6deg)`, `grayscale(100%)` default, grayscale removed on hover, `::after` right-fade gradient, `::before` dark overlay on back cards.

**`ProjectsSection.tsx`**

- `<section id="projects">`
- Desktop grid: left column heading, right column `cards-area`
- `cards-area`: `display: grid; grid-template-areas: 'stack'` — all cards overlap
- GSAP ScrollTrigger fan-out timeline scrubbed to scroll progress
- "View all work" link (MagneticButton, outline style)

### Case Study Pages

**`app/projects/[slug]/page.tsx`**

- Dynamic route — reads slug, finds project from `projects.ts`
- `notFound()` if slug doesn't match
- Light palette: `className="light"` on `<main>` overrides to `--background: #f5f0e8`
- Layout: `max-width: 900px` centered, editorial typography
- Structure:
  1. Back link ("← Back to work")
  2. Kicker + large title (Clash Display)
  3. Meta row: role, year, tags
  4. Full-width hero `<video>` (autoplay, muted, loop) or `<img>`
  5. Description paragraphs (max-width 720px)
  6. Full-bleed screenshot(s) between text blocks
  7. Live / GitHub links (MagneticButton)
- Entrance: `opacity: 0 → 1` + title `y: 30 → 0`, `power3.out`

---

## 5. Skills Section — "04 · The Practice"

**Location:** `src/components/skills/`

### Layout

- SectionHeading centered at top
- Category filter tabs below heading
- Responsive card grid below tabs

### Components

**`SkillCard.tsx`**

Props: `skill: Skill`

- Icon: lucide-react icon if available, else first 2 letters of name as mono text
- Name: `font-body`, medium weight
- Category badge: color-coded
  - `frontend` → green
  - `animation` → blue
  - `backend` → amber
  - `tools` → slate
  - `design` → purple
- Hover: `y: -4px`, border → terracotta, subtle terracotta glow shadow
- Transition: `0.2s ease`

**`SkillsSection.tsx`**

- `<section id="skills">`
- Category tabs: JetBrains Mono, terracotta underline on active tab
- Active tab stored in local `useState` (not Redux — ephemeral UI state)
- Tab switch animation: GSAP — old cards `opacity → 0, y → -8` out, new cards stagger in `y: 0, opacity: 1`, `0.04s` stagger
- Initial entrance: `ScrollTrigger.batch()` — cards wave-stagger in (row by row, not linear)
- Mobile: tabs become horizontally scrollable strip (`overflow-x: auto`, no scrollbar)

---

## 6. Contact Section — "05 · The Next Step"

**Location:** `src/components/contact/`

### Layout

- Desktop: two-column — left 45% (invitation + email), right 55% (form)
- Mobile: stacked, heading first then form

### Components

**`ContactForm.tsx`**

- `react-hook-form` + `zod` schema:
  ```ts
  z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
  })
  ```
- Fields: Name (input), Email (input), Message (textarea, min 4 rows)
- Submit: `MagneticButton` wrapping terracotta-filled button, label "Send it →"
- States:
  - `idle`: normal form
  - `loading`: button shows spinner, fields disabled
  - `success`: form fades out (`opacity: 0, y: -20`), replaced by "Message sent. I'll be in touch." in Clash Display, waving hand emoji
  - `error`: sonner toast with error message, form stays editable
- `prefers-reduced-motion`: skips fade transitions, shows/hides instantly

**`ContactSection.tsx`**

- `<section id="contact">`
- Left: `<SectionHeading kicker="05 · The Next Step" title="Let's Build\nSomething" />` + invitation paragraph + email as `<a href="mailto:...">` in JetBrains Mono, terracotta
- Right: `<ContactForm />`

### API Route

**`app/api/contact/route.ts`**

```
POST /api/contact
Body: { name, email, message }
→ Validates with zod
→ Sends via Resend SDK to CONTACT_EMAIL
→ 200 { success: true }
→ 400 { error: "validation", issues: [...] }
→ 500 { error: "send_failed" }
```

Requires env vars:
- `RESEND_API_KEY`
- `CONTACT_EMAIL`

---

## 7. Footer Update

**File:** `src/components/layout/Footer.tsx`

- Add social links row: GitHub, LinkedIn, Twitter/X — each an icon link (`lucide-react`: `Github`, `Linkedin`, `Twitter`)
- Hover: icon color → terracotta, `MagneticButton` wrapping
- Add email `mailto:` link
- Social URLs sourced from `personal.ts` `socialLinks`

---

## 8. Page Integration

**`app/page.tsx`**

Replace section stubs with real components:
```tsx
<HeroSection />
<AboutSection />
<ProjectsSection />
<SkillsSection />
<ContactSection />
```

**`app/projects/[slug]/page.tsx`** — new dynamic route file.

**`.env.example`** — documents required vars (committed to repo):
```
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com
```

**`public/` structure** — placeholder dirs with `.gitkeep`:
- `public/images/projects/`
- `public/images/avatar/`
- `public/videos/`

**Redux seeding** — `ProjectsSection` dispatches `setProjects(projects)` on mount so `projectsSlice` is populated for future navbar/filter use.

**IntersectionObserver** — each section (`About`, `Projects`, `Skills`, `Contact`) dispatches `setActiveSection(id)` when 50%+ in viewport, enabling scroll-spy for Phase 4 navbar.

**New dependency:** `resend` npm package.

---

## Animation Summary

| Section | Trigger | Animation |
|---------|---------|-----------|
| About avatar | ScrollTrigger `top 75%` | `x: -60 → 0`, `opacity: 0 → 1`, `power3.out` |
| About text | ScrollTrigger batch | Line-by-line `y: 30 → 0`, `0.06s` stagger |
| Projects fan-out | ScrollTrigger scrub `1.2` | Cards peel from stack sequentially |
| Project card hover | Mouse enter/leave | `y: -12`, grayscale off, border terracotta |
| Skills entrance | ScrollTrigger batch | Wave stagger across grid rows |
| Skills tab switch | Click | Old cards out `y: -8`, new cards in stagger |
| Contact form success | Submit | Form `y: -20, opacity: 0`, success text in |
| SectionHeading | ScrollTrigger `top 80%` | Kicker fade up, title char-split |

---

## File Checklist

```
src/data/
  projects.ts
  skills.ts
  personal.ts

src/components/shared/
  SectionHeading.tsx
  TextReveal.tsx
  MagneticButton.tsx

src/components/about/
  AboutSection.tsx
  Avatar.tsx
  ScrollRevealText.tsx

src/components/projects/
  ProjectsSection.tsx
  ProjectCard.tsx

src/components/skills/
  SkillsSection.tsx
  SkillCard.tsx

src/components/contact/
  ContactSection.tsx
  ContactForm.tsx

app/
  page.tsx                    (updated)
  projects/[slug]/page.tsx    (new)
  api/contact/route.ts        (new)

public/
  images/projects/.gitkeep
  images/avatar/.gitkeep
  videos/.gitkeep

.env.example                  (new)
```

---

## Out of Scope (Phase 4+)

- Full Navbar scroll-spy highlighting (Phase 4)
- CustomCursor (Phase 5)
- `/now` page (Phase 5)
- Real avatar photo processing (user task)
- Real project media (user task — swap placeholders)
- Resend account setup + env vars (user task)
