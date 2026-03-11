# Architecture & Tech Stack

---

## Actual Tech Stack (as installed)

### Core

| Tool           | Version   | Purpose                                      |
|----------------|-----------|----------------------------------------------|
| Next.js        | 16.1.6    | App Router, SSR, file-based routing, Turbopack |
| TypeScript     | 5.x       | Type safety                                  |
| Tailwind CSS   | v4        | CSS-first config — use `@theme {}` in globals.css, **no tailwind.config.ts** |
| shadcn/ui      | v4        | Accessible component primitives (Nova preset) |
| React          | 19.2.3    | Concurrent rendering                         |

### Animation & 3D

| Package                   | Version   | Purpose                                      |
|---------------------------|-----------|----------------------------------------------|
| `gsap`                    | 3.14.2    | Core animation engine                        |
| `@gsap/react`             | 2.1.2     | `useGSAP` hook (registers scope + cleanup)   |
| `gsap/ScrollTrigger`      | (bundled)  | Scroll-driven animations + section pinning   |
| `lenis`                   | 1.3.18    | Smooth scroll, wired to GSAP ticker          |
| `@react-three/fiber`      | 9.5.0     | React renderer for Three.js                  |
| `@react-three/drei`       | 10.7.7    | Helpers: ContactShadows, Environment, etc.   |
| `three`                   | 0.183.2   | 3D rendering engine                          |
| `@splinetool/react-spline`| 4.1.0     | Spline interactive 3D scene (hero right)     |
| `@splinetool/runtime`     | 1.12.68   | Spline runtime                               |
| `framer-motion`           | 12.35.2   | Spotlight mouse-glow component               |

### State & Forms

| Package                | Version  | Purpose                   |
|------------------------|----------|---------------------------|
| `@reduxjs/toolkit`     | 2.11.2   | Global state management   |
| `react-redux`          | 9.2.0    | Redux Provider + hooks    |
| `react-hook-form`      | 7.71.2   | Contact form handling     |
| `@hookform/resolvers`  | —        | Zod adapter               |
| `zod`                  | 4.3.6    | Form validation schema    |

### UI & Utilities

| Package          | Purpose                              |
|------------------|--------------------------------------|
| `lucide-react`   | Icon set                             |
| `clsx`           | Conditional class merging            |
| `tailwind-merge` | Safe Tailwind class deduplication    |
| `next-themes`    | Theme switching utility              |
| `sonner`         | Toast notifications (replaces shadcn toast) |
| `tw-animate-css` | Additional Tailwind animation utilities |

### Build & Dev

| Tool                   | Purpose                             |
|------------------------|-------------------------------------|
| ESLint 9               | Code quality                        |
| Prettier 3.8.1         | Code formatting (with Tailwind plugin) |
| Turbopack              | Next.js dev bundler (fast HMR)      |

---

## Critical Build Notes

- **`next/font/google` does NOT work** with Turbopack at build time (no internet access during build). Use CSS `@import url(...)` in `globals.css` instead. CDN font imports must appear **before** `@import "tailwindcss"`.
- **Tailwind v4 is CSS-first** — all theme customization goes in `globals.css` under `@theme {}` blocks, not in a `tailwind.config.ts`.
- **`shadcn init --defaults --yes`** works non-interactively. shadcn v4 overwrites `:root/.dark` — always re-apply design tokens after.
- **`create-next-app` (v16.x)** prompts for React Compiler — pipe `\n` to accept default No: `printf '\n' | npx create-next-app@latest ...`
- **R3F Canvas** must be in a separate file (`HeroCanvas.tsx`) for `next/dynamic` tree-shaking to work.
- **`scrollProgressRef` pattern:** Use a ref (not state) for scroll progress fed to WebGL uniforms — avoids React re-renders per frame.

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout: dark class, providers, metadata
│   ├── page.tsx                    # Home: section stubs (Phase 3 fills these)
│   ├── projects/
│   │   └── [slug]/page.tsx         # Case study — light theme
│   ├── now/
│   │   └── page.tsx                # /now living page
│   └── globals.css                 # Design tokens, CDN fonts, base styles
│
├── components/
│   ├── hero/                       # Phase 2 — COMPLETE
│   │   ├── HeroSection.tsx         # Orchestrator: 3-layer + split layout
│   │   ├── HeroText.tsx            # Left column: kicker, title, subtitle, CTAs
│   │   ├── HeroDataBar.tsx         # Bottom bar: tech stack / scroll indicator / status
│   │   ├── ShaderBackground.tsx    # WebGL noise canvas (z-0)
│   │   ├── HeroModel.tsx           # Lazy dynamic import + mobile SVG fallback
│   │   ├── HeroCanvas.tsx          # R3F Canvas wrapper (separate file — tree-shaking)
│   │   ├── Scene.tsx               # R3F icosahedron: breathing, mouse tilt, GSAP entrance
│   │   └── ScrollIndicator.tsx     # Animated scroll prompt (in HeroDataBar center)
│   │
│   ├── about/                      # Phase 3
│   │   ├── AboutSection.tsx
│   │   ├── ScrollRevealText.tsx    # Line-by-line text reveal
│   │   └── Avatar.tsx              # Illustrated character — variant prop
│   │
│   ├── projects/                   # Phase 3
│   │   ├── ProjectsSection.tsx     # Horizontal scroll + GSAP pin
│   │   ├── ProjectCard.tsx         # Video preview + clip-path reveal
│   │   └── ProjectDetail.tsx       # Case study layout (light theme)
│   │
│   ├── skills/                     # Phase 3
│   │   ├── SkillsSection.tsx
│   │   └── SkillCard.tsx           # Hover tilt + category badge
│   │
│   ├── contact/                    # Phase 3
│   │   ├── ContactSection.tsx
│   │   └── ContactForm.tsx         # react-hook-form + zod + shadcn inputs
│   │
│   ├── layout/
│   │   ├── Navbar.tsx              # Placeholder — full impl in Phase 4
│   │   ├── Footer.tsx              # Placeholder — full impl in Phase 4
│   │   ├── GSAPProvider.tsx        # Plugin registration, global defaults
│   │   ├── SmoothScroll.tsx        # Lenis + GSAP ticker sync
│   │   ├── CustomCursor.tsx        # Phase 5 — dot + trailing circle
│   │   ├── ScrollProgress.tsx      # Phase 4 — terracotta progress bar
│   │   └── PageTransition.tsx      # Phase 4 — route transitions
│   │
│   ├── shared/
│   │   ├── SectionHeading.tsx      # Animated section titles + kicker
│   │   ├── MagneticButton.tsx      # Pulls toward cursor — GSAP quickTo
│   │   └── TextReveal.tsx          # Reusable scroll text animation
│   │
│   └── ui/                         # shadcn + custom
│       ├── button.tsx, card.tsx, badge.tsx
│       ├── input.tsx, textarea.tsx, dialog.tsx
│       ├── sonner.tsx              # Toasts (used instead of shadcn toast)
│       ├── spotlight.tsx           # Mouse-tracked terracotta glow (framer-motion)
│       └── splite.tsx              # Spline 3D wrapper
│
├── shaders/
│   └── backgroundNoise.ts          # GLSL strings: vertex + fragment (domain-warped FBM)
│
├── hooks/
│   ├── useMediaQuery.ts            # media query listener + useBreakpoint helper
│   ├── usePrefersReducedMotion.ts  # Accessibility: disable animations
│   ├── useMousePosition.ts         # {x, y, normalizedX, normalizedY}
│   ├── useScrollTrigger.ts         # Thin ScrollTrigger wrapper
│   ├── useGSAPContext.ts           # GSAP scope + cleanup (Phase 3+)
│   └── useKonamiCode.ts            # Konami code listener (Phase 5)
│
├── store/
│   ├── store.ts                    # RTK configureStore — 4 slices
│   ├── provider.tsx                # ReduxProvider wrapper
│   ├── hooks.ts                    # Typed useAppDispatch / useAppSelector (placeholder)
│   └── slices/
│       ├── themeSlice.ts           # mode: "dark"|"light"|"zen", animationSpeed
│       ├── navigationSlice.ts      # activeSection, scrollProgress, isMenuOpen
│       ├── projectsSlice.ts        # items[], activeFilter, activeProject
│       └── uiSlice.ts             # isLoading, cursorVariant, easter egg flags
│
├── data/                           # Phase 3 — empty until content populated
│   ├── projects.ts
│   ├── skills.ts
│   └── personal.ts                 # Bio, social links, travel coords, /now data
│
├── lib/
│   ├── animations.ts               # Easing constants, durations (see animation-system.md)
│   ├── constants.ts                # NAV_LINKS, BREAKPOINTS, SECTION_IDS
│   ├── utils.ts                    # cn() — clsx + tailwind-merge
│   └── fonts.ts                    # Exists — unused (fonts loaded in globals.css)
│
├── types/
│   ├── project.ts                  # Project interface
│   ├── skill.ts                    # Skill, SkillCategory
│   └── animation.ts                # AnimationConfig, CursorVariant, ThemeMode
│
└── public/
    ├── fonts/                      # Self-hosted woff2 (if CDN unavailable at deploy)
    ├── images/
    │   ├── avatar/                 # Illustrated avatar variants (5 poses)
    │   ├── projects/               # Screenshots, og-image.png
    │   └── og-image.png
    └── videos/
        └── projects/               # Short 6-8s project preview loops
```

---

## Key Architecture Decisions

### App Router + RSC Boundaries
- Server Components for static content (text, images, metadata).
- `"use client"` only where interactivity is needed (animations, 3D, forms).
- GSAP, R3F, and Redux all live on the client side.

### Dual 3D Strategy
The hero section uses two separate 3D systems:
1. **Spline** (`@splinetool/react-spline`) — hero right column, interactive, loaded deferred via `requestIdleCallback` (600ms fallback). Handles user interaction out-of-box.
2. **R3F** (`HeroModel` → `HeroCanvas` → `Scene`) — breathing icosahedron, also lazy-loaded with `next/dynamic ssr:false`. Provides programmatic GSAP-driven animation.

Both are wrapped in `Suspense` with terracotta pulse dot fallbacks.

### GSAP Registered Once
ScrollTrigger (and any future plugins) registered in `GSAPProvider.tsx` at layout level. Global defaults set there too. Prevents duplicate registration warnings.

### Smooth Scroll Architecture
Lenis handles smooth scroll interpolation. Its ticker is wired directly to GSAP's ticker so animations and scroll share the same frame loop. ScrollTrigger receives Lenis scroll events via `lenis.on("scroll", ScrollTrigger.update)`.

### Theme System
- HTML root has `className="dark"` — dark mode is the default and primary theme.
- Redux `themeSlice` manages mode (`"dark" | "light" | "zen"`).
- `next-themes` available for system preference sync if needed.
- Zen mode: toggles `.dark` class off, halves `animationSpeed` in Redux (all animated components read this).

### When Redux vs Local State

| Use Redux                              | Use Local State                  |
|----------------------------------------|----------------------------------|
| Active section (navbar + scroll needs) | Hover states                     |
| Theme mode (whole app)                 | Form input values                |
| Cursor variant (shared)               | Open/closed single dialog        |
| Easter egg flags (persist)             | In-progress animation flags      |
| Project filter (multiple consumers)    | Component-local scroll position  |

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://yoursite.com
RESEND_API_KEY=re_xxxxx          # Contact form emails
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # Analytics (optional)
```
