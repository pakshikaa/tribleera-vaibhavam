import { MotifTone, MotifVariant } from "@/types";
import { cn } from "@/lib/utils/cn";

/**
 * TRIBLEERA's signature visual device.
 *
 * Real vendor photography arrives once Cloudinary/S3 storage is wired up
 * on the backend. Until then, every image slot in this product renders a
 * piece of branded heritage motif art instead of a grey placeholder box —
 * so the "no photo yet" state is a deliberate part of the design language,
 * not a missing asset. Swap <MotifArt> for <Image src={vendor.imageUrl} />
 * the moment real photos exist; every card already accepts an optional
 * `imageUrl` prop and falls back to this automatically.
 */

const TONE_MAP: Record<MotifTone, { from: string; to: string; line: string; wash: string }> = {
  burgundy: { from: "#7A1F3D", to: "#3F0F22", line: "#D4AF6A", wash: "#E8B4B8" },
  gold: { from: "#C99A4F", to: "#8C6526", line: "#FAF7F2", wash: "#7A1F3D" },
  rose: { from: "#D89AA0", to: "#A85F67", line: "#FAF7F2", wash: "#7A1F3D" },
  slate: { from: "#283447", to: "#121823", line: "#D4AF6A", wash: "#E8B4B8" },
};

function MotifGlyph({ variant, stroke }: { variant: MotifVariant; stroke: string }) {
  const common = {
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (variant) {
    case "knot":
      return (
        <g opacity={0.85} {...common}>
          <path d="M100 60 C70 60 70 90 100 100 C130 110 130 140 100 140" />
          <path d="M100 60 C130 60 130 90 100 100 C70 110 70 140 100 140" />
          <circle cx="100" cy="60" r="3" fill={stroke} stroke="none" />
          <circle cx="100" cy="140" r="3" fill={stroke} stroke="none" />
        </g>
      );
    case "arch":
      return (
        <g opacity={0.85} {...common}>
          <path d="M65 150 V100 C65 70 80 50 100 50 C120 50 135 70 135 100 V150" />
          <path d="M78 150 V102 C78 82 88 66 100 66 C112 66 122 82 122 102 V150" />
          <line x1="55" y1="150" x2="145" y2="150" />
        </g>
      );
    case "lotus":
      return (
        <g opacity={0.85} {...common}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * Math.PI) / 3;
            const x = 100 + Math.cos(angle) * 30;
            const y = 100 + Math.sin(angle) * 30;
            return <ellipse key={i} cx={x} cy={y} rx="14" ry="28" transform={`rotate(${(i * 60)} ${x} ${y})`} />;
          })}
          <circle cx="100" cy="100" r="8" fill={stroke} stroke="none" />
        </g>
      );
    case "paisley":
      return (
        <g opacity={0.85} {...common}>
          <path d="M100 55 C130 55 145 80 135 105 C128 122 108 122 100 110 C92 98 100 85 112 90 C122 94 122 105 113 108" />
          <circle cx="100" cy="60" r="2.5" fill={stroke} stroke="none" />
        </g>
      );
    case "diya":
      return (
        <g opacity={0.85} {...common}>
          <path d="M60 115 C60 135 78 148 100 148 C122 148 140 135 140 115 C140 108 130 108 122 112 C112 116 88 116 78 112 C70 108 60 108 60 115 Z" />
          <path d="M100 100 C94 88 96 76 100 68 C104 76 106 88 100 100 Z" fill={stroke} stroke="none" opacity={0.9} />
        </g>
      );
    case "garland":
      return (
        <g opacity={0.85} {...common}>
          <path d="M55 80 C80 110 120 110 145 80" />
          {[0, 1, 2, 3, 4].map((i) => {
            const t = i / 4;
            const x = 55 + (145 - 55) * t;
            const y = 80 + Math.sin(Math.PI * t) * 30;
            return <circle key={i} cx={x} cy={y + 4} r="5" />;
          })}
        </g>
      );
  }
}

export function MotifArt({
  variant,
  tone,
  seed = 0,
  className,
  label,
}: {
  variant: MotifVariant;
  tone: MotifTone;
  seed?: number;
  className?: string;
  label?: string;
}) {
  const c = TONE_MAP[tone];
  const gradId = `mg-${tone}-${variant}-${seed}`;
  const blobId = `mb-${tone}-${variant}-${seed}`;
  // Deterministic "randomness" so the same vendor always renders the same art.
  const offset = (seed * 37) % 40;

  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={label ?? "Decorative heritage motif"}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
        <radialGradient id={blobId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={c.wash} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.wash} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${gradId})`} />
      <circle cx={40 + offset} cy={30 + offset / 2} r="70" fill={`url(#${blobId})`} />
      <circle cx={170 - offset / 2} cy={175} r="60" fill={`url(#${blobId})`} />
      <g transform={`translate(0, ${(offset % 10) - 5})`}>
        <MotifGlyph variant={variant} stroke={c.line} />
      </g>
    </svg>
  );
}
