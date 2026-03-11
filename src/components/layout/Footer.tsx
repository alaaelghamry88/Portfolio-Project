"use client";

// Placeholder — full implementation in Phase 4
// Will include: avatar easter egg, social links, travel coordinates

import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-24">
      <div className="container-site flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left — name + tagline */}
        <div>
          <p className="font-display font-semibold text-foreground">
            Portfolio
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Built with craft and care.
          </p>
        </div>

        {/* Center — nav links */}
        <ul className="flex items-center gap-6" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — copyright */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
