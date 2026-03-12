import type { Metadata } from "next";
import { ReduxProvider } from "@/store/provider";
import { GSAPProvider } from "@/components/layout/GSAPProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Frontend Developer & Design Engineer",
    template: "%s | Portfolio",
  },
  description:
    "Portfolio of a frontend developer crafting bold, expressive digital experiences with React, Next.js, and motion design.",
  keywords: [
    "frontend developer",
    "design engineer",
    "React",
    "Next.js",
    "GSAP",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * `dark` class is set here for the default dark theme.
     * The theme slice and a ThemeWatcher component (Phase 5) will toggle
     * this dynamically when the user switches theme or triggers zen mode.
     */
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        {/* Accessibility: skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="site-bg">
          <ReduxProvider>
            <GSAPProvider>
              <SmoothScroll>
                <NavbarWrapper />
                <main id="main-content">{children}</main>
                <Footer />
                <Toaster />
              </SmoothScroll>
            </GSAPProvider>
          </ReduxProvider>
        </div>
      </body>
    </html>
  );
}
