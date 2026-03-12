# Design Smoothness & 3D Avatar Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual continuity across sections (Continuous Thread), navbar active state, micro-interactions (custom cursor + scroll progress bar), and a 3D avatar with pose states used across About, Contact, Footer, and 404.

**Architecture:** Six independent chunks that build on each other. Chunks 1–3 are pure UI polish with no dependencies. Chunk 4 is a manual asset-preparation step (no code). Chunks 5–6 require the asset from Chunk 4. All animation follows the existing GSAP + `useGSAP` pattern; R3F components follow the `HeroCanvas`/`Scene` pattern already established.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3.14 + `@gsap/react`, Redux Toolkit 2.x, `@react-three/fiber`, `@react-three/drei`, framer-motion, Tailwind CSS v4, TypeScript.

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `src/components/layout/ScrollProgress.tsx` | 1px terracotta progress bar at viewport top |
| `src/components/layout/CustomCursor.tsx` | Dot + lagging ring cursor, hidden on touch |
| `src/components/layout/SectionThread.tsx` | Fixed left timeline thread with section nodes |
| `src/components/avatar/AvatarModel.tsx` | R3F mesh — loads GLB, drives animation state |
| `src/components/avatar/AvatarCanvas.tsx` | `next/dynamic ssr:false` canvas wrapper |
| `src/app/not-found.tsx` | 404 page with coding avatar |

### Modified files
| File | Change |
|---|---|
| `src/app/layout.tsx` | Add `ScrollProgress` + `CustomCursor` inside `ReduxProvider` |
| `src/components/layout/Navbar.tsx` | Read `activeSection` from Redux; add persistent active colour + indicator dot |
| `src/components/about/AboutSection.tsx` | Add third column for avatar companion |
| `src/components/contact/ContactSection.tsx` | Add avatar left column; accept `formSuccess` prop |
| `src/components/contact/ContactForm.tsx` | Accept `onSuccess` callback prop; fire it on submit success |
| `src/components/layout/Footer.tsx` | Add meditating avatar to right column |

---

## Chunk 1: Micro-interactions — ScrollProgress & CustomCursor

### Task 1: ScrollProgress component

**Files:**
- Create: `src/components/layout/ScrollProgress.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/layout/ScrollProgress.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const setWidth = gsap.quickTo(bar, "width", { duration: 0.1, ease: "none" });

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      setWidth(`${pct}%`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-px pointer-events-none"
      style={{ background: "rgba(200,96,42,0.15)" }}
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "0%",
          background: "#c8602a",
          boxShadow: "0 0 8px rgba(200,96,42,0.6)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add to root layout**

Open `src/app/layout.tsx`. Inside `<ReduxProvider>` (after `<GSAPProvider>`), add `<ScrollProgress />` as the first child of `<body>` before the `site-bg` div:

```tsx
// add import at top
import { ScrollProgress } from "@/components/layout/ScrollProgress";

// inside <body>, before <div className="site-bg">
<ScrollProgress />
```

- [ ] **Step 3: Verify visually**

`npm run dev` → open browser → scroll the page → confirm a terracotta line grows from left to right at the very top of the viewport, above the navbar.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ScrollProgress.tsx src/app/layout.tsx
git commit -m "feat: add terracotta scroll progress bar"
```

---

### Task 2: CustomCursor component

**Files:**
- Create: `src/components/layout/CustomCursor.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/layout/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Make cursor elements visible
    dot.style.opacity  = "1";
    ring.style.opacity = "1";

    // Hide native cursor on the whole page
    document.documentElement.style.cursor = "none";

    const moveX = gsap.quickTo(dot,  "x", { duration: 0,    ease: "none" });
    const moveY = gsap.quickTo(dot,  "y", { duration: 0,    ease: "none" });
    const lagX  = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
    const lagY  = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
      lagX(e.clientX);
      lagY(e.clientY);
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.65, duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { opacity: 0,  duration: 0.15 });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1,   duration: 0.25, ease: "power2.out" });
      gsap.to(dot,  { opacity: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMove);

    // Watch for interactive elements entering/leaving
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    function attachListeners() {
      document
        .querySelectorAll("a, button, [role='button'], input, textarea, select, label")
        .forEach((el) => {
          el.removeEventListener("mouseenter", onEnterInteractive);
          el.removeEventListener("mouseleave", onLeaveInteractive);
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });
    }
    attachListeners();

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      document.documentElement.style.cursor = "";
    };
  }, []);

  // Dot and ring start invisible; shown only on pointer:fine devices
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          background: "#c8602a",
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
          border: "1.5px solid rgba(200,96,42,0.5)",
          opacity: 0,
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Add to root layout**

In `src/app/layout.tsx`, add inside `<ReduxProvider>`, alongside `<ScrollProgress>`:

```tsx
import { CustomCursor } from "@/components/layout/CustomCursor";

// inside <body>, after <ScrollProgress />
<CustomCursor />
```

- [ ] **Step 3: Verify visually**

Reload dev server. On a desktop (non-touch) device:
- Native cursor should be hidden
- A small terracotta dot should follow the mouse exactly
- A larger ring should lag slightly behind
- Hovering a link/button: ring expands, dot hides
- On a touch device: no cursor elements visible, native behaviour unchanged

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/CustomCursor.tsx src/app/layout.tsx
git commit -m "feat: add custom terracotta cursor with lagging ring"
```

---

## Chunk 2: Navbar Active State

### Task 3: Wire activeSection into Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Add Redux selector and section → item mapping**

At the top of `Navbar.tsx`, add the import and mapping:

```tsx
import { useAppSelector } from "@/store/hooks";

// Map section IDs to nav item labels
const SECTION_TO_NAV: Record<string, string> = {
  about:    "About",
  projects: "Work",
  skills:   "Skills",
  contact:  "Contact",
};
```

Inside the `Navbar` function, add the selector:

```tsx
const activeSection = useAppSelector((s) => s.navigation.activeSection);
const activeLabel   = SECTION_TO_NAV[activeSection] ?? null;
```

- [ ] **Step 2: Update FlipItem to accept and show active state**

Add an `isActive` prop to `FlipItem`:

```tsx
function FlipItem({
  item,
  isActive,
  className,
  labelClassName,
}: {
  item: NavItem;
  isActive: boolean;
  className?: string;
  labelClassName?: string;
}) {
```

Inside `FlipItem`, apply the active colour to the front face when `isActive` is true. Replace the existing `className` on the front `motion.a`:

```tsx
// front face — replace text-[#a89f90] with conditional active colour
className={cn(
  "flex items-center gap-1.5 relative z-10 rounded-xl transition-colors",
  isActive ? item.iconColor.replace("group-hover:", "") : "text-[#a89f90]",
  className,
)}
```

> Note: `item.iconColor` is `"group-hover:text-amber-400"` etc. Strip the `group-hover:` prefix to get `"text-amber-400"` for active state.

- [ ] **Step 3: Add the sliding indicator dot beneath active item**

Import `AnimatePresence` alongside existing framer-motion imports:

```tsx
import { motion, AnimatePresence, Variants } from "framer-motion";
```

Inside the `<li>` that wraps each `FlipItem`, add the indicator:

```tsx
<li key={item.label} className="relative flex flex-col items-center">
  <FlipItem
    item={item}
    isActive={activeLabel === item.label}
    className="px-2.5 py-1.5 text-sm sm:px-3"
    labelClassName="hidden sm:inline font-body font-medium"
  />
  <AnimatePresence>
    {activeLabel === item.label && (
      <motion.span
        layoutId="nav-active"
        className="absolute -bottom-1 rounded-full bg-terracotta"
        style={{ width: 16, height: 2 }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleX: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
  </AnimatePresence>
</li>
```

- [ ] **Step 4: Verify visually**

Run dev server. Scroll through each section:
- When in the About section → "About" nav item turns amber, small terracotta bar appears below it
- When in Projects → "Work" turns emerald, bar slides there
- When in Skills → "Skills" turns sky-blue
- When in Contact → "Contact" turns violet
- Bar slides smoothly between items using `layoutId` spring animation

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: navbar active section highlight with sliding indicator"
```

---

## Chunk 3: Section Thread

### Task 4: SectionThread component

**Files:**
- Create: `src/components/layout/SectionThread.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create SectionThread**

```tsx
// src/components/layout/SectionThread.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppSelector } from "@/store/hooks";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero",     label: "01" },
  { id: "about",    label: "02" },
  { id: "projects", label: "03" },
  { id: "skills",   label: "04" },
  { id: "contact",  label: "05" },
] as const;

export function SectionThread() {
  const fillRef    = useRef<HTMLDivElement>(null);
  const activeSection = useAppSelector((s) => s.navigation.activeSection);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const setHeight = gsap.quickTo(fill, "height", { duration: 0.1, ease: "none" });

    const trigger = ScrollTrigger.create({
      start:   "top top",
      end:     "bottom bottom",
      scrub:   true,
      onUpdate: (self) => {
        setHeight(`${self.progress * 100}%`);
      },
    });

    return () => trigger.kill();
  }, []);

  // Node positions: distribute evenly across viewport height
  // Each section node sits at (index / (total-1)) * 100%
  const nodeCount = SECTIONS.length;

  return (
    <div
      aria-hidden="true"
      className="fixed left-6 top-0 h-screen z-30 pointer-events-none hidden md:flex flex-col items-center"
      style={{ width: 20 }}
    >
      {/* Base line — full height, faint */}
      <div
        className="absolute inset-x-0 mx-auto"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: "100%",
          background: "rgba(200,96,42,0.15)",
        }}
      />

      {/* Filled portion — grows as page scrolls */}
      <div
        ref={fillRef}
        className="absolute top-0"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: 1,
          height: "0%",
          background: "#c8602a",
          boxShadow: "0 0 6px rgba(200,96,42,0.5)",
        }}
      />

      {/* Section nodes */}
      {SECTIONS.map((section, i) => {
        const isActive = activeSection === section.id;
        const pct = nodeCount > 1 ? (i / (nodeCount - 1)) * 100 : 50;

        return (
          <div
            key={section.id}
            className="absolute flex items-center justify-center"
            style={{ top: `${pct}%`, transform: "translateY(-50%)" }}
          >
            {/* Pulse ring — visible only on active */}
            {isActive && (
              <span
                className="absolute rounded-full"
                style={{
                  inset: -6,
                  border: "1px solid rgba(200,96,42,0.4)",
                  animation: "orb-pulse 2.5s ease-in-out infinite",
                }}
              />
            )}

            {/* Node circle */}
            <div
              className="flex items-center justify-center rounded-full transition-all duration-400"
              style={{
                width:      isActive ? 16 : 10,
                height:     isActive ? 16 : 10,
                background: isActive ? "#c8602a" : "transparent",
                border:     isActive ? "none" : "1px solid rgba(58,69,85,0.8)",
                boxShadow:  isActive ? "0 0 10px rgba(200,96,42,0.5)" : "none",
              }}
            />

            {/* Label — only when active */}
            {isActive && (
              <span
                className="absolute font-mono text-[9px] text-terracotta"
                style={{ left: 20, whiteSpace: "nowrap" }}
              >
                {section.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Add to root layout**

In `src/app/layout.tsx`, add inside `<ReduxProvider>` before `<div className="site-bg">`:

```tsx
import { SectionThread } from "@/components/layout/SectionThread";

// inside ReduxProvider, before site-bg div
<SectionThread />
```

- [ ] **Step 3: Verify visually**

Scroll the page on desktop:
- A faint vertical line is visible at `left-6`
- A terracotta filled portion grows downward as you scroll
- The active section's node is larger, filled terracotta, with a pulsing ring and `01`–`05` label
- Inactive nodes are small, dark-bordered
- Nothing appears on mobile

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/SectionThread.tsx src/app/layout.tsx
git commit -m "feat: add continuous thread section timeline"
```

---

## Chunk 4: Avatar Asset Preparation (Manual — No Code)

> This chunk is entirely manual work outside the codebase. Complete all steps before moving to Chunk 5.

### Task 5: Generate avatar + animations

- [ ] **Step 1: Create avatar on Avaturn**

  1. Go to [avaturn.me](https://avaturn.me)
  2. Click "Try for free" → upload a selfie or build manually
  3. Customise appearance (clothing, hair, etc.)
  4. Export → download as `.glb`
  5. Save the file — we'll call it `avaturn-base.glb` for now

- [ ] **Step 2: Download animations from Mixamo**

  1. Go to [mixamo.com](https://mixamo.com) → sign in (free Adobe account)
  2. Click "Upload Character" → upload `avaturn-base.glb` → wait for auto-rig
  3. For each animation below, search, preview, then download:

  | Search term | Export settings | Rename to |
  |---|---|---|
  | `Idle` (e.g. "Breathing Idle") | FBX, **With Skin**, 30fps | `anim-idle.fbx` |
  | `Wave Hip` or `Waving Gesture` | FBX, **Without Skin**, 30fps | `anim-wave.fbx` |
  | `Typing` | FBX, **Without Skin**, 30fps | `anim-typing.fbx` |
  | `Sitting Idle` or `Sitting Cross Legged Idle` | FBX, **Without Skin**, 30fps | `anim-sitting.fbx` |

- [ ] **Step 3: Merge in Blender (~5 minutes)**

  Follow the [Avaturn + Mixamo Blender guide](https://medium.com/@harshjaiswal2001/level-up-your-portfolio-how-i-added-a-realistic-3d-avatar-using-avaturn-mixamo-blender-react-1cf81967520f):

  1. Open Blender → File → Import → FBX → import `anim-idle.fbx` (the "with skin" one — this brings in the rigged character)
  2. File → Import → FBX → import `anim-wave.fbx` (select "Automatic Bone Orientation")
  3. Repeat for `anim-typing.fbx` and `anim-sitting.fbx`
  4. In the Dope Sheet → switch to **Action Editor** → you should see 4 action tracks
  5. For each action, open **NLA Editor** → click the star icon to push to NLA strip, name it exactly:
     - `Idle`, `Wave Hip`, `Typing`, `Sitting Idle`
  6. File → Export → glTF 2.0 → set format to **glTF Binary (.glb)** → enable "Include → NLA Tracks" → export as `avatar.glb`

- [ ] **Step 4: Verify the GLB**

  Run in terminal (requires `@gltf-transform/cli`, install once with `npm i -g @gltf-transform/cli`):

  ```bash
  gltf-transform inspect public/models/avatar.glb
  ```

  Expected: output lists 4 animations: `Idle`, `Wave Hip`, `Typing`, `Sitting Idle`.

- [ ] **Step 5: Place the asset**

  ```bash
  mkdir -p public/models
  # copy avatar.glb to:
  public/models/avatar.glb
  ```

---

## Chunk 5: Avatar R3F Components

> Requires `public/models/avatar.glb` from Chunk 4.

### Task 6: AvatarModel — R3F mesh component

**Files:**
- Create: `src/components/avatar/AvatarModel.tsx`

- [ ] **Step 1: Create AvatarModel**

```tsx
// src/components/avatar/AvatarModel.tsx
"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations, ContactShadows, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type AvatarState = "default" | "coding" | "meditating" | "waving" | "traveling";

const CLIP_MAP: Record<AvatarState, string> = {
  default:    "Idle",
  coding:     "Typing",
  meditating: "Sitting Idle",
  waving:     "Wave Hip",
  traveling:  "Idle",
};

interface AvatarModelProps {
  state?: AvatarState;
  scale?: number;
  position?: [number, number, number];
}

export function AvatarModel({
  state = "default",
  scale = 1,
  position = [0, -1, 0],
}: AvatarModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/avatar.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const prevActionRef = useRef<THREE.AnimationAction | null>(null);

  // Play the correct clip when `state` changes
  useEffect(() => {
    const clipName = CLIP_MAP[state];
    const nextAction = actions[clipName];
    if (!nextAction) return;

    const prev = prevActionRef.current;
    if (prev && prev !== nextAction) {
      prev.fadeOut(0.5);
    }

    nextAction.reset().fadeIn(0.5).play();
    prevActionRef.current = nextAction;
  }, [state, actions]);

  // Advance mixer manually (needed inside R3F)
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      <primitive object={scene} />
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.3}
        scale={2}
        blur={1.5}
        color="#c8602a"
      />
      <Environment preset="city" />
    </group>
  );
}

// Preload for better UX
useGLTF.preload("/models/avatar.glb");
```

- [ ] **Step 2: Verify types**

  Run `npx tsc --noEmit` — should pass with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/avatar/AvatarModel.tsx
git commit -m "feat: add AvatarModel R3F component with animation state machine"
```

---

### Task 7: AvatarCanvas — dynamic wrapper

**Files:**
- Create: `src/components/avatar/AvatarCanvas.tsx`

- [ ] **Step 1: Create AvatarCanvas**

```tsx
// src/components/avatar/AvatarCanvas.tsx
import dynamic from "next/dynamic";
import type { AvatarState } from "./AvatarModel";

// Import Canvas dynamically to avoid SSR issues
const AvatarCanvasInner = dynamic(
  () => import("./_AvatarCanvasInner").then((m) => m.AvatarCanvasInner),
  { ssr: false, loading: () => <div className="w-full h-full" /> },
);

export function AvatarCanvas({
  state = "default",
  className,
}: {
  state?: AvatarState;
  className?: string;
}) {
  return <AvatarCanvasInner state={state} className={className} />;
}
```

- [ ] **Step 2: Create the inner canvas (needs to be a separate file for next/dynamic to work)**

```tsx
// src/components/avatar/_AvatarCanvasInner.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { AvatarModel, type AvatarState } from "./AvatarModel";

export function AvatarCanvasInner({
  state,
  className,
}: {
  state: AvatarState;
  className?: string;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1, 3], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      className={className}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Suspense fallback={null}>
        <AvatarModel state={state} />
      </Suspense>
    </Canvas>
  );
}
```

- [ ] **Step 3: Verify types**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 4: Commit**

```bash
git add src/components/avatar/AvatarCanvas.tsx src/components/avatar/_AvatarCanvasInner.tsx
git commit -m "feat: add AvatarCanvas dynamic R3F wrapper"
```

---

## Chunk 6: Avatar Placements

### Task 8: About section — avatar companion

**Files:**
- Modify: `src/components/about/AboutSection.tsx`

- [ ] **Step 1: Add avatar companion column**

Update the grid and add the avatar. Change the grid from `md:grid-cols-[2fr_3fr]` to `md:grid-cols-[2fr_3fr_1.5fr]` and add a third column after the text:

```tsx
// add import at top
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";

// change the grid div:
<div className="grid md:grid-cols-[2fr_3fr_1.5fr] gap-12 md:gap-16 items-center">

  {/* col 1 — photo (unchanged) */}
  <div className="flex justify-center md:justify-start">
    <Avatar />
  </div>

  {/* col 2 — text (unchanged) */}
  <div className="flex flex-col gap-8">
    {/* ...existing content unchanged... */}
  </div>

  {/* col 3 — avatar companion (new) */}
  <div className="hidden md:flex items-end justify-center" style={{ height: 320 }}>
    <AvatarCanvas state="default" className="w-full h-full" />
  </div>

</div>
```

- [ ] **Step 2: Verify visually**

  Scroll to About section on desktop. The 3D avatar should appear in a third column to the right, playing the idle animation. Hidden on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/components/about/AboutSection.tsx
git commit -m "feat: add 3D avatar companion to About section"
```

---

### Task 9: Contact section — meditating avatar + waving on success

**Files:**
- Modify: `src/components/contact/ContactForm.tsx`
- Modify: `src/components/contact/ContactSection.tsx`

- [ ] **Step 1: Add onSuccess callback to ContactForm**

In `ContactForm.tsx`, add `onSuccess` prop:

```tsx
interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  // ... existing code ...

  // In the onSubmit handler, after showSuccess():
  setState("success");
  showSuccess();
  onSuccess?.();   // ← add this line
```

- [ ] **Step 2: Update ContactSection to manage avatar state**

```tsx
// src/components/contact/ContactSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setActiveSection } from "@/store/slices/navigationSlice";
import { personal } from "@/data/personal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TextReveal } from "@/components/shared/TextReveal";
import { ContactForm } from "./ContactForm";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import type { AvatarState } from "@/components/avatar/AvatarModel";

export function ContactSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const dispatch     = useAppDispatch();
  const [avatarState, setAvatarState] = useState<AvatarState>("meditating");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) dispatch(setActiveSection("contact")); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [dispatch]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="container-site py-24 md:py-32"
      aria-label="Contact — The Next Step"
    >
      <div className="grid md:grid-cols-[1fr_9fr_11fr] gap-12 md:gap-16 items-start">
        {/* col 1 — avatar (desktop only) */}
        <div className="hidden md:flex items-end justify-center" style={{ height: 360 }}>
          <AvatarCanvas state={avatarState} className="w-full h-full" />
        </div>

        {/* col 2 — invitation text */}
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker="05 · The Next Step"
            title={"Let's Build\nSomething"}
          />
          <TextReveal className="flex flex-col gap-4">
            <p className="font-body text-muted-foreground leading-relaxed">
              Whether you have a project in mind, want to collaborate, or just
              want to talk craft — I&apos;d love to hear from you.
            </p>
            <a
              href={`mailto:${personal.email}`}
              className="font-mono text-sm text-terracotta hover:underline transition-all duration-200"
            >
              {personal.email}
            </a>
          </TextReveal>
        </div>

        {/* col 3 — form */}
        <div>
          <ContactForm onSuccess={() => setAvatarState("waving")} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify visually**

  Scroll to Contact. Avatar should be meditating on the left. Submit the form (use real fields). On success: form fades out, avatar switches to waving pose with a 0.5s crossfade.

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/ContactForm.tsx src/components/contact/ContactSection.tsx
git commit -m "feat: add meditating/waving avatar to Contact section"
```

---

### Task 10: Footer — meditating avatar

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add avatar to footer**

Replace the placeholder footer with a version that includes the avatar:

```tsx
"use client";

import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";

export function Footer() {
  return (
    <footer className="border-t border-border pt-12 pb-8 mt-24">
      <div className="container-site">
        {/* Avatar row */}
        <div className="flex justify-center mb-8">
          <div style={{ width: 160, height: 240 }}>
            <AvatarCanvas state="meditating" className="w-full h-full" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-semibold text-foreground">Portfolio</p>
            <p className="text-sm text-muted-foreground mt-1">Built with craft and care.</p>
          </div>
          <ul className="flex items-center gap-6" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify visually**

  Scroll to the bottom. A meditating avatar should appear centered above the footer links.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add meditating avatar to footer"
```

---

### Task 11: 404 page — coding avatar

**Files:**
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create the 404 page**

```tsx
// src/app/not-found.tsx
import Link from "next/link";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-center px-6">
      {/* Avatar */}
      <div style={{ width: 240, height: 360 }}>
        <AvatarCanvas state="coding" className="w-full h-full" />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-3 max-w-md">
        <p className="font-mono text-xs text-terracotta tracking-widest uppercase">
          404 · Page not found
        </p>
        <h1 className="font-display font-bold text-4xl text-foreground">
          Still coding this one.
        </h1>
        <p className="font-body text-muted-foreground leading-relaxed">
          This page doesn&apos;t exist yet — but give me a deadline and I&apos;ll ship it.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-terracotta text-paper font-body font-medium text-sm hover:bg-terracotta-light transition-colors duration-200"
      >
        Back to portfolio →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify visually**

  Navigate to `/anything-that-doesnt-exist`. Should see the coding avatar, 404 message, and a link back home.

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add 404 page with coding avatar"
```

---

## Done

All tasks complete. Final verification checklist:

- [ ] Scroll progress bar appears at top and fills as you scroll
- [ ] Custom cursor shows on desktop, hidden on touch
- [ ] Navbar active item highlights with section colour + slides indicator dot
- [ ] Section thread fills down left side as you scroll; active node pulses
- [ ] About section shows 3D avatar companion on desktop
- [ ] Contact section shows meditating avatar, switches to waving on form success
- [ ] Footer shows meditating avatar
- [ ] 404 page shows coding avatar
- [ ] `npx tsc --noEmit` passes clean
- [ ] No console errors in browser
