# Phase 5 — Polish & Launch Design Spec

**Project:** Alaa Elghamry Portfolio — "The Craftsman's Journal"
**Date:** 2026-03-17
**Status:** Approved

---

## Overview

Phase 5 polishes the portfolio for launch readiness. No new sections are added. All work is either global (CSS, layout), per-component (aria attributes, focus rings), or new small files (sitemap config, JSON-LD, OG image route). The approach is **Lighthouse-driven**: run an audit first to establish a baseline, then fix in priority order.

### Lighthouse Targets

| Metric        | Target  |
|---------------|---------|
| Performance   | ≥ 90    |
| Accessibility | ≥ 95    |
| SEO           | ≥ 95    |
| LCP           | < 2.5s  |
| CLS           | < 0.1   |
| INP           | < 200ms |

### Approach: Lighthouse-Driven

Run a Lighthouse audit first to document baseline scores. Fix the highest-impact items first — accessibility issues typically cost the most points and require the most markup changes, so fixing them before responsive polish avoids touching the same components twice.

**Workstream order:**
1. Lighthouse baseline audit
2. Accessibility fixes
3. SEO
4. Responsive polish
5. Vercel Analytics

---

## Out of Scope

- Vercel deployment and custom domain setup
- Email service wiring for contact form (submit mocks success, no email sent)
- Cross-browser testing on real devices
- Performance budgeting / bundle splitting beyond current setup

---

## Workstream 1 — Accessibility

**Target:** Lighthouse Accessibility ≥ 95

### Focus rings (global)
Add to `globals.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```
Replaces browser default. Applies site-wide. Ensure `.skip-link` (already in `layout.tsx`) is styled and visible on focus.

### Canvas / WebGL elements
- `ShaderBackground.tsx` — add `aria-hidden="true"` and `role="presentation"`
- `HeroCanvas.tsx` — same

### Images
Audit all image usages for missing `alt` text:
- `Avatar.tsx`
- `ProjectCard.tsx`
- `Footer.tsx`

### `prefers-reduced-motion`
The `usePrefersReducedMotion` hook exists at `src/hooks/usePrefersReducedMotion.ts` (implemented in Phase 1). Audit that it is actually respected in:
- `HeroText.tsx` (char-split GSAP entrance)
- `ExperienceSection.tsx` (timeline draw)
- `ProjectsSection.tsx` (horizontal scroll)

Where not respected, add conditional: skip GSAP animations, show content in final state immediately.

### Contact form
In `ContactForm.tsx`:
- Every `<input>` and `<textarea>` must have an associated `<label>` (not just `placeholder`)
- Error messages tied to fields via `aria-describedby`

### Keyboard navigation
- `MagneticButton.tsx` — confirm it wraps a `<button>` element (natively focusable), not a `<div>`
- Navbar mobile overlay — trap focus while open, release on close. Use a manual `keydown` listener (no new dependency): listen for `Tab` and `Shift+Tab`, clamp focus to the first/last focusable element inside the overlay. Listen for `Escape` to close.
- `ProjectCard` links — ensure keyboard-reachable in horizontal scroll layout

---

## Workstream 2 — SEO

**Target:** Lighthouse SEO ≥ 95

### OG Image — `src/app/opengraph-image.tsx`
New file using Next.js built-in `ImageResponse` from `next/og`. Code-generated, no asset required.

- **Size:** 1200×630
- **Background:** `#1a1e24` (Deep Steel)
- **Content:** "Alaa Elghamry" in Clash Display (large), "Frontend Developer & Design Engineer" in Satoshi, terracotta (`#c8602a`) accent line divider
- Referenced automatically by Next.js metadata system — no manual `og:image` entry needed in `layout.tsx`

**Font loading:** `ImageResponse` requires fonts as `ArrayBuffer`. Fetch them inside the route handler:
```ts
const clashDisplay = await fetch(
  'https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap'
).then((r) => r.arrayBuffer());
// pass to ImageResponse options: { fonts: [{ name: 'Clash Display', data: clashDisplay, weight: 700 }] }
```
For `icon.tsx` and `apple-icon.tsx`, use a system font — no custom font fetch needed for the "AE" monogram.

### Favicon + Icons
New files in `src/app/`:
- `icon.tsx` — `ImageResponse`, "AE" monogram on terracotta background, 32×32
- `apple-icon.tsx` — same, 180×180

Next.js serves these automatically from the `app/` directory. No `<link>` tags needed in `layout.tsx`.

### Sitemap + robots.txt
Install `next-sitemap`. Add `next-sitemap.config.js` at project root:
```js
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://alaaelghamry.dev',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
};
```
Add a `.env.production` file with `SITE_URL=https://alaaelghamry.dev` as a placeholder (update before real deploy).

Add `postbuild` script to `package.json`: `"postbuild": "next-sitemap"`.

**Note:** `sitemap.xml` and `robots.txt` are only generated after `next build` (not `next dev`). This is expected — do not expect them to appear during local development.

### JSON-LD Person Schema
Add inline `<script type="application/ld+json">` directly in `src/app/page.tsx` (not layout, so it only appears on the home page). Pull social links from `src/data/personal.ts`:
```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alaa Elghamry',
  jobTitle: 'Frontend Developer & Design Engineer',
  url: 'https://alaaelghamry.dev',
  sameAs: [
    'https://github.com/alaaelghamry',   // update from personal.ts
    'https://linkedin.com/in/alaaelghamry', // update from personal.ts
  ],
};
// In JSX:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### Per-page metadata — `/projects/[slug]`
In `src/app/projects/[slug]/page.tsx`, add `generateMetadata()`:
```ts
export async function generateMetadata({ params }) {
  const project = getProjectBySlug(params.slug);
  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline },
  };
}
```

---

## Workstream 3 — Responsive Polish

### Hero 3D canvas — hide on mobile
In `HeroSection.tsx`, the right column (Spline + R3F canvas) gets `hidden md:block`. On `< md`:
- Right column is not rendered at all
- Spline `requestIdleCallback` load is skipped
- R3F canvas never initializes — no wasted resources
- Left text column takes full width

### Hero text scaling
Replace fixed Tailwind text size classes on the title in `HeroText.tsx` with `clamp()`-based CSS:
```css
font-size: clamp(2.5rem, 8vw, 6rem);
```
Applied via a CSS custom property or inline style. Ensures smooth scaling without breakpoint jumps. With the right column gone on mobile, text has full width to breathe.

### Projects section — mobile vertical stack
In `ProjectsSection.tsx`, gate the GSAP `ScrollTrigger.pin` + horizontal scroll behind the existing `useMediaQuery` hook at `src/hooks/useMediaQuery.ts` (implemented in Phase 1). Usage: `const isDesktop = useMediaQuery('(min-width: 768px)')`. Only initialize the ScrollTrigger when `isDesktop` is true. On `< md`, render cards as a vertical stack with normal scroll.

### Custom cursor on touch
In `CustomCursor.tsx`, add a check on mount:
```ts
const isTouch = window.matchMedia('(pointer: coarse)').matches;
```
If touch, return `null` — no cursor element rendered, no mouse tracking.

### Breakpoint sweep
Audit all section components at `sm / md / lg / xl`:
- `AboutSection.tsx`
- `ExperienceSection.tsx`
- `SkillsSection.tsx`
- `ContactSection.tsx`

Fix overflow, padding, and layout issues with targeted Tailwind class adjustments. No rearchitecting.

---

## Workstream 4 — Vercel Analytics

Install:
```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`, import and add `<Analytics />` inside `<body>`:
```tsx
import { Analytics } from '@vercel/analytics/next';
// ...
<body>
  <Analytics />
  {/* existing layout */}
</body>
```

In development, events are logged to the console but not sent to the dashboard. No Vercel project configuration required until deploy.

---

## Workstream 5 — Contact Form Mock

The contact form already has its UI complete. Ensure `app/api/contact/route.ts`:
- Returns `200 OK` with `{ success: true }`
- Does not attempt to call any email API
- `ContactForm.tsx` shows the success state (waving avatar + thank you message) on 200 response

Email service wiring (Resend or similar) is deferred to pre-deploy.

---

## Files Created / Modified

| File | Action |
|------|--------|
| `src/app/globals.css` | Add `:focus-visible` rule |
| `src/components/hero/ShaderBackground.tsx` | Add `aria-hidden`, `role="presentation"` |
| `src/components/hero/HeroCanvas.tsx` | Add `aria-hidden`, `role="presentation"` |
| `src/components/hero/HeroSection.tsx` | Hide right column on mobile (`hidden md:block`) |
| `src/components/hero/HeroText.tsx` | `clamp()` font sizes, verify reduced-motion |
| `src/components/layout/CustomCursor.tsx` | Skip on `pointer: coarse` |
| `src/components/layout/Navbar.tsx` | Focus trap on mobile overlay |
| `src/components/layout/layout.tsx` | Add `<Analytics />` |
| `src/components/contact/ContactForm.tsx` | Labels, `aria-describedby` on errors |
| `src/components/projects/ProjectsSection.tsx` | Gate pin/scroll on `md+`, vertical stack on mobile |
| `src/components/shared/MagneticButton.tsx` | Verify `<button>` element |
| `src/app/page.tsx` | Add JSON-LD Person schema |
| `src/app/opengraph-image.tsx` | New — code-generated OG image |
| `src/app/icon.tsx` | New — favicon via ImageResponse |
| `src/app/apple-icon.tsx` | New — apple touch icon |
| `src/app/projects/[slug]/page.tsx` | Add `generateMetadata()` |
| `src/app/api/contact/route.ts` | Ensure mock 200 response |
| `next-sitemap.config.js` | New — sitemap config |
| `package.json` | Add `postbuild` script, `@vercel/analytics` dep |
| `Avatar.tsx`, `ProjectCard.tsx`, `Footer.tsx` | Alt text audit |
| `ExperienceSection.tsx`, `SkillsSection.tsx`, `AboutSection.tsx`, `ContactSection.tsx` | Breakpoint sweep |
