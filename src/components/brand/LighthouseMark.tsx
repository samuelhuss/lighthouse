"use client";

import Image from "next/image";

type LighthouseMarkProps = {
  size?: number;
  withBeam?: boolean;
  className?: string;
};

/** Golden lighthouse mark used across the site header and brand cards. */
export function LighthouseMark({ size = 32, className }: LighthouseMarkProps) {
  return (
    <Image
      src="/brand/lighthouse-icon.webp"
      alt="Farol Lighthouse'27"
      width={size * 2}
      height={size * 2}
      className={`object-contain drop-shadow-md ${className ?? ""}`}
      style={{ width: size, height: "auto" }}
      priority
    />
  );
}

