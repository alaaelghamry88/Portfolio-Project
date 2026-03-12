export type SkillCategory =
  | "frontend"
  | "animation"
  | "backend"
  | "tools"
  | "design";

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Icon name from lucide-react or path to custom SVG */
  icon?: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  /** Which orbit ring to place this skill in (Skills section) */
  orbit?: "inner" | "outer";
}
