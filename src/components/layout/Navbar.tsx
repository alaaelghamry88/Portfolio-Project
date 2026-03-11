"use client";

// Placeholder — full implementation in Phase 4
// Will include: scroll-aware background, active section indicator, mobile menu

import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={cn(
          "container-site flex items-center justify-between py-5",
          "transition-all duration-300 ease-signature",
        )}
        aria-label="Main navigation"
      >
        {/* Logo / Name */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground hover:text-terracotta transition-colors duration-200"
        >
          Portfolio
        </Link>

        {/* Nav links — desktop */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger — placeholder */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Open menu"
          aria-expanded={false}
        >
          <span className="block w-6 h-px bg-foreground" />
          <span className="block w-4 h-px bg-foreground" />
          <span className="block w-6 h-px bg-foreground" />
        </button>
      </nav>
    </header>
  );
}
