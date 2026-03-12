"use client";

import { useEffect, useRef } from "react";
import type { Skill } from "@/types/skill";
import { SkillBubble, BUBBLE_SIZE } from "./SkillBubble";

interface Props {
  radius: number;
  skills: Skill[];
  speed: number;
  direction: "cw" | "ccw";
  color: "inner" | "outer";
  isPausedRef: React.MutableRefObject<boolean>;
  canvasSize: number;
}

export function OrbitRing({
  radius,
  skills,
  speed,
  direction,
  color,
  isPausedRef,
  canvasSize,
}: Props) {
  const frameRef    = useRef<number>(0);
  const angleRef    = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const bubblesRef  = useRef<(HTMLDivElement | null)[]>([]);

  const ringColor   = color === "inner" ? "#c8602a" : "#60a5fa";
  const borderAlpha = color === "inner" ? "55"     : "44";
  const glowAlpha   = color === "inner" ? "22"     : "18";
  const glowSize    = color === "inner" ? 30       : 40;

  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  useEffect(() => {
    const sign          = direction === "cw" ? 1 : -1;
    const angularSpeed  = (sign * 2 * Math.PI) / speed;
    const total         = skills.length;
    const halfBubble    = BUBBLE_SIZE / 2;

    const tick = (now: number) => {
      if (!isPausedRef.current) {
        const delta = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
        angleRef.current += angularSpeed * delta;

        bubblesRef.current.forEach((el, i) => {
          if (!el) return;
          const θ  = angleRef.current + (i / total) * Math.PI * 2;
          const bx = radius + radius * Math.cos(θ) - halfBubble;
          const by = radius + radius * Math.sin(θ) - halfBubble;
          el.style.transform = `translate(${bx}px, ${by}px)`;
        });
      }

      lastTimeRef.current = now;
      frameRef.current    = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [direction, speed, skills.length, radius, isPausedRef]);

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width:  radius * 2,
        height: radius * 2,
        left:   cx - radius,
        top:    cy - radius,
        border: `1px solid ${ringColor}${borderAlpha}`,
        boxShadow: `0 0 ${glowSize}px ${ringColor}${glowAlpha}`,
      }}
    >
      {skills.map((skill, i) => (
        <div
          key={skill.name}
          ref={(el) => { bubblesRef.current[i] = el; }}
          className="absolute pointer-events-auto"
          style={{ top: 0, left: 0, transform: "translate(0px, 0px)" }}
        >
          <SkillBubble skill={skill} size={BUBBLE_SIZE} accentColor={ringColor} />
        </div>
      ))}
    </div>
  );
}
