export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease: string;
  stagger?: number;
}

export type CursorVariant = "default" | "hover" | "click" | "text";

export type ThemeMode = "dark" | "light" | "zen";
