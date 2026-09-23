"use client";

import { useId } from "react";

type LighthouseMarkProps = {
  size?: number;
  withBeam?: boolean;
  className?: string;
};

/** Minimalist lighthouse glyph used across the site as the brand mark. */
export function LighthouseMark({ size = 32, withBeam = false, className }: LighthouseMarkProps) {
  const clipId = useId();
  const width = withBeam ? size * 2.2 : size;

  return (
    <svg
      width={width}
      height={size}
      viewBox={withBeam ? "0 0 70 44" : "0 0 32 44"}
      className={className}
      role="img"
      aria-label="Lighthouse"
    >
      {withBeam && (
        <path
          d="M22 9 L68 -6 L68 24 Z"
          fill="var(--amber)"
          opacity="0.22"
        />
      )}
      <clipPath id={clipId}>
        <path d="M13 14 L19 14 L24 40 L8 40 Z" />
      </clipPath>
      <path d="M11 6 L21 6 L16 0 Z" fill="var(--abyss)" />
      <rect x="11" y="6" width="10" height="6" rx="1" fill="var(--amber)" />
      <rect x="9" y="12" width="14" height="2" fill="var(--abyss)" />
      <path d="M13 14 L19 14 L24 40 L8 40 Z" fill="var(--pine)" />
      <rect x="6" y="24" width="20" height="5" fill="var(--gold)" clipPath={`url(#${clipId})`} />
      <rect x="6" y="40" width="20" height="3" rx="1" fill="var(--abyss)" />
    </svg>
  );
}
