"use client";

import { useState, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
  /** Normalised to -1 → 1 relative to viewport center */
  normalizedX: number;
  normalizedY: number;
}

/**
 * Tracks the cursor position. Useful for parallax and the custom cursor.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return position;
}
