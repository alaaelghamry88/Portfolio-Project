"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Briefcase, FolderKanban, User, Code2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const SECTION_TO_NAV: Record<string, string> = {
  about:      "About",
  experience: "Experience",
  projects:   "Projects",
  skills:     "Skills",
  contact:    "Contact",
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "#about",      label: "About",      icon: <User      className="h-4 w-4" /> },
  { href: "#experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { href: "#projects",   label: "Projects",   icon: <FolderKanban className="h-4 w-4" /> },
  { href: "#skills",     label: "Skills",     icon: <Code2     className="h-4 w-4" /> },
  { href: "#contact",    label: "Contact",    icon: <Mail      className="h-4 w-4" /> },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover:   { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover:   { rotateX: 0,  opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale:   { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type:      "spring" as const,
  stiffness: 100,
  damping:   20,
  duration:  0.5,
};

const TERRACOTTA_GLOW =
  "radial-gradient(circle, rgba(200,96,42,0.22) 0%, rgba(200,96,42,0.06) 50%, rgba(200,96,42,0) 100%)";

// ─── Shared flip item ─────────────────────────────────────────────────────────

function FlipItem({
  item,
  isActive,
  className,
  labelClassName,
}: {
  item: NavItem;
  isActive: boolean;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <motion.div
      className="block rounded-xl overflow-visible group relative"
      style={{ perspective: "600px" }}
      whileHover="hover"
      initial="initial"
    >
      {/* Terracotta radial glow — same for every item */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none rounded-xl"
        variants={glowVariants}
        style={{ background: TERRACOTTA_GLOW, opacity: 0 }}
      />

      {/* Front face */}
      <motion.a
        href={item.href}
        className={cn(
          "flex items-center gap-1.5 relative z-10 rounded-xl transition-colors",
          isActive ? "text-terracotta" : "text-[#a89f90]",
          className,
        )}
        variants={itemVariants}
        transition={sharedTransition}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
      >
        <span className="transition-colors duration-300 group-hover:text-terracotta">
          {item.icon}
        </span>
        <span className={labelClassName}>{item.label}</span>
      </motion.a>

      {/* Back face */}
      <motion.a
        href={item.href}
        className={cn(
          "flex items-center gap-1.5 absolute inset-0 z-10 rounded-xl",
          "text-[#a89f90] transition-colors",
          className,
        )}
        variants={backVariants}
        transition={sharedTransition}
        style={{
          transformStyle:  "preserve-3d",
          transformOrigin: "center top",
          transform:       "rotateX(90deg)",
        }}
      >
        <span className="transition-colors duration-300 group-hover:text-terracotta">
          {item.icon}
        </span>
        <span className={labelClassName}>{item.label}</span>
      </motion.a>
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useAppSelector((s) => s.navigation.activeSection);
  const activeLabel   = SECTION_TO_NAV[activeSection] ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-2xl",
          "bg-[#1a1e24]/85 backdrop-blur-xl",
          "border border-[#3a4555]/70",
          "transition-shadow duration-500",
          scrolled
            ? "shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(58,69,85,0.4)]"
            : "shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
        )}
        aria-label="Main navigation"
      >
        {/* Logo mark */}
        <a
          href="#hero"
          className="flex items-center gap-2 px-3 py-1.5 mr-1 rounded-xl group"
        >
          <span className="font-display text-sm font-semibold text-[#f5f0e8] tracking-tight group-hover:text-terracotta transition-colors duration-200">
            AE
          </span>
          <span className="w-px h-3 bg-[#3a4555]" />
          <span className="hidden sm:inline font-mono text-[11px] text-[#a89f90] tracking-[0.12em] uppercase">
            Portfolio
          </span>
        </a>

        {/* Nav items */}
        <ul className="flex items-center gap-0.5" role="list">
          {navItems.map((item) => (
            <li key={item.label} className="relative flex flex-col items-center">
              <FlipItem
                item={item}
                isActive={activeLabel === item.label}
                className="px-2.5 py-1.5 text-sm sm:px-3"
                labelClassName="hidden sm:inline font-body font-medium"
              />
              <AnimatePresence>
                {activeLabel === item.label && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 rounded-full bg-terracotta"
                    style={{ width: 16, height: 2 }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
