import type { ComponentType } from "react";
import { ReactIcon }      from "./ReactIcon";
import { NextjsIcon }     from "./NextjsIcon";
import { TypeScriptIcon } from "./TypeScriptIcon";
import { TailwindIcon }   from "./TailwindIcon";
import { NodejsIcon }     from "./NodejsIcon";
import { FigmaIcon }      from "./FigmaIcon";
import { ThreejsIcon }     from "./ThreejsIcon";
import { GitIcon }        from "./GitIcon";

export type IconComponent = ComponentType<{ size?: number }>;

export const SKILL_ICONS: Record<string, IconComponent> = {
  "React":          ReactIcon,
  "Next.js":        NextjsIcon,
  "TypeScript":     TypeScriptIcon,
  "Tailwind CSS":   TailwindIcon,
  "Node.js":        NodejsIcon,
  "Figma":          FigmaIcon,
  "Three.js / R3F": ThreejsIcon,
  "Git / Vercel":   GitIcon,
};
