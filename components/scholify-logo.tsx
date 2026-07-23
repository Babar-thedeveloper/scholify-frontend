interface ScholifyLogoProps {
  className?: string;
  showWordmark?: boolean;
  /** "white" = all-white version for dark/colored backgrounds */
  variant?: "default" | "white";
}

export function ScholifyLogo({
  className,
  showWordmark = true,
  variant = "default",
}: ScholifyLogoProps) {
  const isWhite = variant === "white";

  if (!showWordmark) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Scholify"
      >
        <rect width="64" height="64" rx="14" fill={isWhite ? "rgba(255,255,255,0.20)" : "#059669"} />
        <polygon points="32,16 50,24 32,32 14,24" fill="white" />
        <line x1="50" y1="24" x2="50" y2="36" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="39" r="3.5" fill="white" />
        <path d="M20 28 Q20 42 32 46 Q44 42 44 28" fill="white" opacity="0.88" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 190 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Scholify"
    >
      {/* Icon box- white/translucent on colored bg, brand green otherwise */}
      <rect width="48" height="48" rx="12" fill={isWhite ? "rgba(255,255,255,0.22)" : "#059669"} x="0" y="4" />
      <polygon points="24,13 40,20 24,27 8,20" fill="white" />
      <line x1="40" y1="20" x2="40" y2="31" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="40" cy="33.5" r="2.8" fill="white" />
      <path d="M14 23 Q14 34 24 37 Q34 34 34 23" fill="white" opacity="0.88" />

      {/* Wordmark */}
      <text
        x="58"
        y="27"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="-0.5"
        fill={isWhite ? "white" : undefined}
        className={isWhite ? undefined : "fill-foreground"}
      >
        Schol
        <tspan
          fill={isWhite ? "#a7f3d0" : undefined}
          className={isWhite ? undefined : "fill-primary dark:fill-[#34d399]"}
        >
          ify
        </tspan>
      </text>
      <text
        x="58"
        y="42"
        fontFamily="system-ui,-apple-system,sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="2.2"
        fill={isWhite ? "rgba(255,255,255,0.55)" : undefined}
        className={isWhite ? undefined : "fill-muted-foreground"}
      >
        SCHOLIFY.PK
      </text>
    </svg>
  );
}
