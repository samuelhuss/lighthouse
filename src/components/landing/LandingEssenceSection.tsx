"use client";

import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingEssenceSection() {
  return (
    <section id="sobre" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <RevealOnScroll className="text-center sm:text-left">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
            SOBRE O EVENTO
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold text-white leading-tight">
            {campContent.aboutTitle}
          </h2>
          <p className="mt-6 text-base sm:text-xl text-white/90 leading-relaxed font-normal">
            {campContent.aboutText}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
