# Portfolio Website — Complete Implementation Plan

> **Concept:** "The Craftsman's Journal" — A bold, expressive developer portfolio that blends cinematic dark aesthetics with warm, editorial sensibility. Code as craft. Stillness meets controlled energy.

---

## Table of Contents

1. [Project Vision & Identity](#1-project-vision--identity)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Design System](#3-design-system)
4. [Project Architecture](#4-project-architecture)
5. [Section-by-Section Breakdown](#5-section-by-section-breakdown)
6. [Animation System (GSAP)](#6-animation-system-gsap)
7. [3D & Shader Layer](#7-3d--shader-layer)
8. [Personalization & Easter Eggs](#8-personalization--easter-eggs)
9. [State Management (Redux Toolkit)](#9-state-management-redux-toolkit)
10. [Performance Strategy](#10-performance-strategy)
11. [Responsive & Accessibility](#11-responsive--accessibility)
12. [SEO & Metadata](#12-seo--metadata)
13. [Build Phases & Timeline](#13-build-phases--timeline)
14. [Deployment & CI/CD](#14-deployment--cicd)

---

## 1. Project Vision & Identity

### Core Concept: "The Craftsman's Journal"

The portfolio reads like a beautifully typeset personal journal or design monograph — warm, intentional, deeply personal — but alive with motion, 3D, and interactivity. The rhythm mirrors a yoga flow: moments of stillness, then controlled bursts of energy.

### Design Pillars

- **Bold & Expressive:** Large typography, confident statements, unapologetic use of space.
- **Warm Darkness:** Dark theme built on warm steel tones — never cold, never generic.
- **Controlled Energy:** Animations have rhythm — slow breathing moments, then sharp reveals.
- **Craft Over Flash:** Every detail is intentional. Nothing is decorative without purpose.
- **Personal Storytelling:** The UI itself tells your story. Sections are narrative beats, not just containers.

### Narrative Arc (Scroll Journey)

The site is structured as a journey, not a list of sections:

| Section        | Narrative Frame         | Mood                        |
| -------------- | ----------------------- | --------------------------- |
| Hero           | "The Arrival"           | Bold, atmospheric, immersive |
| About          | "The Origin"            | Warm, reflective, personal   |
| Projects       | "The Work"              | Energetic, sharp, confident  |
| Skills         | "The Practice"          | Calm, organized, intentional |
| Contact        | "The Next Step"         | Open, inviting, grounded     |

---

## 2. Tech Stack & Dependencies

### Core Stack

| Tool               | Version   | Purpose                                      |
| ------------------ | --------- | -------------------------------------------- |
| Next.js            | 14+       | App Router, SSR, file-based routing           |
| TypeScript         | 5.x       | Type safety across the project                |
| Tailwind CSS       | 3.4+      | Utility-first styling with custom design tokens |
| shadcn/ui          | Latest    | Accessible component primitives               |
| GSAP               | 3.12+     | Scroll-driven & entrance animations           |
| Redux Toolkit      | 2.x       | Global state management                       |

### Animation & 3D

| Package                  | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `gsap`                   | Core animation engine                          |
| `@gsap/react`            | React integration hook (`useGSAP`)             |
| `gsap/ScrollTrigger`     | Scroll-linked animations & section pinning     |
| `gsap/SplitText`         | Text character/word/line splitting (Club plugin, or custom) |
| `@react-three/fiber`     | React renderer for Three.js                    |
| `@react-three/drei`      | Helper components (Environment, ContactShadows, etc.) |
| `three`                  | 3D rendering engine                            |

### UI & Utilities

| Package            | Purpose                                       |
| ------------------ | --------------------------------------------- |
| `@radix-ui/*`      | Accessible primitives (via shadcn)             |
| `react-hook-form`  | Form handling (contact section)                |
| `zod`              | Form validation schema                         |
| `lucide-react`     | Icon set                                       |
| `clsx` + `tailwind-merge` | Conditional class merging                |
| `lenis`            | Smooth scroll (optional, pairs well with GSAP) |

### Dev & Build

| Tool             | Purpose                        |
| ---------------- | ------------------------------ |
| ESLint           | Code quality                   |
| Prettier         | Code formatting                |
| Husky + lint-staged | Pre-commit hooks            |
| next-sitemap     | Auto sitemap generation        |

### Installation Command

```bash
# Core
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir

# Animation & 3D
npm install gsap @gsap/react @react-three/fiber @react-three/drei three

# State
npm install @reduxjs/toolkit react-redux

# UI
npx shadcn@latest init
npx shadcn@latest add button card badge dialog input textarea toast

# Forms
npm install react-hook-form @hookform/resolvers zod

# Utilities
npm install clsx tailwind-merge lucide-react

# Smooth scroll (optional)
npm install lenis
```

---

## 3. Design System

### Color Palette — Dark Theme (Warm Steel)

The palette is an intentional dark inversion of a warm editorial palette. Steel replaces paper, paper becomes text. The warmth is preserved — this is never a cold, generic dark mode.

#### Core Tokens

| Role              | Name             | Hex        | Usage                              |
| ----------------- | ---------------- | ---------- | ---------------------------------- |
| Background        | Deep Steel       | `#1a1e24`  | Page background                    |
| Surface / Card    | Steel            | `#2a3240`  | Cards, elevated surfaces           |
| Surface Hover     | Steel Light      | `#343e4e`  | Hover states on surfaces           |
| Primary Text      | Paper            | `#f5f0e8`  | Headings, body text                |
| Secondary Text    | Muted Light      | `#a89f90`  | Captions, labels, metadata         |
| Accent            | Terracotta       | `#c8602a`  | Links, highlights, CTA buttons     |
| Accent Light      | Terracotta Light | `#e8895a`  | Hover states on accent elements    |
| Accent Pale       | Terracotta Wash  | `#3d2a1f`  | Subtle accent backgrounds (dark)   |
| Border            | Steel Border     | `#3a4555`  | Dividers, card borders             |

#### Semantic Colors (Dark-Adapted)

| State   | Foreground  | Background  |
| ------- | ----------- | ----------- |
| Success | `#2d6a4f`   | `#1a2e24`   |
| Warning | `#b5850a`   | `#2e2a1a`   |
| Error   | `#9b2226`   | `#2e1a1a`   |
| Info    | `#1a4a7a`   | `#1a2230`   |

#### Light Palette (Reserved for project case study pages & zen mode easter egg)

| Role            | Hex        |
| --------------- | ---------- |
| Background      | `#f5f0e8`  |
| Surface         | `#ede8dc`  |
| Primary Text    | `#0f0f0f`  |
| Secondary Text  | `#7a7060`  |
| Accent          | `#c8602a`  |

#### CSS Custom Properties (globals.css)

```css
@layer base {
  :root {
    /* Light mode — used for case study pages & zen mode */
    --background: 39 33% 93%;
    --foreground: 0 0% 6%;
    --card: 39 25% 89%;
    --card-foreground: 0 0% 6%;
    --muted: 33 11% 42%;
    --muted-foreground: 33 11% 42%;
    --accent: 20 66% 47%;
    --accent-foreground: 39 33% 93%;
    --border: 33 15% 80%;
    --ring: 20 66% 47%;
  }

  .dark {
    /* Primary dark theme */
    --background: 215 17% 12%;
    --foreground: 39 33% 93%;
    --card: 213 22% 21%;
    --card-foreground: 39 33% 93%;
    --muted: 30 9% 62%;
    --muted-foreground: 30 9% 62%;
    --accent: 20 66% 47%;
    --accent-foreground: 39 33% 93%;
    --border: 213 18% 28%;
    --ring: 20 66% 47%;
  }
}
```

### Typography

#### Font Pairing

| Role      | Font            | Source    | Fallback              |
| --------- | --------------- | --------- | -------------------- |
| Headlines | Clash Display   | Fontshare | `system-ui, sans-serif` |
| Body      | Satoshi         | Fontshare | `system-ui, sans-serif` |
| Code/Mono | JetBrains Mono  | Google    | `monospace`            |

#### Type Scale

| Element         | Size (desktop)  | Weight  | Letter Spacing |
| --------------- | --------------- | ------- | -------------- |
| Hero Title      | `clamp(3rem, 10vw, 8rem)` | 700 | `-0.03em` |
| Section Title   | `clamp(2rem, 6vw, 4.5rem)` | 600 | `-0.02em` |
| Project Title   | `clamp(1.5rem, 4vw, 3rem)` | 600 | `-0.02em` |
| Body            | `1.125rem` (18px) | 400 | `0`        |
| Caption / Label | `0.875rem` (14px) | 400 | `0.02em`   |
| Code            | `0.9rem`          | 400 | `0`        |

#### Tailwind Font Config (tailwind.config.ts)

```typescript
fontFamily: {
  display: ['Clash Display', 'system-ui', 'sans-serif'],
  body: ['Satoshi', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
```

### Spacing & Layout

- **Max content width:** `1280px` (80rem)
- **Section padding:** `clamp(4rem, 10vh, 8rem)` vertical
- **Grid:** CSS Grid with 12-column layout, `1.5rem` gap
- **Border radius:** `0.5rem` default (shadcn `--radius`)

### Signature Easing Curve

One easing curve used consistently across the entire site for a cohesive motion identity:

```typescript
// lib/animations.ts
export const SIGNATURE_EASE = "power3.out";
export const SIGNATURE_EASE_IN = "power3.in";
export const SIGNATURE_DURATION = 0.8; // seconds — default for most transitions
export const STAGGER_DELAY = 0.06; // seconds — between staggered elements
```

---

## 4. Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, providers, theme
│   ├── page.tsx                    # Home: assembles all sections
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx            # Case study (light theme)
│   ├── now/
│   │   └── page.tsx                # /now page (living updates)
│   └── globals.css                 # CSS variables, base styles
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Sticky nav with section tracking
│   │   ├── Footer.tsx              # Footer with avatar easter egg
│   │   ├── CustomCursor.tsx        # GSAP quickTo cursor
│   │   ├── SmoothScroll.tsx        # Lenis wrapper
│   │   ├── ScrollProgress.tsx      # Terracotta progress bar
│   │   └── PageTransition.tsx      # GSAP route transitions
│   │
│   ├── hero/
│   │   ├── HeroSection.tsx         # Orchestrator component
│   │   ├── ShaderBackground.tsx    # WebGL noise/gradient canvas
│   │   ├── HeroModel.tsx           # R3F 3D breathing geometry
│   │   └── HeroText.tsx            # GSAP split text entrance
│   │
│   ├── about/
│   │   ├── AboutSection.tsx        # "The Origin" section
│   │   ├── ScrollRevealText.tsx    # Line-by-line text reveal
│   │   └── Avatar.tsx              # Illustrated character component
│   │
│   ├── projects/
│   │   ├── ProjectsSection.tsx     # Pinned horizontal scroll container
│   │   ├── ProjectCard.tsx         # Video preview + clip-path reveal
│   │   └── ProjectDetail.tsx       # Full case study layout (light theme)
│   │
│   ├── skills/
│   │   ├── SkillsSection.tsx       # "The Practice" section
│   │   └── SkillCard.tsx           # Interactive card with hover animation
│   │
│   ├── contact/
│   │   ├── ContactSection.tsx      # "The Next Step" section
│   │   └── ContactForm.tsx         # react-hook-form + zod + shadcn
│   │
│   ├── shared/
│   │   ├── SectionHeading.tsx      # Animated section titles
│   │   ├── MagneticButton.tsx      # Button that pulls toward cursor
│   │   └── TextReveal.tsx          # Reusable scroll text animation
│   │
│   └── ui/                         # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── dialog.tsx
│       └── toast.tsx
│
├── shaders/
│   ├── backgroundNoise.frag        # Fragment shader — hero background
│   ├── backgroundNoise.vert        # Vertex shader
│   └── breathingGeometry.glsl      # Mandala/geometry morph shader
│
├── hooks/
│   ├── useGSAPContext.ts           # GSAP context + cleanup
│   ├── useScrollTrigger.ts         # ScrollTrigger wrapper with refs
│   ├── useMousePosition.ts         # Cursor position for parallax
│   ├── usePrefersReducedMotion.ts  # Accessibility: disable animations
│   └── useMediaQuery.ts            # Responsive hook
│
├── store/
│   ├── store.ts                    # RTK store configuration
│   ├── provider.tsx                # Redux Provider wrapper
│   └── slices/
│       ├── themeSlice.ts           # Dark/light/zen mode toggle
│       ├── navigationSlice.ts      # Active section, scroll progress
│       ├── projectsSlice.ts        # Project data, filters, active project
│       └── uiSlice.ts             # Cursor state, loading, easter egg flags
│
├── data/
│   ├── projects.ts                 # Project entries (typed)
│   ├── skills.ts                   # Skills data (typed)
│   └── personal.ts                 # Bio, social links, travel coords
│
├── lib/
│   ├── animations.ts               # Shared GSAP timelines & easing
│   ├── constants.ts                # Breakpoints, durations, config
│   ├── utils.ts                    # clsx + tailwind-merge helper
│   └── registry.ts                 # shadcn component registry
│
├── types/
│   ├── project.ts                  # Project type definition
│   ├── skill.ts                    # Skill type definition
│   └── animation.ts                # Animation config types
│
└── public/
    ├── models/
    │   └── mandala.glb             # 3D model (<2MB)
    ├── fonts/
    │   ├── ClashDisplay-*.woff2
    │   └── Satoshi-*.woff2
    ├── images/
    │   ├── avatar/                 # Illustrated avatar variants
    │   ├── projects/               # Project screenshots/videos
    │   └── og-image.png            # Open Graph image
    └── videos/
        └── projects/               # Short project preview loops
```

### Key Architecture Decisions

1. **App Router (not Pages Router):** Leverages React Server Components for static content, client components only where interactivity is needed (animations, 3D).
2. **`"use client"` boundary:** The hero, animation wrappers, and 3D components are client-side. Section content (text, images) is server-rendered.
3. **GSAP registered once:** Register ScrollTrigger and other plugins in a single `GSAPProvider` component at the layout level.
4. **3D lazy-loaded:** The R3F canvas is wrapped in `next/dynamic` with `ssr: false` and React `Suspense` to avoid blocking initial paint.

---

## 5. Section-by-Section Breakdown

### 5.1 Navbar

**Layout:** Fixed top, full-width, transparent background with a subtle backdrop-blur that activates on scroll. Logo/name on the left, nav links on the right.

**Behavior:**
- Links track active section via `IntersectionObserver` (stored in Redux `navigationSlice`).
- Active link highlighted with terracotta underline that slides between items (GSAP `quickTo`).
- On scroll past hero, background transitions from transparent to `rgba(26, 30, 36, 0.8)` with blur.
- Mobile: hamburger menu with a full-screen overlay. Menu items stagger in with GSAP.

**shadcn components:** None needed — custom build for full animation control.

### 5.2 Hero Section — "The Arrival"

**Layout:** Full viewport height (`100svh`). Three layers stacked via absolute positioning:

| Layer | Content | z-index |
|-------|---------|---------|
| Background | WebGL shader canvas (noise gradient) | 0 |
| Middle | 3D breathing geometry (R3F) | 1 |
| Foreground | Typography + CTA | 2 |

**Content:**
- Your name: massive, `10vw`, Clash Display, weight 700, Paper color (`#f5f0e8`).
- Subtitle: your title/tagline in Satoshi, Muted Light, smaller scale.
- One word in the name or subtitle highlighted in Terracotta — this is your signature mark.
- A subtle scroll indicator at the bottom (animated down-arrow or "scroll" text that fades on scroll).

**Animations (GSAP Timeline):**
1. `0.0s` — Shader background fades in (opacity 0 → 1).
2. `0.3s` — 3D model scales from 0 → 1 with `elastic.out` easing.
3. `0.5s` — Name characters split in, staggered left-to-right, `power4.out`, `y: 60 → 0`, `opacity: 0 → 1`.
4. `0.8s` — Subtitle fades up.
5. `1.2s` — Scroll indicator fades in.
6. **On scroll (ScrollTrigger):** 3D model rotates and scales down, text parallaxes up at a faster rate (creating depth), shader shifts color temperature.

**3D Model:**
- A breathing geometric mandala — slowly expands and contracts on a sine wave.
- Responds to mouse position (subtle tilt via `useMousePosition` hook).
- Wireframe or low-poly with terracotta emissive edges on Deep Steel base.
- Uses `ContactShadows` (warm tone) and `Environment` preset "sunset" or "dawn".
- Wrapped in `Suspense` with a minimal loading state (pulsing terracotta dot).

**Shader Background:**
- Simplex noise-based color field that shifts slowly between Deep Steel and a warmer dark tone.
- Subtle grain texture overlay (CSS `background-image` with a tiny noise PNG at low opacity).
- Responds to scroll position: color temperature shifts cooler as you scroll past the hero.

### 5.3 About Section — "The Origin"

**Layout:** Two-column on desktop (illustration left, text right). Single column on mobile (illustration above text).

**Content:**
- Left: Your illustrated avatar — hand-drawn/ink style, warm tones. Animated subtly (floating, breathing).
- Right: Your story told in 3-4 paragraphs. Not a resume — a narrative. What drives you, your philosophy as a developer, the intersection of code and craft and mindfulness.
- Key words in the text highlighted in Terracotta as they animate in.
- Below the bio: a row of social/external links styled as minimal icon buttons.

**Animations:**
- Avatar floats into view from the left with a soft `power3.out` translation.
- Text reveals line-by-line on scroll using `ScrollTrigger.batch()`. Each line: `y: 30 → 0`, `opacity: 0 → 1`, staggered by `0.06s`.
- Highlighted words get their terracotta color *after* the line reveals, with a subtle `scale: 1 → 1.02 → 1` pulse.

### 5.4 Projects Section — "The Work"

**Layout:** Horizontal scroll section, pinned with GSAP `ScrollTrigger.pin`. Full viewport height. Projects scroll horizontally while the user scrolls vertically.

**Content per Project Card:**
- Video preview (autoplay, muted, looping, 6-8 seconds) or high-quality screenshot.
- Project title (large, Clash Display).
- One-line story: *why* you built it, not just what it is.
- Tech stack as shadcn `Badge` components.
- "View Case Study" link → navigates to `/projects/[slug]`.

**Animations:**
- Section pins at the top of the viewport. Vertical scroll maps to horizontal card movement.
- Each card enters with a `clipPath` reveal: `inset(100% 0 0 0)` → `inset(0% 0 0 0)`.
- Video/image parallaxes slightly inside the card container (moves slower than the card).
- Badges stagger in after the card reveal, `y: 10 → 0`, quick.
- On the final card, the pin releases and the section continues to the next.

**ScrollTrigger Config:**

```typescript
ScrollTrigger.create({
  trigger: projectsSectionRef.current,
  start: "top top",
  end: () => `+=${totalScrollWidth}`,
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    // Map scroll progress to horizontal position
    gsap.set(projectsTrackRef.current, {
      x: -self.progress * totalScrollWidth,
    });
  },
});
```

### 5.5 Project Case Study Pages — `/projects/[slug]`

**Theme:** Switches to the LIGHT palette (Paper background, Ink text). This deliberate theme shift signals "deep reading mode" and creates a memorable contrast.

**Layout:** Long-form editorial layout. Max-width `720px` for text content, full-bleed for images/videos.

**Content:**
- Hero image/video (full-bleed).
- Project metadata: role, timeline, tech stack, links.
- Written narrative: the problem, the approach, key decisions, results.
- Inline images/videos demonstrating the work.
- "Next Project" navigation at the bottom.

**Transition Animation:** When clicking "View Case Study," a GSAP timeline plays: card scales up to fill the viewport, background color morphs from Dark Steel to Paper, then the new page content fades in. Reverse on back navigation.

### 5.6 Skills Section — "The Practice"

**Layout:** Grid of skill cards, grouped by category. Categories could include "Languages," "Frameworks," "Tools," "Currently Learning."

**Content per Card:**
- Skill icon (from lucide-react or custom SVG).
- Skill name.
- Category badge using semantic colors (Green for strong, Blue for tools, Amber for learning).
- No progress bars — they're meaningless and overused.

**Animations:**
- Cards stagger in on scroll, `y: 40 → 0`, `opacity: 0 → 1`, staggered with a grid pattern (not linear).
- On hover: card lifts (`y: -4px`), subtle shadow appears, border shifts to Terracotta.
- Optional: mouse-reactive tilt (card tilts toward cursor) using `useMousePosition`.

### 5.7 Contact Section — "The Next Step"

**Layout:** Split layout. Left: invitation text + avatar (meditating pose variant). Right: contact form.

**Content:**
- Heading: something personal, not "Get In Touch." Frame it as an invitation.
- Subtext: a warm, brief line about what you're open to (freelance, collaboration, conversation).
- Form fields: Name, Email, Message (shadcn `Input` + `Textarea`).
- Submit button: full Terracotta, Paper text. Magnetic hover effect.
- Below form: social links row.

**Form Handling:**
- `react-hook-form` with `zod` schema for validation.
- Submissions via a serverless function (Next.js API route or a service like Resend/FormSpree).
- Success state: form fades out, a "thank you" message with your avatar waving fades in.

**Animations:**
- Section fades in on scroll.
- Form fields slide up staggered.
- Submit button has a magnetic pull toward the cursor (GSAP `quickTo`).
- On submit success: confetti-like particle burst using terracotta-colored particles (GSAP or canvas).

### 5.8 Footer

**Layout:** Simple, minimal. Your name, copyright, and social icons. The illustrated avatar sits in the corner in a relaxed/meditating pose.

**Easter egg:** Clicking the avatar 7 times triggers the "About the Real Me" overlay.

---

## 6. Animation System (GSAP)

### Global Setup

Register GSAP plugins once at the app level:

```typescript
// components/layout/GSAPProvider.tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Set global defaults
gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger after hydration
    ScrollTrigger.refresh();
    return () => ScrollTrigger.killAll();
  }, []);

  return <>{children}</>;
}
```

### Custom Hooks

#### `useGSAPContext`

Scopes all GSAP animations to a ref and handles cleanup:

```typescript
import { useRef, useEffect } from "react";
import gsap from "gsap";

export function useGSAPContext(callback: (ctx: gsap.Context) => void, deps: any[] = []) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      callback(ctx);
    }, ref);

    return () => ctx.revert();
  }, deps);

  return ref;
}
```

#### `usePrefersReducedMotion`

Respects user accessibility preferences:

```typescript
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
```

### Animation Inventory

| Animation              | Trigger        | GSAP Method         | Duration | Easing           |
| ---------------------- | -------------- | ------------------- | -------- | ---------------- |
| Hero text entrance     | Page load      | `timeline`          | 1.5s     | `power4.out`     |
| Hero 3D model entrance | Page load      | `from` + `elastic`  | 1.2s     | `elastic.out(1, 0.5)` |
| Section heading reveal | Scroll into view | `ScrollTrigger`   | 0.8s     | `power3.out`     |
| Text line-by-line      | Scroll into view | `ScrollTrigger.batch` | 0.6s | `power3.out`     |
| Project card clip-path | Scroll (pinned) | `scrub: 1`         | Scrubbed | Linear           |
| Skill cards stagger    | Scroll into view | `ScrollTrigger.batch` | 0.5s | `power3.out`     |
| Hover card lift        | Mouse enter    | `to`                | 0.3s     | `power2.out`     |
| Magnetic button        | Mouse move     | `quickTo`           | 0.5s     | `power3.out`     |
| Custom cursor          | Mouse move     | `quickTo`           | 0.3s     | `power3.out`     |
| Page transition        | Route change   | `timeline`          | 0.6s     | `power3.inOut`   |
| Navbar bg appear       | Scroll past hero | `ScrollTrigger`  | 0.3s     | `power2.out`     |

### Custom Text Splitter (if not using GSAP SplitText plugin)

```typescript
// lib/splitText.ts
export function splitTextIntoSpans(element: HTMLElement, type: "chars" | "words" | "lines") {
  const text = element.textContent || "";

  if (type === "chars") {
    element.innerHTML = text
      .split("")
      .map((char) => `<span class="char" style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`)
      .join("");
  }

  if (type === "words") {
    element.innerHTML = text
      .split(" ")
      .map((word) => `<span class="word" style="display:inline-block">${word}&nbsp;</span>`)
      .join("");
  }

  return element.querySelectorAll(`.${type.slice(0, -1)}`);
}
```

---

## 7. 3D & Shader Layer

### 3D Model: Breathing Geometry

**Concept:** A geometric mandala / sacred geometry form that slowly breathes (expands and contracts) and responds to cursor movement. It sits in the hero section as a visual anchor.

**Technical Approach:**

```typescript
// components/hero/HeroModel.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function HeroModel() {
  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} // Cap pixel ratio for performance
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={10}
            blur={2}
            color="#c8602a"
          />
          <Environment preset="dawn" />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

**Geometry Options (pick one):**

1. **Icosahedron wireframe** that morphs vertices on a sine wave — simplest, very performant.
2. **Custom GLTF mandala** modeled in Blender — most personal, requires modeling work.
3. **Particle cloud** that forms shapes — most technically impressive, higher GPU cost.

**Recommendation:** Start with option 1 (icosahedron wireframe with vertex displacement). It's fast to implement, performant, and looks stunning with terracotta emissive edges on the dark background. Upgrade to option 2 or 3 later if desired.

### Shader Background

**Concept:** A slow-moving noise field behind everything in the hero. Not flashy — atmospheric.

**Fragment Shader (simplified):**

```glsl
// shaders/backgroundNoise.frag
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColorA; // Deep Steel
uniform vec3 uColorB; // Warmer dark tone
uniform float uScrollProgress;

// Simplex noise function (include your preferred implementation)

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float noise = snoise(vec3(uv * 2.0, uTime * 0.1));

  // Mix between two dark warm tones based on noise + scroll
  vec3 color = mix(uColorA, uColorB, noise * 0.5 + 0.5);

  // Shift cooler as user scrolls past hero
  color = mix(color, uColorA, uScrollProgress * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
```

**Integration:** Render via a full-screen `<canvas>` element with `position: absolute` behind the hero content. Use `requestAnimationFrame` for the time uniform, and pipe `ScrollTrigger` progress into the scroll uniform.

### Performance Rules for 3D/Shaders

- Cap `dpr` at `1.5` on the R3F canvas (retina rendering is expensive).
- Use `drei`'s `useDetectGPU` to disable 3D on low-end devices — show a static SVG fallback.
- Keep GLTF models under 2MB. Use Draco compression.
- Shader runs only while visible (pause `requestAnimationFrame` when off-screen).
- On mobile: simplify or disable the shader, reduce particle counts by 50%.

---

## 8. Personalization & Easter Eggs

### 8.1 Illustrated Avatar System

Create or commission an avatar in 4-5 pose variants:

| Variant     | Usage                                      |
| ----------- | ------------------------------------------ |
| Default     | About section, navbar (small)              |
| Coding      | 404 page, loading states                   |
| Meditating  | Contact section, zen mode, footer          |
| Waving      | Form success state, first visit greeting   |
| Traveling   | /now page                                  |

**Implementation:** SVG or PNG with transparent background. Each variant is a separate file in `/public/images/avatar/`. A shared `<Avatar>` component accepts a `variant` prop.

### 8.2 Easter Eggs

#### Konami Code → Zen Mode

**Trigger:** `↑ ↑ ↓ ↓ ← → ← → B A`

**Effect:** The entire site transitions to the light (Paper) palette. Animations slow to 50% speed. The 3D geometry morphs into a lotus or simplified mandala. A toast appears: "You found the quiet." The navbar gains a "Return" button to exit zen mode.

**Implementation:**

```typescript
// hooks/useKonamiCode.ts
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export function useKonamiCode(callback: () => void) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[index]) {
        const next = index + 1;
        if (next === KONAMI.length) {
          callback();
          setIndex(0);
        } else {
          setIndex(next);
        }
      } else {
        setIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, callback]);
}
```

**State:** Zen mode flag lives in Redux `uiSlice`. The theme switch is handled by toggling `dark` class off the `<html>` element and dispatching a state change that all animated components listen to for speed reduction.

#### 7-Click Avatar → "The Real Me" Overlay

**Trigger:** Click the footer avatar 7 times (like Android developer mode).

**Effect:** A full-screen overlay slides up with personal details — favorite book, last travel destination, what you're currently learning, a coding playlist link.

**Implementation:** Click counter in local component state. On 7th click, dispatch to Redux `uiSlice.easterEggUnlocked`, show the overlay with a GSAP `fromTo` animation.

#### Console Message

**Implementation:** In `layout.tsx`:

```typescript
useEffect(() => {
  console.log(
    "%cYou opened the workshop. The tools are all here.\n— [Your Name]",
    "color: #c8602a; font-size: 14px; font-family: monospace;"
  );
  console.log(
    "%cHere's a playlist I code to: https://open.spotify.com/playlist/...",
    "color: #a89f90; font-size: 12px; font-family: monospace;"
  );
}, []);
```

#### Travel Coordinates

**Implementation:** Tiny monospace text in Muted color, positioned in section margins or footer. Data sourced from `data/personal.ts`:

```typescript
export const travelCoordinates = [
  { lat: "27.1751", lng: "78.0421", name: "Agra, India" },
  { lat: "48.8566", lng: "2.3522", name: "Paris, France" },
  // ...
];
```

Hovering reveals the location name with a GSAP `fromTo` tooltip.

#### Ink Brush Cursor Trail (Secret Page)

**Trigger:** Accessible via a hidden link or after discovering zen mode.

**Effect:** The cursor leaves fading ink-brush strokes as it moves. Implemented with a canvas overlay that draws bezier curves from cursor position history, with opacity fading over time.

### 8.3 The /now Page

A living page you update periodically. Content:

- Currently building: [project name]
- Currently reading: [book]
- Currently in: [city]
- Currently learning: [skill]
- Last yoga practice: [type + date]

Styled on the light palette (Paper background), minimal, personal. Updated manually by editing `data/personal.ts` or via a simple CMS/markdown file.

---

## 9. State Management (Redux Toolkit)

### Store Configuration

```typescript
// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import navigationReducer from "./slices/navigationSlice";
import projectsReducer from "./slices/projectsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
    projects: projectsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice Breakdown

#### `themeSlice`

```typescript
interface ThemeState {
  mode: "dark" | "light" | "zen";
  animationSpeed: number; // 1 = normal, 0.5 = zen mode
}
```

- `setTheme(mode)` — switch between dark/light/zen
- `toggleZenMode()` — triggered by Konami code
- Persisted in localStorage for return visits

#### `navigationSlice`

```typescript
interface NavigationState {
  activeSection: string; // "hero" | "about" | "projects" | "skills" | "contact"
  scrollProgress: number; // 0 → 1 overall page progress
  isMenuOpen: boolean;
}
```

- `setActiveSection(id)` — updated by IntersectionObserver
- `setScrollProgress(value)` — updated by ScrollTrigger
- `toggleMenu()` — mobile menu

#### `projectsSlice`

```typescript
interface ProjectsState {
  items: Project[];
  activeFilter: string | null;
  activeProject: string | null; // slug of project being viewed
}
```

- `setFilter(tag)` — filter by technology/category
- `setActiveProject(slug)` — for transition animations
- Project data loaded from `data/projects.ts` (static, no API needed)

#### `uiSlice`

```typescript
interface UIState {
  isLoading: boolean;
  cursorVariant: "default" | "hover" | "click" | "text";
  zenModeUnlocked: boolean;
  easterEggUnlocked: boolean; // 7-click avatar
  hasVisited: boolean; // Skip intro animation on return visits
}
```

### When Redux vs Local State

| Use Redux                         | Use Local State                     |
| --------------------------------- | ----------------------------------- |
| Active section (navbar needs it)  | Hover states                        |
| Theme mode (affects entire app)   | Form input values                   |
| Cursor variant (shared across components) | Animation-in-progress flags  |
| Easter egg flags (persist)        | Scroll position within a component  |
| Project filter (multiple consumers) | Open/closed state of a single dialog |

---

## 10. Performance Strategy

### Core Web Vitals Targets

| Metric | Target  | Strategy                                     |
| ------ | ------- | -------------------------------------------- |
| LCP    | < 2.5s  | Preload hero fonts, optimize 3D load         |
| FID    | < 100ms | Defer non-critical JS, minimal main-thread work |
| CLS    | < 0.1   | Set explicit dimensions for all media        |
| INP    | < 200ms | Debounce scroll handlers                     |

### Loading Strategy

1. **Fonts:** Self-hosted `.woff2` files with `font-display: swap` and `preload` link tags for the primary weights.
2. **3D Model:** Loaded via `next/dynamic` with `ssr: false`. `Suspense` fallback shows a terracotta pulsing dot. The GLTF file is preloaded with `<link rel="preload">` after the initial paint.
3. **Images/Videos:** All project media uses `next/image` with `loading="lazy"` (except hero, which is `priority`). Videos use `<video preload="metadata">` and only autoplay when visible (IntersectionObserver).
4. **Shader:** The WebGL canvas initializes on `requestIdleCallback` or after a short delay to avoid competing with LCP.

### Code Splitting

```typescript
// Lazy load heavy components
const HeroModel = dynamic(() => import("@/components/hero/HeroModel"), {
  ssr: false,
  loading: () => <div className="hero-3d-placeholder" />,
});

const ProjectsSection = dynamic(() => import("@/components/projects/ProjectsSection"));
const ContactForm = dynamic(() => import("@/components/contact/ContactForm"));
```

### Animation Performance Rules

- All GSAP animations use `transform` and `opacity` only (GPU-composited properties).
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Use `will-change: transform` sparingly, only on elements about to animate.
- ScrollTrigger callbacks are throttled — use `scrub` (not `onScroll` with raw values).
- On mobile: reduce particle count, disable shader, simplify animations.
- Respect `prefers-reduced-motion`: disable all motion, show content statically.

### Bundle Size Budget

| Category      | Budget     |
| ------------- | ---------- |
| First Load JS | < 150 KB   |
| Total JS      | < 400 KB   |
| 3D (Three.js) | < 150 KB (tree-shaken via R3F) |
| GSAP          | < 30 KB    |
| Fonts         | < 100 KB (2 weights × 2 families) |

---

## 11. Responsive & Accessibility

### Breakpoints

| Name    | Width    | Key Changes                          |
| ------- | -------- | ------------------------------------ |
| `sm`    | 640px    | Single column, reduced hero text     |
| `md`    | 768px    | Two-column about, simplified grid    |
| `lg`    | 1024px   | Full layout, horizontal scroll       |
| `xl`    | 1280px   | Max content width reached            |

### Mobile-Specific Adjustments

- **Hero:** 3D model scales down or replaces with a static SVG. Text drops to `clamp(2rem, 8vw, 4rem)`.
- **Projects:** Horizontal scroll converts to a vertical card stack (horizontal scroll is unreliable on mobile).
- **Custom cursor:** Disabled entirely on touch devices.
- **Shader:** Disabled or replaced with a CSS gradient on devices with no GPU (`useDetectGPU`).
- **Animations:** Reduced — simpler easing, fewer staggered elements, shorter durations.

### Accessibility Checklist

- [ ] All interactive elements keyboard-navigable.
- [ ] Focus indicators visible (terracotta ring, `2px` offset).
- [ ] Color contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text (verified against dark palette).
- [ ] All images have meaningful `alt` text.
- [ ] The 3D canvas has `aria-hidden="true"` (decorative).
- [ ] `prefers-reduced-motion` fully honored — no motion, all content visible.
- [ ] Form fields have proper `label` associations and error messages.
- [ ] Skip-to-content link present.
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy.
- [ ] Animated text is still in the DOM as real text (not just visual — screen readers can read it).

---

## 12. SEO & Metadata

### Next.js Metadata API

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "[Your Name] — Frontend Developer & Design Engineer",
    template: "%s | [Your Name]",
  },
  description: "Portfolio of [Your Name], a frontend developer crafting bold, expressive digital experiences with React, Next.js, and motion design.",
  keywords: ["frontend developer", "design engineer", "React", "Next.js", "GSAP", "portfolio"],
  authors: [{ name: "[Your Name]" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yoursite.com",
    siteName: "[Your Name]",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Additional SEO

- `next-sitemap` for automatic `sitemap.xml` and `robots.txt` generation.
- Structured data (JSON-LD) for Person schema on the home page.
- Each project case study page has unique metadata, og:image, and description.
- Canonical URLs set for all pages.

---

## 13. Build Phases & Timeline

### Phase 1 — Foundation (Days 1–3)

**Goal:** Project skeleton, design system, and global infrastructure.

| Task                                     | Day | Est. Hours |
| ---------------------------------------- | --- | ---------- |
| Next.js project init + TypeScript config | 1   | 1          |
| Tailwind config with custom design tokens | 1   | 2          |
| shadcn/ui init + install base components | 1   | 1          |
| Font loading (Clash Display, Satoshi)    | 1   | 1          |
| CSS custom properties (dark + light)     | 1   | 1          |
| Redux Toolkit store + all slices         | 2   | 3          |
| Global layout (Navbar placeholder, Footer placeholder) | 2 | 2 |
| GSAP provider + custom hooks             | 2   | 2          |
| Smooth scroll setup (Lenis)             | 2   | 1          |
| Responsive utility hook                  | 3   | 1          |
| Folder structure + type definitions      | 3   | 1          |
| Git init + ESLint/Prettier config        | 3   | 1          |

**Deliverable:** A running Next.js app with the design system applied, dark theme active, smooth scroll working, and Redux connected. No content yet — just the skeleton.

---

### Phase 2 — Hero Section (Days 4–8)

**Goal:** The most important and complex section, fully functional.

| Task                                     | Day | Est. Hours |
| ---------------------------------------- | --- | ---------- |
| Hero layout (3-layer stack)              | 4   | 2          |
| WebGL shader background (noise gradient) | 4-5 | 4          |
| R3F canvas setup + 3D geometry           | 5-6 | 4          |
| Geometry breathing animation (sine wave) | 6   | 2          |
| Mouse-reactive tilt on 3D model          | 6   | 2          |
| Hero text split animation (GSAP)         | 7   | 3          |
| Hero entrance timeline (orchestration)   | 7   | 2          |
| ScrollTrigger: parallax + model transform on scroll | 8 | 3 |
| Mobile fallback for 3D (static SVG)      | 8   | 2          |
| Performance testing + optimization       | 8   | 2          |

**Deliverable:** A fully animated, responsive hero section with 3D model, shader background, and scroll-linked behavior. Performance validated on desktop and mobile.

---

### Phase 3 — Content Sections (Days 9–15)

**Goal:** All remaining sections built with full animations.

| Task                                     | Day  | Est. Hours |
| ---------------------------------------- | ---- | ---------- |
| About section layout                     | 9    | 2          |
| ScrollRevealText component               | 9    | 3          |
| Avatar component (all variants)          | 10   | 2          |
| About animations (line reveal, avatar float) | 10 | 2        |
| Projects section: horizontal scroll + pin | 11  | 4          |
| ProjectCard: clip-path reveal + video    | 12   | 3          |
| Project data structure + content         | 12   | 2          |
| Project case study page (light theme)    | 13   | 4          |
| Skills section layout + grid             | 14   | 2          |
| Skills hover animations + categories     | 14   | 2          |
| Contact section layout                   | 15   | 2          |
| Contact form (react-hook-form + zod)     | 15   | 2          |
| Contact animations + success state       | 15   | 2          |

**Deliverable:** All sections fully built, animated, and populated with real content.

---

### Phase 4 — Navigation & Transitions (Days 16–17)

**Goal:** Polished navigation experience and page transitions.

| Task                                     | Day | Est. Hours |
| ---------------------------------------- | --- | ---------- |
| Navbar: scroll-aware background          | 16  | 2          |
| Navbar: active section indicator         | 16  | 2          |
| Navbar: mobile menu + stagger animation  | 16  | 2          |
| Page transition (dark → light for case studies) | 17 | 3     |
| Scroll progress indicator (terracotta bar) | 17 | 1         |
| Footer finalization                      | 17  | 1          |

**Deliverable:** Complete navigation flow with animated transitions between pages.

---

### Phase 5 — Personality & Easter Eggs (Days 18–19)

**Goal:** The details that make the site *yours*.

| Task                                     | Day | Est. Hours |
| ---------------------------------------- | --- | ---------- |
| Custom cursor (dot + trailing circle)    | 18  | 3          |
| Konami code hook + zen mode theme switch | 18  | 2          |
| Zen mode: animation speed reduction      | 18  | 1          |
| 7-click avatar easter egg + overlay      | 19  | 2          |
| Console message                          | 19  | 0.5        |
| Travel coordinates (data + hover tooltip)| 19  | 1.5        |
| /now page                                | 19  | 2          |

**Deliverable:** All personalization features functional.

---

### Phase 6 — Polish & Launch (Days 20–22)

**Goal:** Production-ready, optimized, deployed.

| Task                                     | Day | Est. Hours |
| ---------------------------------------- | --- | ---------- |
| Responsive audit (all breakpoints)       | 20  | 3          |
| Accessibility audit (keyboard, screen reader, contrast) | 20 | 3 |
| `prefers-reduced-motion` implementation  | 20  | 1          |
| Lighthouse audit + performance fixes     | 21  | 3          |
| SEO metadata + sitemap + structured data | 21  | 2          |
| og:image creation                        | 21  | 1          |
| Loading screen / initial state           | 21  | 2          |
| Cross-browser testing (Chrome, Firefox, Safari) | 22 | 2    |
| Vercel deployment + domain config        | 22  | 1          |
| Final QA pass                            | 22  | 2          |

**Deliverable:** Portfolio live in production.

---

### Total Estimated Timeline

| Phase                        | Days   | Total Hours |
| ---------------------------- | ------ | ----------- |
| Phase 1 — Foundation         | 1–3    | ~17h        |
| Phase 2 — Hero               | 4–8    | ~26h        |
| Phase 3 — Content Sections   | 9–15   | ~32h        |
| Phase 4 — Navigation         | 16–17  | ~11h        |
| Phase 5 — Easter Eggs        | 18–19  | ~12h        |
| Phase 6 — Polish & Launch    | 20–22  | ~20h        |
| **Total**                    | **22 days** | **~118h** |

*Assuming ~5-6 focused hours per day. Adjust based on your availability.*

---

## 14. Deployment & CI/CD

### Hosting: Vercel (Recommended)

- Native Next.js support with zero configuration.
- Automatic preview deployments on every PR.
- Edge functions for API routes (contact form).
- Built-in analytics and Web Vitals monitoring.

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://yoursite.com
RESEND_API_KEY=re_xxxxx          # For contact form emails
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # Analytics (optional)
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml (if using GitHub Actions)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

### Pre-Launch Checklist

- [ ] All animations smooth at 60fps on target devices
- [ ] Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] All links work, no 404s
- [ ] Contact form sends emails successfully
- [ ] og:image renders correctly on Twitter/LinkedIn/Slack
- [ ] Favicon + apple-touch-icon set
- [ ] 404 page custom designed (with coding avatar)
- [ ] Analytics connected
- [ ] Domain configured with HTTPS
- [ ] Easter eggs all functional
- [ ] Tested on: Chrome, Firefox, Safari, iOS Safari, Android Chrome

---

> **Remember:** This portfolio is not a template. It's a craftsman's journal. Every animation, every color choice, every hidden detail should feel like it was placed there by a human who cares about the work. Ship it when it feels like *you*.
