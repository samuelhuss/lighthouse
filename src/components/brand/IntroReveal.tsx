"use client";

import { HeroAmbience } from "@/components/landing/HeroAmbience";

/** Cinematic entrance: pure CSS implementation to avoid JS hydration blocking the screen */
export function IntroReveal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes introFadeOut {
          0%, 70% { opacity: 1; pointer-events: auto; }
          100% { opacity: 0; pointer-events: none; visibility: hidden; }
        }
        @keyframes introLogo {
          0% { opacity: 0; transform: scale(0.95); }
          20%, 70% { opacity: 1; transform: scale(1.05); filter: drop-shadow(0 0 36px rgba(232,175,46,0.9)); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        .intro-overlay {
          animation: introFadeOut 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .intro-logo {
          animation: introLogo 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-overlay { display: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="intro-overlay fixed inset-0 z-[999] flex items-center justify-center bg-[var(--abyss)] overflow-hidden"
      >
        <HeroAmbience />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <img
            src="/brand/lighthouse-text.webp"
            alt="Lighthouse"
            className="intro-logo h-56 sm:h-64 w-auto object-contain opacity-0"
          />
        </div>
      </div>
      
      {children}
    </>
  );
}
