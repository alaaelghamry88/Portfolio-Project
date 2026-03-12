"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className, strength = 0.3 }: Props) {
  const ref   = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  const isTouch = useMediaQuery("(hover: none)");

  const { contextSafe } = useGSAP(
    () => {
      if (!ref.current) return;
      xToRef.current = gsap.quickTo(ref.current, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      yToRef.current = gsap.quickTo(ref.current, "y", {
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { scope: ref },
  );

  // eslint-disable-next-line react-hooks/refs
  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !xToRef.current || !yToRef.current) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xToRef.current(x * strength);
    yToRef.current(y * strength);
  });

  // eslint-disable-next-line react-hooks/refs
  const handleMouseLeave = contextSafe(() => {
    xToRef.current?.(0);
    yToRef.current?.(0);
  });

  if (isTouch) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
