# Interactive Sound System — Design Spec

**Date:** 2026-03-17
**Project:** Alaa Elghamry's Portfolio — "The Craftsman's Journal"
**Status:** Approved

---

## Overview

Add synthesized interactive sound feedback to the portfolio. All sounds are generated programmatically via the Web Audio API (no audio files). The character is **ethereal/glassy** — soft sine-wave tones with quick attack and smooth decay, like crystal or glass bowls. A navbar mute toggle gives users explicit control, and `prefers-reduced-motion` is respected as a default-muted signal.

---

## Architecture

### `src/lib/sound-engine.ts`

A plain TypeScript class — no React dependencies.

**Responsibilities:**
- Lazily create an `AudioContext` on the first call to any sound method (satisfies browser autoplay policy — AudioContext must be created after a user gesture)
- Expose five public synthesis methods: `hover()`, `click()`, `transition()`, `formFocus()`, `formSuccess()`
- Own a `masterGain` node (connected between all oscillators and the destination) — controlling its gain is the mute mechanism
- Each method creates a short-lived oscillator → individual gain node → masterGain → destination, then self-destructs via `oscillator.onended`

**AudioContext lifecycle:**
- `AudioContext` is `null` until first call to any sound method
- Created once, reused for all subsequent sounds
- Immediately after creation, call `ctx.resume()` to guarantee `running` state (some browsers, notably Safari on background tabs, create the context in `suspended` state)
- `masterGain` is created immediately after AudioContext and connected to `destination`

**Mute mechanism:**
- Use `masterGain.gain.setValueAtTime(value, ctx.currentTime)` (not direct `.value =` assignment) when muting/unmuting
- Direct `.value =` assignment can be silently ignored by browsers when an automation curve is scheduled on the param

### `src/components/layout/SoundProvider.tsx`

A `"use client"` React context provider wrapping the app.

**Responsibilities:**
- Instantiate `SoundEngine` once (via `useRef`)
- Read `usePrefersReducedMotion()` (existing hook) to set initial `muted` state
- Read `localStorage.getItem("sound-muted")` to restore persisted preference — **this read must happen inside `useEffect` only** (post-mount), never in the component body or a `useState` initializer, as `localStorage` is not available during SSR and will throw `ReferenceError`
- Expose `{ sound: SoundEngine, muted: boolean, toggleMute: () => void }` via React context
- On `toggleMute`: flip muted state, persist to `localStorage["sound-muted"]`, call `soundEngine.setMuted(nextMuted)` which internally uses `masterGain.gain.setValueAtTime(...)`

**Context shape:**
```ts
interface SoundContextValue {
  sound: SoundEngine;
  muted: boolean;
  toggleMute: () => void;
}

// Default context value (for components outside provider — no-op stubs)
const defaultContext: SoundContextValue = {
  sound: new SoundEngine(),
  muted: true,
  toggleMute: () => {},
};
```

### `src/hooks/useSound.ts`

```ts
export function useSound(): SoundContextValue {
  return useContext(SoundContext); // returns defaultContext if used outside provider
}
```

### Layout wiring

`SoundProvider` is added to `src/app/layout.tsx` inside the existing provider chain:

```
ReduxProvider → GSAPProvider → SoundProvider → SmoothScroll → children
```

---

## Sound Design

All sounds use sine wave oscillators with manual ADSR gain envelopes (attack ramp + exponential decay). Sound methods are **fire-and-forget** — attach them to `onMouseEnter` (not `onMouseMove`) to avoid per-pixel oscillator proliferation.

| Method | Trigger | Frequency | Attack | Decay | Notes |
|---|---|---|---|---|---|
| `hover()` | Mouse enters interactive element | 900 Hz | 8 ms | 120 ms | Single sine, gain 0.04 — barely-there shimmer |
| `click()` | Mouse down on buttons/cards/links | 440 Hz + 660 Hz | 5 ms | 280 ms | Two oscillators (root + perfect fifth) — crystal tap |
| `transition()` | Section entrance (GSAP `onStart`) | 330 → 440 → 550 Hz | 20 ms each | 500 ms each | Ascending arpeggio — start times: `currentTime`, `currentTime + 0.08`, `currentTime + 0.16`; each sustains through its own 500 ms decay independently; gain 0.06 each |
| `formFocus()` | Input/textarea `focus` event | 660 Hz | 10 ms | 180 ms | Soft single ping, gain 0.03 |
| `formSuccess()` | Form submit success callback | 330 + 440 + 550 Hz simultaneously | 30 ms | 700 ms | Resolving major chord, all three start together, gain 0.05 each |

**Gain values are intentionally low** — the sounds are texture, not notification. They should be felt more than heard.

---

## Integration Points

| Component | File | Sound(s) | Notes |
|---|---|---|---|
| `MagneticButton` | `src/components/shared/MagneticButton.tsx` | `hover()` on `onMouseEnter`, `click()` on `onMouseDown` | Attach directly on the wrapper `<div>` inside `MagneticButton.tsx`, alongside the existing `onMouseMove`/`onMouseLeave` handlers. Do not add sound props to the `MagneticButton` API. |
| `Navbar` links | `src/components/layout/Navbar.tsx` | `hover()` on `onMouseEnter`, `click()` on `onClick` | |
| `ProjectCard` | `src/components/projects/ProjectCard.tsx` | `hover()` on `onMouseEnter`, `click()` on `onMouseDown` | Cards use `<Link>` as root — attach `onMouseDown` to a wrapper `<div>` over the `<Link>`, not on the `<Link>` itself |
| `SkillBubble` | `src/components/skills/SkillBubble.tsx` | `hover()` on `onMouseEnter` | |
| `ExperienceItem` | `src/components/experience/ExperienceItem.tsx` | `click()` on the accordion trigger button's `onClick` | Integration is in `ExperienceItem`, not `ExperienceAccordion` — the trigger `<button>` lives in `ExperienceItem` |
| `ContactForm` inputs | `src/components/contact/ContactForm.tsx` | `formFocus()` on input/textarea `onFocus`, `formSuccess()` on successful submit | Call `sound.formSuccess()` immediately alongside `showSuccess()` in the `onSubmit` handler — not inside a GSAP `onComplete` callback |
| `HeroSection` entrance | `src/components/hero/HeroSection.tsx` | `transition()` called once in GSAP timeline `onStart` | |
| Section entrances | Individual section components | `transition()` in existing GSAP ScrollTrigger `onEnter` callbacks | |

---

## Mute Toggle

**Location:** Right side of `Navbar`, before (or alongside) existing nav items.

**Icons:** Lucide `Volume2` (unmuted) / `VolumeX` (muted) — available via the existing Lucide dependency.

**Behavior:**
- Default: muted if `prefers-reduced-motion: reduce` is detected or `localStorage["sound-muted"] === "true"`; localStorage read happens in `useEffect` post-mount only
- On click: toggles muted state, persists to `localStorage["sound-muted"]`
- Styling: `text-muted-foreground` by default, `text-[var(--color-accent)]` (terracotta) on hover — matches existing navbar aesthetics

**First-gesture unlock:**
The Web Audio API requires a user gesture before AudioContext can produce sound. `SoundEngine` creates its `AudioContext` lazily on the first call to any sound method (hover, click, etc.) — not on the mute toggle. The AudioContext is guaranteed to exist before sounds play because any interaction that triggers a sound is itself a user gesture.

---

## Constraints & Non-Goals

- **No audio files** — all synthesis via Web Audio API oscillators
- **No reverb/convolver** — keeps the implementation lightweight; the ethereal quality comes from sine purity and gain shaping alone
- **No spatial audio** — mono output, no panning
- **Not wired to scroll events** — sounds only on discrete user interactions, not continuous scroll position
- **Preloader is silent** — sounds begin after preloader exits (first user interaction happens post-preload anyway)

---

## Files to Create

- `src/lib/sound-engine.ts` — new
- `src/components/layout/SoundProvider.tsx` — new
- `src/hooks/useSound.ts` — new

## Files to Modify

- `src/app/layout.tsx` — add `SoundProvider` to provider chain
- `src/components/layout/Navbar.tsx` — add mute toggle
- `src/components/shared/MagneticButton.tsx` — add hover/click sounds
- `src/components/projects/ProjectCard.tsx` — add hover/click sounds
- `src/components/skills/SkillBubble.tsx` — add hover sound
- `src/components/experience/ExperienceItem.tsx` — add click sound to accordion trigger
- `src/components/contact/ContactForm.tsx` — add formFocus/formSuccess sounds
- `src/components/hero/HeroSection.tsx` — add transition sound
- Section components with GSAP ScrollTrigger — add transition sound to `onEnter`
