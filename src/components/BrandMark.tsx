/**
 * Oasis Orchard Stack mark: a sprout growing from a stack of layers.
 * Inline SVG so it inherits the theme accent and needs no network request.
 */
export function BrandMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="64" height="64" rx="16" fill="var(--bg-card)" />
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        rx="15.25"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      {/* Sprout: the orchard */}
      <path
        d="M32 30 V20"
        stroke="var(--accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M32 24.5 C26.5 24.5 22.5 21 22.5 15.5 C28 15.5 32 19 32 24.5 Z"
        fill="var(--accent)"
      />
      <path
        d="M32 21.5 C32 15.5 35.8 11 42 11 C42 17 37.8 21.5 32 21.5 Z"
        fill="var(--accent)"
      />
      {/* Layers: the stack */}
      <path d="M32 29 L47 36.5 L32 44 L17 36.5 Z" fill="var(--text)" />
      <path
        d="M17 42.5 L32 50 L47 42.5"
        fill="none"
        stroke="var(--text)"
        strokeOpacity="0.75"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 48.5 L32 56 L47 48.5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Simplified maple leaf, drawn symmetric about the centre line. */
export function MapleLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1.5 L13.5 4.4 L15.3 3.5 L14.7 8.1 L17.1 5.7 L17.8 7.3 L20.6 6.8 L19.7 9.8 L21.2 10.6 L17 14.2 L17.5 15.9 L12.6 15.2 L12.7 21.5 L11.3 21.5 L11.4 15.2 L6.5 15.9 L7 14.2 L2.8 10.6 L4.3 9.8 L3.4 6.8 L6.2 7.3 L6.9 5.7 L9.3 8.1 L8.7 3.5 L10.5 4.4 Z"
      />
    </svg>
  );
}
