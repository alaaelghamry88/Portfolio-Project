# Design Spec: Portfolio Smoothness & 3D Avatar

**Date:** 2026-03-12
**Project:** Alaa Elghamry — "The Craftsman's Journal" portfolio
**Status:** Approved

---

## Overview

Two parallel improvements to the portfolio:

1. **Design smoothness** — section-to-section continuity, navbar active state, micro-interactions
2. **3D Avatar** — Avaturn + Mixamo + R3F avatar with multiple pose states

---

## 1. The Continuous Thread (Section Flow)

### Goal
Visual continuity as the user scrolls through all 5 sections. Solves three things simultaneously: section-to-section flow, scroll progress, and orientation.

### Component
**`src/components/layout/SectionThread.tsx`** — fixed, desktop-only, pointer-events-none

### Visual anatomy
- `fixed left-6 top-0 h-screen z-30 pointer-events-none` — no layout impact
- Hidden on mobile (`hidden md:block`)
- A `1px` vertical line: faint `terracotta/15` base (unread), `terracotta` filled portion growing downward as scroll progress increases
- 5 circular nodes (`01`–`05`), one per section, at their respective scroll-offset positions along the line
- **Active node:** terracotta fill + `orb-pulse` animation (same keyframe already used in SkillsSection) + faint halo ring
- **Inactive nodes:** `steel-border` stroke, muted mono label

### Data / behaviour
- Reads `activeSection` from Redux (`navigationSlice`)
- GSAP ScrollTrigger with `scrub: 1` drives the fill line height (maps `scrollY / maxScroll` → line fill percentage)
- Node active state derived from `activeSection` string comparison
- No interactivity (pointer-events-none throughout)

### Responsive
- `md+` only — hidden on mobile via Tailwind

---

## 2. Navbar Active State

### Goal
The nav visually reflects which section the user is currently reading. Active item gets its own per-item accent color applied persistently (not just on hover).

### Changes to `src/components/layout/Navbar.tsx`
- Read `activeSection` from Redux store (already wired in `navigationSlice`)
- **Active item colour:** each nav item has a defined `iconColor` + gradient — when that item's section is active, apply its `iconColor` as a persistent text/icon colour (same colour shown on hover)
  - About → amber-400
  - Work (Projects) → emerald-400
  - Skills → sky-300
  - Contact → violet-400
- **Indicator dot:** `2px × 12px` terracotta bar below the active item label, animated with framer-motion `layoutId="nav-active"` so it slides smoothly between items as `activeSection` changes
- Hover colours (amber/emerald/sky/violet) remain unchanged — they are intentional personality, not brand inconsistency

### Section → nav item mapping
```
"hero"     → none active
"about"    → About
"projects" → Work
"skills"   → Skills
"contact"  → Contact
```

---

## 3. Micro-interactions

### Custom Cursor — `src/components/layout/CustomCursor.tsx`
- **Dot:** `4px` filled terracotta circle, follows cursor position exactly
- **Ring:** `24px` terracotta stroke circle (`0.4` opacity), follows cursor with lag via GSAP `quickTo` (`stiffness: 0.12`)
- **Hover state** (links, buttons, interactive elements): ring expands to `40px`, dot opacity → 0
- **Touch devices:** hidden entirely (`pointer: coarse` media query check)
- Added to root layout (`src/app/layout.tsx`) alongside existing providers
- Uses `useEffect` + `requestAnimationFrame` loop, zero React re-renders per frame

### Scroll Progress Bar — `src/components/layout/ScrollProgress.tsx`
- `1px` terracotta bar pinned at viewport top, `z-[60]` (above navbar at `z-50`)
- Width mapped to `scrollY / (documentHeight - viewportHeight)` as a percentage
- GSAP `quickTo` for smooth per-frame update — no React state
- Glow: `box-shadow: 0 0 8px rgba(200,96,42,0.6)`

---

## 4. 3D Avatar (Avaturn + Mixamo + Blender + R3F)

### Avatar Generation Workflow (one-time, manual)

1. **Avaturn** → [avaturn.me](https://avaturn.me) → upload selfie → customise → export `avatar.glb` → save to `public/models/avatar.glb`
2. **Mixamo** → upload `avatar.glb` → auto-rig → download 4 animations:
   - `Idle` — FBX with skin (first download)
   - `Wave Hip` — FBX without skin
   - `Typing` — FBX without skin
   - `Sitting Idle` / `Lotus` — FBX without skin
3. **Blender** (~5 min) → import avatar GLB + all FBX files → NLA Editor → bake all clips into one GLB → export as `public/models/avatar.glb`
4. Verify with `npx gltf-transform inspect public/models/avatar.glb` — confirm 4 animation clips present

### Components

**`src/components/avatar/AvatarModel.tsx`** — R3F mesh
- `useGLTF("/models/avatar.glb")` to load model + animation clips
- `useAnimations(animations, ref)` from `@react-three/drei`
- Props: `state: "default" | "coding" | "meditating" | "waving" | "traveling"`
- State → clip name map:
  ```ts
  const CLIP_MAP = {
    default:    "Idle",
    coding:     "Typing",
    meditating: "Sitting Idle",
    waving:     "Wave Hip",
    traveling:  "Idle",
  }
  ```
- State transitions: `action.fadeIn(0.5)` + `prevAction.fadeOut(0.5)` for smooth crossfade
- Soft ambient + directional lighting, transparent canvas background

**`src/components/avatar/AvatarCanvas.tsx`** — `next/dynamic ssr:false` wrapper
- Same pattern as `src/components/hero/HeroCanvas.tsx`
- R3F Canvas, transparent background, `ContactShadows` (terracotta tint)
- Exports `AvatarCanvas` with `state` prop passed through

### Placements

| Location | Component | State | Trigger |
|---|---|---|---|
| About section — right of photo | `AvatarCanvas` | `"default"` | Idle on scroll-in |
| Contact section — left column | `AvatarCanvas` | `"meditating"` | Idle while form untouched |
| Contact form success | `AvatarCanvas` | `"waving"` | Replaces meditating after submit |
| Footer | `AvatarCanvas` | `"meditating"` | Always |
| 404 page | `AvatarCanvas` | `"coding"` | Always |

### About section layout change
- Currently: photo left, text right (`md:grid-cols-[2fr_3fr]`)
- Updated: photo left, text center, avatar companion right (`md:grid-cols-[2fr_3fr_2fr]`)
- Avatar appears as a floating companion at ~60% height of the photo, with a slight `y` float animation (GSAP sine loop)

---

## Files to Create / Modify

### New files
- `src/components/layout/SectionThread.tsx`
- `src/components/layout/CustomCursor.tsx`
- `src/components/layout/ScrollProgress.tsx`
- `src/components/avatar/AvatarModel.tsx`
- `src/components/avatar/AvatarCanvas.tsx`

### Modified files
- `src/components/layout/Navbar.tsx` — active section state
- `src/components/about/AboutSection.tsx` — add avatar companion column
- `src/components/contact/ContactSection.tsx` — add avatar left column, wire waving on success
- `src/components/contact/ContactForm.tsx` — emit success event for avatar state change
- `src/app/layout.tsx` — add CustomCursor + ScrollProgress
- `src/app/not-found.tsx` — create 404 page with coding avatar
- `src/components/layout/Footer.tsx` — add meditating avatar

---

## Out of scope

- Konami code / easter eggs (Phase 5 — separate spec)
- `/now` page (Phase 5)
- Page transitions / case study pages (Phase 3.5 — separate spec)
- Performance audit / launch checklist (Phase 6)
