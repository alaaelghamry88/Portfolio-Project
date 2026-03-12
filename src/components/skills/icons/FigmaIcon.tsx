export function FigmaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="2" width="14" height="8" rx="4" fill="#F24E1E" />
      <rect x="5" y="10" width="7" height="7" rx="3.5" fill="#A259FF" />
      <circle cx="16" cy="13.5" r="3.5" fill="#1ABCFE" />
      <rect x="5" y="17" width="7" height="5" rx="2.5" fill="#0ACF83" />
    </svg>
  );
}
