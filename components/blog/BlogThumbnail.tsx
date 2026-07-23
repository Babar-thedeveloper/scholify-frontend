// ─────────────────────────────────────────────────────────────
// BlogThumbnail - deterministic, dependency-free SVG cover art for
// blog posts. No image files needed: the thumbnail is generated
// from the post title + category, using the Scholify emerald
// palette so every card stays on-brand (green only).
// ─────────────────────────────────────────────────────────────

// Small deterministic hash so each post gets a stable, distinct
// (but still emerald) gradient without random flicker.
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Emerald-family gradient stops. Kept intentionally within the green
// range - no purple/orange - matching the hero.
const PALETTES: [string, string, string][] = [
  ["#10b981", "#059669", "#065f46"],
  ["#34d399", "#10b981", "#047857"],
  ["#059669", "#047857", "#064e3b"],
  ["#2dd4bf", "#10b981", "#065f46"],
];

/** Break a title into up to 3 balanced lines for the SVG. */
function wrap(title: string, maxChars = 20, maxLines = 3): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
      if (lines.length === maxLines - 1) {
        current = words.slice(words.indexOf(word)).join(" ");
        break;
      }
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, maxLines);
}

interface Props {
  title: string;
  category?: string;
  className?: string;
  /** Hide the wrapped title text (e.g. when used purely as a banner). */
  compact?: boolean;
}

export function BlogThumbnail({ title, category = "Article", className, compact }: Props) {
  const h = hash(title + category);
  const [c1, c2, c3] = PALETTES[h % PALETTES.length];
  const gid = `bg-${h.toString(36)}`;
  const lines = wrap(title);

  return (
    <svg
      viewBox="0 0 1200 630"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="55%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill={`url(#${gid})`} />

      {/* decorative glow blobs */}
      <circle cx="1050" cy="90" r="230" fill="#ffffff" opacity="0.10" />
      <circle cx="180" cy="560" r="200" fill="#000000" opacity="0.08" />
      {/* dotted grid accent */}
      <g fill="#ffffff" opacity="0.14">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={840 + c * 42} cy={430 + r * 34} r="3.5" />
          ))
        )}
      </g>

      {/* category pill */}
      <g>
        <rect x="72" y="80" rx="26" ry="26" width={category.length * 15 + 60} height="52" fill="#ffffff" opacity="0.18" />
        <text x="102" y="114" fill="#ffffff" fontFamily="system-ui, sans-serif" fontSize="26" fontWeight="600" letterSpacing="1">
          {category.toUpperCase()}
        </text>
      </g>

      {/* title */}
      {!compact &&
        lines.map((line, i) => (
          <text
            key={i}
            x="72"
            y={250 + i * 84}
            fill="#ffffff"
            fontFamily="system-ui, sans-serif"
            fontSize="70"
            fontWeight="800"
          >
            {line}
          </text>
        ))}

      {/* wordmark */}
      <text x="72" y="570" fill="#ffffff" fontFamily="system-ui, sans-serif" fontSize="34" fontWeight="800" opacity="0.95">
        Scholify
      </text>
      <text x="220" y="570" fill="#ffffff" fontFamily="system-ui, sans-serif" fontSize="28" fontWeight="500" opacity="0.8">
        · scholify.pk
      </text>
    </svg>
  );
}
