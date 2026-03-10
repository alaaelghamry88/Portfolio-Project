/**
 * Shared GSAP animation constants.
 * Used across all animation components for a cohesive motion identity.
 */

export const SIGNATURE_EASE = "power3.out" as const;
export const SIGNATURE_EASE_IN = "power3.in" as const;
export const SIGNATURE_EASE_INOUT = "power3.inOut" as const;
export const SIGNATURE_DURATION = 0.8; // seconds — default for most transitions
export const STAGGER_DELAY = 0.06; // seconds — between staggered elements

export const HERO_EASE = "power4.out" as const;
export const HERO_DURATION = 1.5;

export const ELASTIC_EASE = "elastic.out(1, 0.5)" as const;

/** CSS cubic-bezier mirror of power3.out for non-GSAP transitions */
export const CSS_SIGNATURE_EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
