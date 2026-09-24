"use client";

import { useEffect, useState } from "react";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { HeroAmbience } from "@/components/landing/HeroAmbience";

type Phase = "dark" | "lit" | "fading" | "done";

/** Cinematic entrance: screen starts with atmospheric lighthouse beacon lighting up inside the dusk scene. */
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
          className={`fixed inset-0 z-[999] flex items-center justify-center bg-[var(--abyss)] transition-opacity duration-700 overflow-hidden ${
            phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Fundo crepuscular idêntico à página principal */}
          <HeroAmbience />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <LighthouseMark
              size={64}
              className={`transition-all duration-700 ${
                phase === "dark"
                  ? "opacity-30 scale-95"
                  : "opacity-100 scale-105 drop-shadow-[0_0_36px_rgba(232,175,46,0.9)]"
              }`}
            />
            <span
              className={`font-serif text-sm font-bold tracking-widest text-[var(--gold)] uppercase transition-opacity duration-500 ${
                phase === "dark" ? "opacity-0" : "opacity-100"
              }`}
            >
              LIGHTHOUSE'27
            </span>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
