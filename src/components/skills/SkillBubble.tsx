"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/skill";
import { SKILL_ICONS } from "./icons";

const BUBBLE_SIZE = 48;

export { BUBBLE_SIZE };

interface Props {
  skill: Skill;
  size?: number;
  accentColor?: string;
}

function abbr(name: string): string {
  const words = name.split(/[\s/.]+/);
  if (words.length === 1) return name.slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function SkillBubble({ skill, size = BUBBLE_SIZE, accentColor = "#c8602a" }: Props) {
  const [hovered, setHovered] = useState(false);
  const Icon = SKILL_ICONS[skill.name];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-full",
          "transition-all duration-200 ease-out cursor-default select-none",
        )}
        style={{
          width: size,
          height: size,
          background: "#2a3240",
          border: hovered ? `1.5px solid ${accentColor}` : "1.5px solid #3a4555",
          boxShadow: hovered ? `0 0 20px ${accentColor}44` : "none",
          transform: hovered ? "scale(1.2)" : "scale(1)",
        }}
      >
        {Icon ? (
          <Icon size={Math.round(size * 0.45)} />
        ) : (
          <span className="font-mono font-bold" style={{ fontSize: size * 0.28, color: accentColor }}>
            {abbr(skill.name)}
          </span>
        )}
      </div>
      {hovered && (
        <div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="bg-steel border border-border rounded-md px-2 py-1">
            <span className="font-mono text-[10px] text-foreground">{skill.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
