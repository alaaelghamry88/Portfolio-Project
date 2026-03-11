# Portfolio Implementation Plan

> **Alaa Elghamry — "The Craftsman's Journal"**
> See also: [brand-identity.md](./brand-identity.md) · [architecture.md](./architecture.md) · [animation-system.md](./animation-system.md)

---

## Status Overview

| Phase | Focus                     | Status        |
|-------|---------------------------|---------------|
| 1     | Foundation                | ✅ Complete   |
| 2     | Hero Section              | ✅ Complete   |
| 3     | Content Sections          | ⏳ Next       |
| 4     | Navigation & Transitions  | ⏳ Pending    |
| 5     | Personality & Easter Eggs | ⏳ Pending    |
| 6     | Polish & Launch           | ⏳ Pending    |

---

## Phase 1 — Foundation ✅ Complete

**Goal:** Project skeleton, design system, global infrastructure.

- [x] Next.js 16.x + TypeScript + Turbopack
- [x] Tailwind CSS v4 (CSS-first — `@theme {}` in `globals.css`, no `tailwind.config.ts`)
- [x] shadcn/ui v4 (Nova preset, `components.json` present)
- [x] Font loading via CDN `@import url(...)` in `globals.css` (not `next/font/google`)
  - Clash Display (Fontshare), Satoshi (Fontshare), JetBrains Mono (Google)
- [x] CSS design tokens — dark + light palettes in `globals.css`
- [x] Redux Toolkit store — themeSlice, navigationSlice, projectsSlice, uiSlice
- [x] Root layout: dark class on HTML, ReduxProvider → GSAPProvider → SmoothScroll
- [x] GSAPProvider — registers ScrollTrigger + useGSAP, sets global defaults
- [x] SmoothScroll (Lenis 1.3.x) — wired to GSAP ticker for frame-perfect sync
- [x] Custom hooks: `useMediaQuery`, `usePrefersReducedMotion`, `useMousePosition`, `useScrollTrigger`
- [x] Type definitions: project, skill, animation
- [x] Lib: `cn()`, animation constants, app constants (NAV_LINKS, SECTION_IDS, BREAKPOINTS)
- [x] Navbar placeholder, Footer placeholder
- [x] shadcn components: button, card, badge, input, textarea, dialog, sonner
- [x] Spotlight component (mouse-tracked terracotta glow, framer-motion)
- [x] Spline wrapper component (`ui/splite.tsx`)
- [x] Grain texture + corner vignettes in `globals.css`

**Deliverable:** Running Next.js app with design system, dark theme, smooth scroll, Redux connected. Build passes clean.

---

## Phase 2 — Hero Section ✅ Complete

**Goal:** Fully animated, responsive hero section.

### Layout
The hero uses a split asymmetric layout:
- **Left ~56%:** Typography (kicker, title, subtitle, CTAs)
- **Right ~44%:** Spline 3D interactive scene (loaded deferred via `requestIdleCallback`)
- **Bottom bar:** `HeroDataBar` — tech stack (left) · scroll indicator (center) · "Available for work" status (right)
- **Mobile:** Full-width stacked; Spline at 50% opacity overlaid right

### Layers (z-index)

| z-index | Component        | Content                              |
|---------|------------------|--------------------------------------|
| 0       | ShaderBackground | WebGL noise canvas                   |
| 5       | Spotlight        | Mouse-tracked terracotta glow        |
| 10      | Left column      | HeroText (kicker, title, subtitle, CTAs) |
| 10      | Right column     | Spline 3D scene                      |
| 20      | HeroDataBar      | Status strip, scroll indicator       |

### Components Implemented

- [x] **HeroSection.tsx** — Orchestrator. Layer composition, scroll parallax (left column: -8% y, 0.7 opacity on scroll).
- [x] **HeroText.tsx** — "01 · The Arrival" kicker (mono, terracotta, uppercase). "Alaa Elghamry's" / "Portfolio" (terracotta) title split over 2 lines. Subtitle, View Work + About CTAs. GSAP char-split entrance with `prefers-reduced-motion` fallback.
- [x] **HeroDataBar.tsx** — Bottom status strip. 3-col grid: tech stack | ScrollIndicator | "Available for work" (green pulse dot). Entrance fade at 1.8s. Backdrop blur.
- [x] **ShaderBackground.tsx** — WebGL canvas, domain-warped FBM noise (`backgroundNoise.ts`). Oscillates Deep Steel ↔ warm brown (`#231e19`). Scroll-reactive via `scrollProgressRef` (no state — reads ref in RAF loop). ResizeObserver + IntersectionObserver pause when off-screen.
- [x] **HeroCanvas.tsx** — R3F Canvas in separate file (enables `next/dynamic` tree-shaking). Camera [0,0,5], fov 45, DPR capped 1.5. Antialias + alpha.
- [x] **Scene.tsx** — R3F breathing icosahedron. IcosahedronGeometry (1.4 scale, 1 detail). Steel body (`#2a3240`) + terracotta EdgesGeometry (`#c8602a`, 0.75 opacity). Breathing sine wave (amplitude 0.045). Slow auto-rotation. Mouse tilt (lerped). GSAP `elastic.out(1,0.5)` entrance at 0.3s. Environment "sunset". ContactShadows (terracotta, [0,-2.2,0]).
- [x] **HeroModel.tsx** — `next/dynamic ssr:false` wrapper. Desktop: R3F canvas. Mobile: SVG icosahedron wireframe fallback (terracotta lines, 30% opacity). Pulsing terracotta dot placeholder while loading.
- [x] **ScrollIndicator.tsx** — "SCROLL" + mouse outline with animated dot (`@keyframes scrollDot`). Entrance fade at 1.8s. Subtle bounce loop (`y:6, sine.inOut`).
- [x] **backgroundNoise.ts** — GLSL vertex + fragment shader strings. Hash-based value noise, 4-octave FBM, domain warp, vignette. Colors: `#1a1e24` ↔ `#231e19`.

### Entrance Animation Sequence

```
0.0s  ShaderBackground fades in (power2.out, 1.0s)
0.3s  R3F icosahedron scales in (elastic.out(1, 0.5), 1.2s)
0.3s  Spotlight glow fades in (0.9s)
0.5s  Kicker "01 · The Arrival" fades up from y:8 (0.5s)
0.6s  Title chars: slide up from 110% (power4.out, 0.75s, 0.035s stagger)
0.9s  Subtitle fades up from y:24 (0.7s)
1.1s  CTA buttons fade up from y:16 (0.6s)
1.8s  HeroDataBar + ScrollIndicator fade in from y:24 (0.8s)
```

**Deliverable:** Fully animated responsive hero. Build passes. Committed to master.

---

## Phase 3 — Content Sections ⏳ Next

**Goal:** About, Projects, Skills, Contact — all animated, real content.

### 3.1 Data Layer (first task)

Before building sections, populate data files:

- [ ] `src/data/projects.ts` — `Project[]` (3–5 entries minimum)
- [ ] `src/data/skills.ts` — `Skill[]` grouped by category
- [ ] `src/data/personal.ts` — Bio text, social links, travel coordinates, /now data

### 3.2 Shared Components

- [ ] **SectionHeading.tsx** — Props: `kicker` (e.g. "02 · The Origin"), `title`. Kicker: mono, terracotta, uppercase, `tracking-widest`. Title: Clash Display `text-section`. GSAP ScrollTrigger entrance.
- [ ] **TextReveal.tsx** — Reusable scroll-triggered line-by-line reveal. `ScrollTrigger.batch()`, `y: 30 → 0`, `opacity: 0 → 1`, `0.06s` stagger.
- [ ] **MagneticButton.tsx** — GSAP `quickTo` x/y on mouse move. Resets on mouse leave.

### 3.3 About Section — "02 · The Origin"

**Layout:** Two-column desktop (illustration left, text right). Single column mobile.

- [ ] **Avatar.tsx** — `variant: "default" | "coding" | "meditating" | "waving" | "traveling"`. SVG/PNG from `/public/images/avatar/`.
- [ ] **ScrollRevealText.tsx** — Line-by-line text reveal component.
- [ ] **AboutSection.tsx** — Full section assembly.

**Animations:**
- Avatar: `x: -60, opacity: 0` → rest, ScrollTrigger
- Text lines: `ScrollTrigger.batch()`, staggered `0.06s`
- Key words: terracotta color applied after line reveal + `scale` pulse

### 3.4 Projects Section — "03 · The Work"

**Layout:** Pinned horizontal scroll (GSAP `ScrollTrigger.pin`). Full viewport height.

- [ ] **ProjectsSection.tsx** — Pin + horizontal scroll, progress-mapped x position.
- [ ] **ProjectCard.tsx** — `clipPath` reveal, video/screenshot, title, tagline, badges, case study link.

**Mobile:** Convert to vertical card stack.

**ScrollTrigger config:**
```ts
ScrollTrigger.create({
  trigger: projectsSectionRef.current,
  start: "top top",
  end: () => `+=${totalScrollWidth}`,
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    gsap.set(trackRef.current, { x: -self.progress * totalScrollWidth });
  },
});
```

### 3.5 Project Case Study Pages — `/projects/[slug]`

**Theme:** Light palette (Paper background). Deliberate contrast with dark main site.

- [ ] `app/projects/[slug]/page.tsx` — page with light theme class
- [ ] **ProjectDetail.tsx** — editorial layout, text max-width 720px, full-bleed media
- [ ] Transition: card scales up → color morphs dark → light → new page fades in

### 3.6 Skills Section — "04 · The Practice"

**Layout:** Category-grouped grid. No progress bars.

- [ ] **SkillsSection.tsx**
- [ ] **SkillCard.tsx** — icon, name, category badge (green/blue/amber). Hover: `y:-4px`, border → terracotta.

**Animations:** Cards stagger in on scroll in grid pattern (not linear).

### 3.7 Contact Section — "05 · The Next Step"

**Layout:** Split desktop — invitation text + meditating avatar (left), form (right).

- [ ] **ContactSection.tsx**
- [ ] **ContactForm.tsx** — react-hook-form + zod. Fields: Name, Email, Message. Submit: terracotta magnetic button. Success: form out → waving avatar + thank you message.
- [ ] `app/api/contact/route.ts` — Resend or similar email service.

---

## Phase 4 — Navigation & Transitions ⏳ Pending

- [ ] **Navbar (full)** — scroll-aware bg (`transparent` → `rgba(26,30,36,0.8)` + blur), active section terracotta underline (`quickTo`), mobile hamburger → full-screen overlay with GSAP stagger
- [ ] **ScrollProgress.tsx** — terracotta 1px progress bar at viewport top
- [ ] **PageTransition.tsx** — GSAP timeline: dark → light color morph on case study navigation
- [ ] **Footer (full)** — social links, travel coordinates (hover tooltip), meditating avatar, copyright

---

## Phase 5 — Personality & Easter Eggs ⏳ Pending

- [ ] **CustomCursor.tsx** — dot + trailing circle, `quickTo` x/y. Touch devices: hidden. Variants: default, hover (1.5x), click (0.8x), text.
- [ ] **Konami code** (`useKonamiCode.ts`) → `unlockZenMode()` — light palette, 50% animation speed, sonner toast "You found the quiet."
- [ ] **7-click avatar easter egg** — Footer avatar click counter → full-screen overlay (GSAP slide-up)
- [ ] **Console message** — Workshop metaphor in terracotta + playlist link
- [ ] **Travel coordinates** — Monospace muted in section margins, hover GSAP tooltip
- [ ] **`/now` page** — light palette, personal living updates
- [ ] **`/404` page** — coding avatar, wit

---

## Phase 6 — Polish & Launch ⏳ Pending

### Performance Targets

| Metric        | Target    |
|---------------|-----------|
| Lighthouse Perf | ≥ 90   |
| Accessibility | ≥ 95      |
| SEO           | ≥ 95      |
| LCP           | < 2.5s    |
| CLS           | < 0.1     |
| INP           | < 200ms   |
| First Load JS | < 150 KB  |
| Total JS      | < 400 KB  |

### Checklist

**Responsive:**
- [ ] All breakpoints: sm/md/lg/xl
- [ ] Projects: horizontal → vertical on mobile
- [ ] Hero text scales via `clamp()`
- [ ] Custom cursor disabled on touch

**Accessibility:**
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus rings: terracotta, 2px offset
- [ ] Color contrast ≥ 4.5:1 body, ≥ 3:1 large text
- [ ] All images have `alt` text
- [ ] Canvas elements: `aria-hidden="true"`
- [ ] `prefers-reduced-motion` fully honored
- [ ] Form field `label` associations + error messages

**SEO:**
- [ ] `next-sitemap` for `sitemap.xml` + `robots.txt`
- [ ] JSON-LD Person schema on home page
- [ ] Per-page metadata for case studies
- [ ] og:image verified on social platforms
- [ ] Favicon + apple-touch-icon

**Launch:**
- [ ] All animations 60fps on target devices
- [ ] Contact form sends emails
- [ ] No broken links
- [ ] Cross-browser: Chrome, Firefox, Safari, iOS Safari, Android Chrome
- [ ] Vercel deployment + domain + HTTPS
- [ ] Environment variables set in Vercel
- [ ] Analytics connected
- [ ] Final QA pass

---

## Section Summary

| # | Section   | Kicker             | 3D / Visual              | Status     |
|---|-----------|--------------------|--------------------------|------------|
| 01 | Hero     | 01 · The Arrival   | Spline + R3F icosahedron | ✅ Done    |
| 02 | About    | 02 · The Origin    | Illustrated avatar       | ⏳ Phase 3 |
| 03 | Projects | 03 · The Work      | Video previews           | ⏳ Phase 3 |
| 04 | Skills   | 04 · The Practice  | —                        | ⏳ Phase 3 |
| 05 | Contact  | 05 · The Next Step | Meditating avatar        | ⏳ Phase 3 |
