"use client";

import { SocialLinks } from "@/components/ui/social-links";

const socials = [
  {
    name: "Instagram",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
    href: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=200&q=80",
    href: "https://www.linkedin.com",
  },
  {
    name: "Spotify",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80",
    href: "https://open.spotify.com",
  },
  {
    name: "TikTok",
    image:
      "https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&w=200&q=80",
    href: "https://www.tiktok.com",
  },
];

export function SocialLinksDemo() {
  return (
    <main className="relative flex min-h-screen w-full items-start justify-center px-4 py-10 md:items-center">
      <SocialLinks socials={socials} />
    </main>
  );
}

export function SocialLinksCustomGap() {
  return (
    <main className="relative flex min-h-screen w-full items-start justify-center px-4 py-10 md:items-center">
      <SocialLinks socials={socials.slice(0, 2)} className="gap-4" />
    </main>
  );
}

export default {
  SocialLinksDemo,
  SocialLinksCustomGap,
};

