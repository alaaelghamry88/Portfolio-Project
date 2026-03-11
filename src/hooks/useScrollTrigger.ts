"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface UseScrollTriggerOptions {
  /** Called with a ScrollTrigger instance once it's created */
  onEnter?: () => void;
  onLeave?: () => void;
  /** Start trigger, e.g. "top 80%" */
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

/**
 * Thin wrapper around ScrollTrigger for use with a ref'd element.
 *
 * @example
 * const ref = useScrollTrigger<HTMLDivElement>({ onEnter: () => playAnimation() });
 * return <section ref={ref} />;
 */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollTriggerOptions = {},
) {
  const {
    onEnter,
    onLeave,
    start = "top 80%",
    end = "bottom top",
    scrub,
    pin,
    markers,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      scrub,
      pin,
      markers,
      onEnter,
      onLeave,
    });

    return () => st.kill();
  }, [start, end, scrub, pin, markers, onEnter, onLeave]);

  return ref;
}
