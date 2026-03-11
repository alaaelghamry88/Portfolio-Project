# Animation System (GSAP)

---

## Global Setup

Plugins registered once in `GSAPProvider.tsx` at the layout level:

```ts
// components/layout/GSAPProvider.tsx
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({
  ease: "power3.out",
  duration: 0.8,
});
```

Lenis smooth scroll is wired to GSAP's ticker in `SmoothScroll.tsx`:

```ts
gsap.ticker.add((time) => lenis.raf(time * 1000));
lenis.on("scroll", ScrollTrigger.update);
```

---

## Constants (`lib/animations.ts`)

```ts
export const SIGNATURE_EASE = "power3.out";       // Default for most transitions
export const SIGNATURE_EASE_IN = "power3.in";
export const SIGNATURE_DURATION = 0.8;            // seconds
export const STAGGER_DELAY = 0.06;               // seconds between staggered elements

export const HERO_EASE = "power4.out";            // High-drama hero entrances
export const HERO_DURATION = 1.5;                // seconds
export const ELASTIC_EASE = "elastic.out(1, 0.5)"; // 3D model entrance
export const CSS_SIGNATURE_EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
```

---

## Custom Hooks

### `useGSAPContext` (planned — `hooks/useGSAPContext.ts`)
Scopes all animations to a ref and handles cleanup:

```ts
export function useGSAPContext(callback, deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => callback(ctx), ref);
    return () => ctx.revert();
  }, deps);
  return ref;
}
```

**Current practice:** Components use `useGSAP` from `@gsap/react` directly with a `scope` ref. `useGSAPContext` is a convenience wrapper for the same pattern.

### `useScrollTrigger` (`hooks/useScrollTrigger.ts`)
Thin wrapper that creates a ScrollTrigger instance and handles cleanup on unmount.

### `usePrefersReducedMotion` (`hooks/usePrefersReducedMotion.ts`)
Listens to `(prefers-reduced-motion: reduce)` media query. All animated components check this before running any GSAP timeline — if true, content is shown statically.

### `useMousePosition` (`hooks/useMousePosition.ts`)
Returns `{ x, y, normalizedX, normalizedY }`. Used for 3D model mouse tilt and Spotlight glow.

---

## Animation Inventory

### Page Load — Hero Entrance Timeline

| Step | Element          | From                   | To          | Duration | Easing         | Delay |
|------|------------------|------------------------|-------------|----------|----------------|-------|
| 0.0s | ShaderBackground | `opacity: 0`           | `opacity: 1`| 1.0s     | `power2.out`   | 0     |
| 0.3s | Scene (R3F)      | `scale: 0`             | `scale: 1`  | 1.2s     | `elastic.out(1, 0.5)` | 0.3s |
| 0.3s | Spotlight glow   | fade in                | opacity 1   | 0.9s     | `power3.out`   | 0.3s |
| 0.5s | Kicker text      | `y: 8, opacity: 0`     | rest        | 0.5s     | `power3.out`   | 0.5s |
| 0.6s | Title chars      | `y: 110%, opacity: 0`  | rest        | 0.75s    | `power4.out`   | 0.6s + `0.035s` stagger per char |
| 0.9s | Subtitle         | `y: 24, opacity: 0`    | rest        | 0.7s     | `power3.out`   | 0.9s |
| 1.1s | CTA buttons      | `y: 16, opacity: 0`    | rest        | 0.6s     | `power3.out`   | 1.1s |
| 1.8s | HeroDataBar      | `y: 24, opacity: 0`    | rest        | 0.8s     | `power3.out`   | 1.8s |
| 1.8s | ScrollIndicator  | `opacity: 0`           | `opacity: 1`| 0.8s     | `power2.out`   | 1.8s (then loops) |

**Title character split:** Manual DOM: `innerHTML = chars.map(c => <span style="display:inline-block">)`. Each `<span>` animates independently. Accessibility: `prefers-reduced-motion` bypasses split and fades in the full text.

### On Scroll — Hero ScrollTrigger

| Trigger   | Target           | Effect                               | Scrub |
|-----------|------------------|--------------------------------------|-------|
| Scroll past hero | Left content column | `y: -8% of viewport`, `opacity: 0.7` | 1    |
| Scroll past hero | ShaderBackground | Color shifts cooler (40% blend to Deep Steel) | — (RAF-driven via scrollProgressRef) |

**`scrollProgressRef` pattern:** A `useRef` (not state) fed to the WebGL shader each frame via `requestAnimationFrame`. Avoids React re-renders — WebGL reads the ref directly in the render loop.

### Section Animations (Phase 3+)

| Animation              | Trigger           | Method                  | Duration | Easing       |
|------------------------|-------------------|-------------------------|----------|--------------|
| Section heading reveal | Scroll into view  | `ScrollTrigger`         | 0.8s     | `power3.out` |
| Kicker entrance        | Scroll into view  | `ScrollTrigger`         | 0.5s     | `power3.out` |
| Text line-by-line      | Scroll into view  | `ScrollTrigger.batch()` | 0.6s     | `power3.out` |
| Project card clip-path | Scroll (pinned)   | `scrub: 1`              | scrubbed | linear       |
| Skill cards stagger    | Scroll into view  | `ScrollTrigger.batch()` | 0.5s     | `power3.out` |
| Avatar float in        | Scroll into view  | `from` left             | 0.8s     | `power3.out` |

### Interaction Animations (Phase 4–5)

| Animation       | Trigger     | Method      | Duration | Easing       |
|-----------------|-------------|-------------|----------|--------------|
| Hover card lift | Mouse enter | `to`        | 0.3s     | `power2.out` |
| Magnetic button | Mouse move  | `quickTo`   | 0.5s     | `power3.out` |
| Custom cursor   | Mouse move  | `quickTo`   | 0.3s     | `power3.out` |
| Navbar bg       | Scroll past hero | `ScrollTrigger` | 0.3s | `power2.out` |
| Active nav link | Section change | `quickTo` underline | 0.4s | `power3.out` |
| Page transition | Route change | GSAP timeline | 0.6s   | `power3.inOut` |

---

## Specific Implementations

### Projects Horizontal Scroll Pin

```ts
ScrollTrigger.create({
  trigger: projectsSectionRef.current,
  start: "top top",
  end: () => `+=${totalScrollWidth}`,
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    gsap.set(projectsTrackRef.current, {
      x: -self.progress * totalScrollWidth,
    });
  },
});
```

### Magnetic Button

```ts
const xTo = gsap.quickTo(buttonRef.current, "x", { duration: 0.5, ease: "power3.out" });
const yTo = gsap.quickTo(buttonRef.current, "y", { duration: 0.5, ease: "power3.out" });

onMouseMove: (e) => {
  const rect = buttonRef.current.getBoundingClientRect();
  xTo(e.clientX - rect.left - rect.width / 2);
  yTo(e.clientY - rect.top - rect.height / 2);
};
onMouseLeave: () => { xTo(0); yTo(0); };
```

### Custom Cursor

```ts
const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.3, ease: "power3.out" });
const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.3, ease: "power3.out" });
// Trailing ring: longer duration for lag effect
const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.6, ease: "power3.out" });
```

### Zen Mode Speed Reduction
Redux `themeSlice` stores `animationSpeed: 1 | 0.5`. Components multiply all durations by this value:

```ts
const { animationSpeed } = useAppSelector((s) => s.theme);
gsap.to(el, { duration: SIGNATURE_DURATION * animationSpeed, ... });
```

---

## Performance Rules

- Animate only `transform` and `opacity` — GPU-composited, no layout thrash.
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- `will-change: transform` — sparingly, only on elements about to animate.
- ScrollTrigger `scrub` for pinned sections (not raw `onScroll`).
- On mobile: simpler easing, fewer staggered elements, shorter durations.
- Always check `usePrefersReducedMotion()` — show content statically if true.
- Pause shader `requestAnimationFrame` when hero is off-screen (IntersectionObserver).

---

## Custom Text Splitter

If not using GSAP SplitText plugin:

```ts
// lib/splitText.ts
export function splitTextIntoSpans(element: HTMLElement, type: "chars" | "words") {
  const text = element.textContent || "";
  if (type === "chars") {
    element.innerHTML = text
      .split("")
      .map((c) => `<span class="char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`)
      .join("");
  }
  return element.querySelectorAll(`.${type.slice(0, -1)}`);
}
```

`HeroText.tsx` currently implements character splitting inline within the `useGSAP` scope.
