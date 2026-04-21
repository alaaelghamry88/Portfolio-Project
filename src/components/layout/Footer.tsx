"use client";

import { SocialLinks } from "@/components/ui/social-links";

const FOOTER_SOCIALS = [
  {
    name: "Github",
    image: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
    href: "https://github.com/alaaelghamry88",
  },
  {
    name: "LinkedIn",
    image: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
    href: "https://www.linkedin.com/in/alaa-elghamry7/",
  },
  {
    name: "Gmail",
    image: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png",
    href: "mailto:alaa.elghamry88@gmail.com",
  },
] as const satisfies { name: string; image: string; href: string }[];

export function Footer() {
  return (
    <footer className="mt-0 border-t border-border py-6">
      <div className="container-site flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Left — name + tagline */}
        <div>
          <p className="font-display font-semibold text-foreground">
            Portfolio
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Built with craft and care.
          </p>
        </div>

        {/* Center — social links */}
        <SocialLinks socials={FOOTER_SOCIALS} className="gap-4" />

        {/* Right — copyright */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
