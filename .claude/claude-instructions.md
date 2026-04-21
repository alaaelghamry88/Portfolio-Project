# Copilot Instructions — Alaa Elghamry Portfolio

## Design Context

### Users

The primary visitor is a **recruiter or hiring manager doing a 90-second scan**. They are skimming for signal, not reading. They have many portfolios open in tabs and will leave if the first screen does not justify the next scroll.

- **Their context:** time-pressured, on a laptop, rarely on mobile. Evaluating many candidates in a session.
- **Their job-to-be-done:** answer in under two minutes — *"is this person senior, innovative, and worth a conversation?"* — and reach a way to contact Alaa without friction.
- **The one action we want:** contact Alaa about a hiring opportunity. Every section should make this action feel inevitable, not buried. The contact CTA must be reachable from any scroll position (persistent nav) and must close the page with conviction.

### Brand Personality

Three words: **Expressive · Innovative · Smooth**.

- **Expressive** — the work speaks confidently. Large type, declarative statements, no timid hedging. Craft shows in detail density, not volume.
- **Innovative** — visibly modern technique: shader backgrounds, 3D, interactive motion. The tooling itself is part of the message. Reads as *"this person is on the current edge of the web."*
- **Smooth** — no jarring transitions, no visual hiccups. Lenis-level scroll smoothness is the baseline; every interaction should feel continuous and deliberate.

**Emotional target (first 5 seconds):** impressed, slightly intimidated. The visitor should think *"oh — this isn't a template,"* and sit up a little straighter before scrolling.

**Emotional target (full session):** respect that settles into confidence in the person behind it. Intimidation softens as they move through the narrative, but the high-craft signal never drops.

### Aesthetic Direction

**Vibe:** Current AI-era product aesthetic — think Anthropic, Vercel AI SDK marketing pages, Linear, Cursor. Sharp, technical, generative, monospace-accented.Keep the *warm steel + terracotta* palette (that still works), drop the *meditation / slow-breathing* language.

**Theme:** Dark-first. "Warm Steel" (`#1a1e24` background, `#f5f0e8` paper text, `#c8602a` terracotta accent). Light theme stays reserved for project case-study sub-pages.

**Seamless canvas:** The **ambient *feel*** of the hero carries site-wide — the warm-steel background color, the grain overlay, and the corner vignettes persist behind every section. The live WebGL shader animation **stays hero-only** (it's performance-heavy and its drama belongs to the arrival moment). Downstream sections get the atmosphere without the motion. No section dividers, no background-color swaps between sections — let typography, spacing, and the numbered kickers do the sectioning work.

**References to chase:**
- Anthropic (anthropic.com) — editorial restraint, warm palette, confident typography.
- Vercel AI SDK pages — generative backgrounds, mono kickers, technical confidence.
- Linear / Cursor / Rauno Freiberg — motion discipline, micro-interactions, monospace detail.

**Anti-references — what this must NOT look like:**
- **Not another dev portfolio.** No "Hi, I'm X, I'm a full-stack developer" template. No generic skill-grid + timeline + card-list layout. If a visitor can tell in 2 seconds that this was built from a portfolio template, the design has failed.
- No playful / bouncy / cartoonish animation (bounces, wiggles, confetti).
- No cold blue-black tech aesthetic — the palette is warm steel, never GitHub-dark.

### Design Principles

Every design decision on this project should pass through these five:

1. **Answer the 90-second scan first.** The visitor leaves on a timer. Hero + primary CTA + one proof of seriousness must land above the fold. Secondary depth (case studies, skills, personality easter eggs) rewards the scroll but never gates the contact action.
2. **Craft is the argument.** Motion quality, type fit, alignment precision, and transition smoothness are the portfolio's thesis — not the words. If a detail wouldn't survive a senior design review, it doesn't ship.
3. **One continuous atmosphere.** Background color, grain, and vignettes persist site-wide so sections feel like beats in one canvas, not separate boxes. The hero's live shader animation stays hero-only — downstream sections inherit the *vibe*, not the motion. Seamless > sectioned.
4. **Motion has intent, not ornament.** Every animation serves attention (reveal, emphasis, spatial orientation, feedback). No motion for motion's sake. Reduced-motion users get a **simplified but still present** experience — key reveals keep their character, ambient motion quiets down. Never a flat static fallback.
5. **Innovative, not experimental.** Use current-era technique (shaders, R3F, Spline, scroll-pinning) with production polish. If a technique doesn't hold up at 60fps on a mid-tier laptop, cut it — novelty is not worth jank. Smoothness is non-negotiable.

### Accessibility

- **Target:** WCAG 2.2 AA. Color contrast, keyboard reachability, focus-visible rings, semantic landmarks, skip-link (already in `globals.css`).
- **Reduced motion:** when `prefers-reduced-motion: reduce` is set — simplified but still present. Signature reveals stay (shortened, no stagger); ambient breathing/parallax/shader scroll-warp pause. Never a flat static fallback — the visitor should still perceive this as a crafted site.
- **Color-blindness:** terracotta accent must never be the *only* signal — pair with weight, position, or mono-kicker context.
