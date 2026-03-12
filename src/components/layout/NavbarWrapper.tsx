"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/projects/")) return null;
  return <Navbar />;
}
