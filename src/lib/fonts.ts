/**
 * Font configuration.
 *
 * All three fonts are loaded via CSS @import in globals.css (CDN approach for dev).
 *
 * For production, self-host with next/font/local:
 *
 *   Clash Display — https://www.fontshare.com/fonts/clash-display
 *     Files: ClashDisplay-{Regular,Medium,Semibold,Bold}.woff2 → /public/fonts/
 *
 *   Satoshi — https://www.fontshare.com/fonts/satoshi
 *     Files: Satoshi-{Regular,Medium,Bold}.woff2 → /public/fonts/
 *
 *   JetBrains Mono — via @fontsource/jetbrains-mono or next/font/google
 *
 * CSS variables defined in globals.css @theme:
 *   --font-display  →  "Clash Display", system-ui, sans-serif
 *   --font-body     →  "Satoshi", system-ui, sans-serif
 *   --font-mono     →  "JetBrains Mono", monospace
 */

export const FONT_DISPLAY = '"Clash Display", system-ui, sans-serif';
export const FONT_BODY = '"Satoshi", system-ui, sans-serif';
export const FONT_MONO = '"JetBrains Mono", monospace';
