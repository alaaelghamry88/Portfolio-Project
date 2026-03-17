# Interactive Sound System — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add synthesized Web Audio API sound feedback (hover shimmer, click tap, section transitions, form focus/success) to the portfolio with a navbar mute toggle.

**Architecture:** A plain `SoundEngine` TypeScript class owns the `AudioContext` and all synthesis logic. A `SoundProvider` React context wraps the app and exposes `{ sound, muted, toggleMute }`. Components consume `useSound()` and attach fire-and-forget calls to event handlers.

**Tech Stack:** Web Audio API (native browser), React context + `useRef`, Lucide icons (already installed), Next.js App Router (`"use client"`)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/sound-engine.ts` | Create | AudioContext lifecycle, oscillator synthesis, mute via masterGain |
| `src/components/layout/SoundProvider.tsx` | Create | React context, muted state, localStorage persistence, reduced-motion default |
| `src/hooks/useSound.ts` | Create | One-liner context consumer hook |
| `src/app/layout.tsx` | Modify | Add `<SoundProvider>` to provider chain |
| `src/components/layout/Navbar.tsx` | Modify | Add mute toggle button (Volume2/VolumeX icon) |
| `src/components/shared/MagneticButton.tsx` | Modify | Add `onMouseEnter`/`onMouseDown` sounds to wrapper `<div>` |
| `src/components/projects/ProjectCard.tsx` | Modify | Wrap `<Link>` in `<div>` with hover/click sounds |
| `src/components/skills/SkillBubble.tsx` | Modify | Add `sound.hover()` to existing `onMouseEnter` |
| `src/components/experience/ExperienceItem.tsx` | Modify | Add `sound.click()` to accordion trigger button |
| `src/components/contact/ContactForm.tsx` | Modify | Add `sound.formFocus()` to inputs, `sound.formSuccess()` alongside `showSuccess()` |
| `src/components/hero/HeroSection.tsx` | Modify | Add `sound.transition()` in GSAP entrance `onStart` |
| `src/components/about/AboutSection.tsx` | Modify | Add `sound.transition()` to ScrollTrigger `onEnter` (if present) |
| `src/components/experience/ExperienceSection.tsx` | Modify | Add `sound.transition()` to ScrollTrigger `onEnter` (if present) |
| `src/components/projects/ProjectsSection.tsx` | Modify | Add `sound.transition()` to ScrollTrigger `onEnter` (if present) |
| `src/components/skills/SkillsSection.tsx` | Modify | Add `sound.transition()` to ScrollTrigger `onEnter` (if present) |
| `src/components/contact/ContactSection.tsx` | Modify | Add `sound.transition()` to ScrollTrigger `onEnter` (if present) |

---

## Task 1: SoundEngine class

**Files:**
- Create: `src/lib/sound-engine.ts`

- [ ] **Step 1: Create the file with the full SoundEngine class**

```ts
// src/lib/sound-engine.ts

/**
 * SoundEngine — Web Audio API synthesis engine.
 * No React dependencies. Instantiated once via SoundProvider.
 *
 * AudioContext is created lazily on the first sound call (browser autoplay policy
 * requires a user gesture before AudioContext can produce sound).
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted = true; // default muted until SoundProvider sets it

  // ─── AudioContext lifecycle ────────────────────────────────────────────────

  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx;

    this.ctx = new AudioContext();
    // Safari on background tabs may start suspended — force running
    void this.ctx.resume();

    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    // Apply current muted state to the freshly created gain node
    this.masterGain.gain.setValueAtTime(
      this._muted ? 0 : 1,
      this.ctx.currentTime,
    );

    return this.ctx;
  }

  // ─── Mute control ─────────────────────────────────────────────────────────

  setMuted(muted: boolean): void {
    this._muted = muted;
    if (!this.ctx || !this.masterGain) return;
    // Use setValueAtTime — direct .value assignment can be ignored by browsers
    // when an automation curve is scheduled on the param
    this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────

  /**
   * Spawn a self-destructing oscillator with a linear attack then exponential decay.
   * @param freq      Frequency in Hz
   * @param peak      Peak gain (attack target)
   * @param attackMs  Attack duration in milliseconds
   * @param decayMs   Decay duration in milliseconds
   * @param startAt   AudioContext time to start (default: now)
   */
  private play(
    freq: number,
    peak: number,
    attackMs: number,
    decayMs: number,
    startAt?: number,
  ): void {
    const ctx = this.ensureContext();
    const master = this.masterGain!;
    const now = startAt ?? ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type      = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attackMs / 1000);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + attackMs / 1000 + decayMs / 1000,
    );

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + attackMs / 1000 + decayMs / 1000);
    // Self-destruct: disconnect after the oscillator ends
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  // ─── Public sound methods ──────────────────────────────────────────────────

  /** Subtle high shimmer on mouse enter — 900 Hz sine, 8 ms attack, 120 ms decay */
  hover(): void {
    this.play(900, 0.04, 8, 120);
  }

  /** Crystal tap on click — root (440 Hz) + perfect fifth (660 Hz), 5 ms attack, 280 ms decay */
  click(): void {
    this.play(440, 0.05, 5, 280);
    this.play(660, 0.04, 5, 280);
  }

  /**
   * Ascending glass arpeggio on section entrance.
   * Three sine tones staggered 80 ms apart: 330 → 440 → 550 Hz.
   * Each sustains through its own 500 ms decay independently.
   */
  transition(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    this.play(330, 0.06, 20, 500, now);
    this.play(440, 0.06, 20, 500, now + 0.08);
    this.play(550, 0.06, 20, 500, now + 0.16);
  }

  /** Soft input focus ping — 660 Hz, 10 ms attack, 180 ms decay */
  formFocus(): void {
    this.play(660, 0.03, 10, 180);
  }

  /** Resolving major chord on successful form submit — 330 + 440 + 550 Hz simultaneously */
  formSuccess(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    this.play(330, 0.05, 30, 700, now);
    this.play(440, 0.05, 30, 700, now);
    this.play(550, 0.05, 30, 700, now);
  }
}
```

- [ ] **Step 2: Verify the file compiles (no TypeScript errors)**

Run: `npx tsc --noEmit`
Expected: no errors referencing `sound-engine.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/sound-engine.ts
git commit -m "feat: add SoundEngine Web Audio API synthesis class"
```

---

## Task 2: SoundProvider + useSound hook

**Files:**
- Create: `src/components/layout/SoundProvider.tsx`
- Create: `src/hooks/useSound.ts`

The provider is `"use client"`. It reads `usePrefersReducedMotion()` (existing hook at `src/hooks/usePrefersReducedMotion.ts`) for the default muted state, then reads `localStorage["sound-muted"]` in a `useEffect` (never in the component body — localStorage is not available during SSR).

- [ ] **Step 1: Create SoundProvider**

```tsx
// src/components/layout/SoundProvider.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { SoundEngine } from "@/lib/sound-engine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SoundContextValue {
  sound: SoundEngine;
  muted: boolean;
  toggleMute: () => void;
}

// Fallback for components rendered outside SoundProvider (e.g. Storybook, tests)
// SoundEngine defaults to muted=true so no audio plays accidentally
const defaultEngine = new SoundEngine();
const SoundContext = createContext<SoundContextValue>({
  sound: defaultEngine,
  muted: true,
  toggleMute: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef(new SoundEngine());
  const prefersReduced = usePrefersReducedMotion();

  // Default: muted if OS prefers reduced motion
  const [muted, setMuted] = useState<boolean>(prefersReduced);

  // Post-mount: override with persisted localStorage preference
  // IMPORTANT: must be in useEffect — localStorage throws during SSR
  useEffect(() => {
    const stored = localStorage.getItem("sound-muted");
    if (stored !== null) {
      const wasMuted = stored === "true";
      setMuted(wasMuted);
      engineRef.current.setMuted(wasMuted);
    } else {
      // No stored preference — apply the reduced-motion default
      engineRef.current.setMuted(prefersReduced);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem("sound-muted", String(next));
    engineRef.current.setMuted(next);
  };

  return (
    <SoundContext.Provider value={{ sound: engineRef.current, muted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext(): SoundContextValue {
  return useContext(SoundContext);
}
```

- [ ] **Step 2: Create useSound hook**

```ts
// src/hooks/useSound.ts
"use client";

export { useSoundContext as useSound } from "@/components/layout/SoundProvider";
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/SoundProvider.tsx src/hooks/useSound.ts
git commit -m "feat: add SoundProvider context and useSound hook"
```

---

## Task 3: Wire SoundProvider into layout

**Files:**
- Modify: `src/app/layout.tsx`

The current provider chain is: `ReduxProvider → GSAPProvider → SmoothScroll`. Insert `SoundProvider` between `GSAPProvider` and `SmoothScroll`.

- [ ] **Step 1: Add the import and wrap**

In `src/app/layout.tsx`, add the import alongside the other layout component imports:

```ts
import { SoundProvider } from "@/components/layout/SoundProvider";
```

The actual JSX tree (from reading the file) is:
```
ReduxProvider > GSAPProvider > SectionThread + SmoothScroll > NavbarWrapper, main, Footer, Toaster
```

Wrap `SmoothScroll` and its children with `SoundProvider`. Use these exact unique strings to locate the insertion points:

**Opening — find this exact 3-line sequence:**
```tsx
            <SmoothScroll>
              <NavbarWrapper />
              <main id="main-content">{children}</main>
```

**Replace with:**
```tsx
            <SoundProvider>
            <SmoothScroll>
              <NavbarWrapper />
              <main id="main-content">{children}</main>
```

**Closing — find this exact 3-line sequence:**
```tsx
              <Toaster />
            </SmoothScroll>
          </GSAPProvider>
```

**Replace with:**
```tsx
              <Toaster />
            </SmoothScroll>
            </SoundProvider>
          </GSAPProvider>
```

- [ ] **Step 2: Verify dev server starts without errors**

Run: `npm run dev`
Expected: no compilation errors, app loads normally. Open browser console — no `AudioContext` or `localStorage` errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire SoundProvider into app layout"
```

---

## Task 4: Mute toggle in Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

The Navbar already imports from `lucide-react`. Add `Volume2` and `VolumeX` to the import, then add the toggle button at the right end of the `<nav>` pill.

- [ ] **Step 1: Add Lucide imports and useSound**

At the top of `src/components/layout/Navbar.tsx`, add to the existing lucide import line:

```ts
import { Briefcase, FolderKanban, User, Code2, Mail, Volume2, VolumeX } from "lucide-react";
```

Add the hook import below the other imports:

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Consume the hook in Navbar**

Inside `export function Navbar()`, after the existing state declarations, add:

```ts
const { muted, toggleMute } = useSound();
```

- [ ] **Step 3: Add the toggle button to the nav pill**

In the JSX, find the closing `</ul>` of the nav items list, then add the button after it (before the closing `</nav>`):

```tsx
          </ul>

          {/* Sound mute toggle */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Enable sound" : "Mute sound"}
            className="ml-1 p-1.5 rounded-xl text-[#a89f90] hover:text-[#e8895a] transition-colors duration-200"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
```

- [ ] **Step 4: Add hover and click sounds to FlipItem nav links**

`FlipItem` renders a `motion.div` with `whileHover="hover"`. The spec requires both hover and click sounds on nav links. Pass both as props — this avoids calling hooks inside a nested function component.

Update `FlipItem`'s interface to add `onHover` and `onItemClick`:

```ts
function FlipItem({
  item,
  isActive,
  className,
  labelClassName,
  onHover,
  onItemClick,
}: {
  item: NavItem;
  isActive: boolean;
  className?: string;
  labelClassName?: string;
  onHover?: () => void;
  onItemClick?: () => void;
}) {
```

Update the `motion.div` to wire both events:

```tsx
<motion.div
  className="block rounded-xl overflow-visible group relative"
  style={{ perspective: "600px" }}
  whileHover="hover"
  initial="initial"
  onMouseEnter={onHover}
  onClick={onItemClick}
>
```

In `Navbar`, destructure `sound` from `useSound()` and pass both props to each `FlipItem`. Update the `useSound()` line from Step 2:

```tsx
const { muted, toggleMute, sound } = useSound();
```

Pass both callbacks to `FlipItem`:

```tsx
<FlipItem
  item={item}
  isActive={activeLabel === item.label}
  className="px-2.5 py-1.5 text-sm sm:px-3"
  labelClassName="hidden sm:inline font-body font-medium"
  onHover={() => sound.hover()}
  onItemClick={() => sound.click()}
/>
```

- [ ] **Step 5: Verify in browser**

Start dev server. Open the portfolio. The speaker icon should appear in the navbar pill. Click it — icon toggles. Refresh — state is restored. Hover a nav item — faint high shimmer. Click a nav item — crystal tap chord.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add mute toggle, hover, and click sounds to Navbar"
```

---

## Task 5: MagneticButton sounds

**Files:**
- Modify: `src/components/shared/MagneticButton.tsx`

Attach sounds to the wrapper `<div>` that already has `onMouseMove`/`onMouseLeave`. Do not add props to the `MagneticButton` API.

- [ ] **Step 1: Import useSound**

Add to `src/components/shared/MagneticButton.tsx`:

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Consume sound inside the component**

Inside `MagneticButton`, after the existing hooks:

```ts
const { sound } = useSound();
```

- [ ] **Step 3: Add event handlers to the wrapper div**

Find the `<div>` that has `onMouseMove` and `onMouseLeave`:

```tsx
<div
  ref={ref}
  className={cn("inline-block", className)}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
>
```

Add `onMouseEnter` and `onMouseDown`:

```tsx
<div
  ref={ref}
  className={cn("inline-block", className)}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  onMouseEnter={() => sound.hover()}
  onMouseDown={() => sound.click()}
>
```

- [ ] **Step 4: Verify in browser**

Hover the "Send it →" button in the Contact section (it uses `MagneticButton`). You should hear a faint shimmer. Click it — you should hear the crystal tap chord.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/MagneticButton.tsx
git commit -m "feat: add hover and click sounds to MagneticButton"
```

---

## Task 6: ProjectCard sounds

**Files:**
- Modify: `src/components/projects/ProjectCard.tsx`

Both `FeaturedCard` and `StandardCard` use `<Link>` as the root element. Wrap the `<Link>` in a `<div>` that captures `onMouseEnter` and `onMouseDown`. The wrapper div must not break the existing layout — pass `className` and `style` to the wrapper, not the Link.

- [ ] **Step 1: Import useSound**

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Update FeaturedCard**

Inside `FeaturedCard`, add:

```ts
const { sound } = useSound();
```

Wrap the returned `<Link>` in a sound-capturing div. Move `className`, `style`, and `data-card` to the outer wrapper; the `Link` gets a fixed className.

**IMPORTANT about `group`:** The original `<Link>` had `"group"` on it. Move it to the wrapper `<div>` instead — descendants using `group-hover:` (like the play-button overlay at `opacity-0 group-hover:opacity-100`) will still work because CSS group-hover matches any ancestor with the `group` class, not just the immediate parent.

```tsx
return (
  <div
    className={cn("group block rounded-2xl overflow-hidden", className)}
    style={style}
    onMouseEnter={() => sound.hover()}
    onMouseDown={() => sound.click()}
  >
    <Link
      href={`/projects/${project.slug}`}
      data-card={dataCard}
      className={cn(
        "block h-full rounded-2xl overflow-hidden bg-card",
        "border border-terracotta/50",
        "transition-transform duration-300 ease-out",
        "hover:border-terracotta",
      )}
      aria-label={`View case study: ${project.title}`}
    >
      {/* ... rest of FeaturedCard JSX unchanged — keep all video/image/content divs exactly as they are ... */}
    </Link>
  </div>
);
```

- [ ] **Step 3: Update StandardCard** with the same pattern

```tsx
const { sound } = useSound();

return (
  <div
    className={className}
    style={{ minHeight: "280px", ...style }}
    onMouseEnter={() => sound.hover()}
    onMouseDown={() => sound.click()}
  >
    <Link
      href={`/projects/${project.slug}`}
      data-card={dataCard}
      className={cn(
        "group block rounded-2xl overflow-hidden relative h-full",
        "border border-border",
        "transition-transform duration-300 ease-out",
        "hover:border-terracotta/60",
      )}
      aria-label={`View project: ${project.title}`}
    >
      {/* ... rest of StandardCard JSX unchanged ... */}
    </Link>
  </div>
);
```

- [ ] **Step 4: Verify in browser**

Navigate to the Projects section. Hover a project card — shimmer sound. Click — crystal tap.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/ProjectCard.tsx
git commit -m "feat: add hover and click sounds to ProjectCard"
```

---

## Task 7: SkillBubble sounds

**Files:**
- Modify: `src/components/skills/SkillBubble.tsx`

`SkillBubble` already has `onMouseEnter={() => setHovered(true)}`. Append `sound.hover()` to that handler.

- [ ] **Step 1: Import useSound**

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Consume and add to existing handler**

Inside `SkillBubble`, add:

```ts
const { sound } = useSound();
```

Update the `onMouseEnter` handler on the outer `<div>`:

```tsx
onMouseEnter={() => { setHovered(true); sound.hover(); }}
```

- [ ] **Step 3: Verify in browser**

Navigate to the Skills section. Hover a skill bubble — shimmer sound.

- [ ] **Step 4: Commit**

```bash
git add src/components/skills/SkillBubble.tsx
git commit -m "feat: add hover sound to SkillBubble"
```

---

## Task 8: ExperienceItem accordion click sound

**Files:**
- Modify: `src/components/experience/ExperienceItem.tsx`

The accordion trigger is the `<button onClick={onToggle}>` at line 90. Add `sound.click()` alongside the existing `onToggle` call.

- [ ] **Step 1: Import useSound**

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Consume inside the component**

`ExperienceItem` is a `forwardRef` component. Add inside the function body (after the existing hooks):

```ts
const { sound } = useSound();
```

- [ ] **Step 3: Update the button's onClick**

Find the trigger button:

```tsx
<button
  onClick={onToggle}
  ...
>
```

Replace with:

```tsx
<button
  onClick={() => { sound.click(); onToggle(); }}
  ...
>
```

- [ ] **Step 4: Verify in browser**

Navigate to the Experience section. Click an accordion item — crystal tap sound plays, accordion opens.

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/ExperienceItem.tsx
git commit -m "feat: add click sound to ExperienceItem accordion trigger"
```

---

## Task 9: ContactForm sounds

**Files:**
- Modify: `src/components/contact/ContactForm.tsx`

Two sounds: `formFocus()` on each input/textarea focus, `formSuccess()` alongside `showSuccess()` in the submit handler.

- [ ] **Step 1: Import useSound**

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Consume inside ContactForm**

```ts
const { sound } = useSound();
```

- [ ] **Step 3: Add formSuccess call in onSubmit**

Find this block in `onSubmit`:

```ts
setState("success");
showSuccess();
```

Replace with:

```ts
setState("success");
sound.formSuccess();
showSuccess();
```

- [ ] **Step 4: Add formFocus to each input and textarea**

Each input uses `{...register("name")}` which spreads react-hook-form props (including `onBlur`). Add `onFocus` explicitly — it will not conflict with register's spread since register does not set `onFocus`.

For the name input:

```tsx
<input
  id="name"
  type="text"
  placeholder="Your name"
  className={inputClass}
  disabled={isLoading}
  onFocus={() => sound.formFocus()}
  {...register("name")}
/>
```

For the email input:

```tsx
<input
  id="email"
  type="email"
  placeholder="your@email.com"
  className={inputClass}
  disabled={isLoading}
  onFocus={() => sound.formFocus()}
  {...register("email")}
/>
```

For the message textarea:

```tsx
<textarea
  id="message"
  rows={5}
  placeholder="What are you working on?"
  className={cn(inputClass, "resize-none")}
  disabled={isLoading}
  onFocus={() => sound.formFocus()}
  {...register("message")}
/>
```

- [ ] **Step 5: Verify in browser**

Open the Contact section. Click each input — soft ping. Fill and submit the form — resolving chord plays when success state shows.

- [ ] **Step 6: Commit**

```bash
git add src/components/contact/ContactForm.tsx
git commit -m "feat: add formFocus and formSuccess sounds to ContactForm"
```

---

## Task 10: HeroSection entrance transition sound

**Files:**
- Modify: `src/components/hero/HeroSection.tsx`

The hero entrance GSAP animation runs inside `useGSAP` when `preloaderDone` becomes true. Add `sound.transition()` in the `onStart` callback of the content entrance tween.

- [ ] **Step 1: Import useSound**

```ts
import { useSound } from "@/hooks/useSound";
```

- [ ] **Step 2: Create a stable sound ref**

`useGSAP` callbacks close over refs and state at registration time. To ensure the sound engine is always current, use a ref:

Inside `HeroSection`, after existing state declarations:

```ts
const { sound } = useSound();
const soundRef = useRef(sound);
soundRef.current = sound; // keep current on every render
```

- [ ] **Step 3: Add onStart to the content entrance tween**

Find this existing tween inside `useGSAP` (the `prefersReduced` else branch):

```ts
// Content drifts up into place
gsap.fromTo(contentEl,
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.15 },
);
```

Replace with:

```ts
// Content drifts up into place
gsap.fromTo(contentEl,
  { opacity: 0, y: 24 },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.15,
    onStart: () => soundRef.current.transition(),
  },
);
```

- [ ] **Step 4: Verify in browser**

Hard refresh the page (Ctrl+Shift+R). After the preloader exits, the hero entrance should play the ascending glass arpeggio once. Subsequent soft reloads (which skip the preloader via sessionStorage) will not replay it.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero/HeroSection.tsx
git commit -m "feat: add transition sound to HeroSection entrance animation"
```

---

## Task 11: Section ScrollTrigger entrance transition sounds

**Files:**
- Modify: `src/components/about/AboutSection.tsx`
- Modify: `src/components/experience/ExperienceSection.tsx`
- Modify: `src/components/projects/ProjectsSection.tsx`
- Modify: `src/components/skills/SkillsSection.tsx`
- Modify: `src/components/contact/ContactSection.tsx`

Each section that uses GSAP `ScrollTrigger` with an `onEnter` callback should call `sound.transition()` when it enters the viewport. The transition sound plays the ascending glass arpeggio once per scroll-into-view.

**Pattern to apply in each section file:**

- [ ] **Step 1: Read each section file to find its ScrollTrigger usage**

Open each file and search for `ScrollTrigger` or `onEnter`. Not every section may have one — skip any that don't use ScrollTrigger with an `onEnter` callback. Only wire sound to sections that already have a ScrollTrigger `onEnter`.

- [ ] **Step 2: For each section that has a ScrollTrigger onEnter, add the sound**

Add the import at the top of the file:

```ts
import { useSound } from "@/hooks/useSound";
```

Inside the component, add a stable sound ref (same pattern as HeroSection — needed because GSAP callbacks are closures):

```ts
const { sound } = useSound();
const soundRef = useRef(sound);
soundRef.current = sound;
```

In the existing ScrollTrigger `onEnter` callback, add the call:

```ts
onEnter: () => {
  soundRef.current.transition();
  // ... existing onEnter code unchanged ...
},
```

If the `onEnter` callback is empty or non-existent, add it:

```ts
onEnter: () => soundRef.current.transition(),
```

**Note:** Only trigger `transition()` once. If the ScrollTrigger has `once: true` already, perfect. If not, the transition sound fires every time the section enters the viewport — this is acceptable behaviour.

- [ ] **Step 3: Verify in browser**

Scroll down through all sections. Each section entrance should play the ascending glass arpeggio as it comes into view.

- [ ] **Step 4: Commit**

```bash
git add src/components/about/AboutSection.tsx \
        src/components/experience/ExperienceSection.tsx \
        src/components/projects/ProjectsSection.tsx \
        src/components/skills/SkillsSection.tsx \
        src/components/contact/ContactSection.tsx
git commit -m "feat: add transition sounds to section ScrollTrigger entrances"
```

---

## Task 12: Final verification pass

- [ ] **Step 1: Run a full type check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run dev build**

Run: `npm run build`
Expected: build succeeds with no errors

- [ ] **Step 3: Manual browser checklist**

Open the dev build (`npm run dev`), unmute using the navbar speaker icon, then verify each of the following:

| Action | Expected sound |
|---|---|
| Hover a navbar link | Faint high shimmer (900 Hz) |
| Click a navbar link | Crystal tap chord (440+660 Hz) |
| Hover the speaker (mute) icon | No sound (it's a plain button, not wired) |
| Toggle mute off then on, refresh | Preference persists across reload |
| Hover MagneticButton (Contact form submit) | Shimmer |
| Click MagneticButton | Crystal tap |
| Hover a project card | Shimmer |
| Click a project card | Crystal tap + navigate |
| Hover a skill bubble | Shimmer |
| Click an experience accordion item | Crystal tap + accordion opens |
| Focus any contact form input | Soft ping (660 Hz) |
| Submit the contact form successfully | Resolving chord (330+440+550 Hz together) |
| Hard refresh — hero entrance | Ascending arpeggio (330→440→550 Hz staggered) |
| Scroll each section into view | Ascending arpeggio plays on entrance |

- [ ] **Step 4: Final commit (if any cleanup was done)**

```bash
git add -p
git commit -m "chore: interactive sound system final cleanup"
```
