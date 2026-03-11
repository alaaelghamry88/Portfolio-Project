# Brand Identity — "The Craftsman's Journal"

> A bold, expressive developer portfolio that blends cinematic dark aesthetics with warm editorial sensibility. Code as craft. Stillness meets controlled energy.

---

## Concept

The portfolio reads like a beautifully typeset personal journal or design monograph — warm, intentional, deeply personal — but alive with motion, 3D, and interactivity. The rhythm mirrors a yoga flow: moments of stillness, then controlled bursts of energy.

### Design Pillars

- **Bold & Expressive:** Large typography, confident statements, unapologetic use of space.
- **Warm Darkness:** Dark theme built on warm steel tones — never cold, never generic.
- **Controlled Energy:** Animations have rhythm — slow breathing moments, then sharp reveals.
- **Craft Over Flash:** Every detail is intentional. Nothing is decorative without purpose.
- **Personal Storytelling:** The UI itself tells your story. Sections are narrative beats, not just containers.

### Narrative Arc

Sections are numbered ("01", "02", etc.) and framed as narrative moments:

| # | Section   | Narrative Frame    | Mood                          |
|---|-----------|--------------------|-------------------------------|
| 01 | Hero     | "The Arrival"      | Bold, atmospheric, immersive  |
| 02 | About    | "The Origin"       | Warm, reflective, personal    |
| 03 | Projects | "The Work"         | Energetic, sharp, confident   |
| 04 | Skills   | "The Practice"     | Calm, organized, intentional  |
| 05 | Contact  | "The Next Step"    | Open, inviting, grounded      |

Section kickers use a consistent monospace format: `01 · The Arrival` — small, terracotta, uppercase, tracking-widest.

---

## Color Palette

### Dark Theme (Primary — "Warm Steel")

The page background is warm steel — a dark tone with brown undertones, never cold blue-black.

| Role              | Name              | Hex        | Usage                                |
|-------------------|-------------------|------------|--------------------------------------|
| Background        | Deep Steel        | `#1a1e24`  | Page background                      |
| Surface / Card    | Steel             | `#2a3240`  | Cards, elevated surfaces             |
| Surface Hover     | Steel Light       | `#343e4e`  | Hover states on surfaces             |
| Primary Text      | Paper             | `#f5f0e8`  | Headings, body text                  |
| Secondary Text    | Paper Muted       | `#a89f90`  | Captions, labels, metadata           |
| Accent            | Terracotta        | `#c8602a`  | CTAs, highlights, links, kickers     |
| Accent Light      | Terracotta Light  | `#e8895a`  | Hover on accent elements             |
| Accent Pale       | Terracotta Wash   | `#3d2a1f`  | Subtle accent backgrounds            |
| Border            | Steel Border      | `#3a4555`  | Dividers, card borders               |

**Shader gradient:** Background noise field oscillates between Deep Steel (`#1a1e24`) and a warm brown (`#231e19`) — perceptually warm, barely detectable.

### Light Theme (Project case study pages & zen mode)

| Role           | Hex        |
|----------------|------------|
| Background     | `#f5f0e8`  (Paper)   |
| Surface        | `#ede8dc`  (Paper Surface) |
| Primary Text   | `#0f0f0f`  (Near Black) |
| Secondary Text | `#7a7060`  (Paper Muted) |
| Accent         | `#c8602a`  (Terracotta — same across themes) |
| Border         | `#d9d0c0`  (Paper Border) |

---

## Typography

### Font Stack

| Role      | Font           | Source    | Fallback               |
|-----------|----------------|-----------|------------------------|
| Headlines | Clash Display  | Fontshare CDN | `system-ui, sans-serif` |
| Body      | Satoshi        | Fontshare CDN | `system-ui, sans-serif` |
| Code/Mono | JetBrains Mono | Google CDN    | `monospace`            |

**Loading method:** `@import url(...)` in `globals.css` (not `next/font/google` — Turbopack build limitation). CDN imports must appear before `@import "tailwindcss"`.

### Type Scale

| Element        | Size                         | Weight | Letter Spacing |
|----------------|------------------------------|--------|----------------|
| Hero Title     | `clamp(3rem, 10vw, 8rem)`    | 700    | `-0.03em`      |
| Section Title  | `clamp(2rem, 6vw, 4.5rem)`   | 600    | `-0.02em`      |
| Project Title  | `clamp(1.5rem, 4vw, 3rem)`   | 600    | `-0.02em`      |
| Body           | `1.125rem` (18px)            | 400    | `0`            |
| Caption/Label  | `0.875rem` (14px)            | 400    | `0.02em`       |
| Code           | `0.9rem`                     | 400    | `0`            |
| Kicker         | `0.75rem`                    | 400    | `0.15em`       |

**Kicker pattern:** `<span class="font-mono text-xs tracking-widest text-primary uppercase">01 · Section Name</span>`

### Hero Title Treatment

The hero title uses a split 2-line layout on desktop:
- Line 1: "Alaa Elghamry's" — Paper color
- Line 2: "Portfolio" — **Terracotta** (`#c8602a`) — the signature accent word

On mobile: single-line, scaled down.

---

## Layout & Spacing

- **Max content width:** `1280px` (80rem)
- **Section padding:** `clamp(4rem, 10vh, 8rem)` vertical
- **Grid:** 12-column CSS Grid, `1.5rem` gap
- **Border radius:** `0.5rem` default (shadcn `--radius`)

### Hero Section Layout

The hero uses a **split asymmetric layout** (not centered full-width):

| Column | Width (desktop) | Content |
|--------|-----------------|---------|
| Left   | ~56% (`lg:w-[56%]`) | Typography + CTAs |
| Right  | ~44% (`lg:w-[44%]`) | Spline 3D interactive scene |

On mobile: full-width stacked, Spline at 50% opacity overlaid right.

Below the content: a `HeroDataBar` strip — tech stack (left), scroll indicator (center), "Available for work" status (right).

---

## Texture & Atmosphere

- **Grain texture:** 4% opacity SVG noise overlay on `.site-bg` — adds tactile depth.
- **Corner vignettes:** Radial gradient darkening at page edges — cinematic framing.
- **Shader background (Hero):** Domain-warped FBM noise field that breathes between Deep Steel and warm brown. Shifts cooler/darker on scroll.
- **Spotlight:** Mouse-tracked terracotta glow behind hero content (Framer Motion, `z-[5]`).

---

## Avatar System

5 pose variants of an illustrated character:

| Variant    | Usage                                         |
|------------|-----------------------------------------------|
| Default    | About section, navbar (small)                 |
| Coding     | 404 page, loading states                      |
| Meditating | Contact section, zen mode, footer             |
| Waving     | Form success state, first visit greeting      |
| Traveling  | /now page                                     |

SVG or transparent PNG in `/public/images/avatar/`. `<Avatar variant="..." />` component.

---

## Motion Identity

See [animation-system.md](./animation-system.md) for the full GSAP inventory.

**One easing curve across the entire site:**

```ts
export const SIGNATURE_EASE = "power3.out";
export const SIGNATURE_DURATION = 0.8;
export const STAGGER_DELAY = 0.06;
```

Hero entrance uses `power4.out` (sharper deceleration for high-drama moments).
3D geometry entrance uses `elastic.out(1, 0.5)` (single bounce, feels physical).

---

## Personality Layer

- **Section kickers** numbered sequentially in monospace terracotta.
- **Terracotta word** in hero title is a signature mark — one word per section highlighted.
- **"Available for work"** status in hero data bar — green pulse dot.
- **Console message:** Workshop metaphor, terracotta color, links to coding playlist.
- **Konami code:** Unlocks Zen Mode — light palette, 50% animation speed, toast notification.
- **7-click avatar** in footer: "The Real Me" overlay with personal details.
- **Travel coordinates** in section margins: monospace, muted, hover reveals location name.
