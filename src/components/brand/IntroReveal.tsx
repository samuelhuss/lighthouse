"use client";

import { useEffect, useState } from "react";
import { LighthouseMark } from "@/components/brand/LighthouseMark";

type Phase = "dark" | "lit" | "fading" | "done";

/** Cinematic entrance: screen starts dark, the lighthouse beacon lights up, then the page reveals. */
export function IntroReveal({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("dark");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(skip);
    }
    const timers = [
      window.setTimeout(() => setPhase("lit"), 200),
      window.setTimeout(() => setPhase("fading"), 1100),
      window.setTimeout(() => setPhase("done"), 1750),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <>
      {phase !== "done" && (
        <div
          aria-hidden
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-[var(--abyss)] transition-opacity duration-700 ${phase === "fading" ? "opacity-0" : "opacity-100"}`}
        >
          <LighthouseMark
            size={52}
            className={`transition-all duration-500 ${phase === "dark" ? "opacity-40" : "opacity-100 drop-shadow-[0_0_26px_rgba(232,175,46,.75)]"}`}
          />
        </div>
      )}
      {children}
    </>
  );
}
