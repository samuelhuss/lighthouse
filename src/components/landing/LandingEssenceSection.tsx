"use client";

import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingEssenceSection() {
  return (
    <section id="essencia" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <RevealOnScroll className="max-w-3xl">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
            NOSSA ESSÊNCIA • OS 4 PILARES
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-white leading-tight">
            {campContent.aboutTitle}
          </h2>
          <p className="mt-4 text-sm sm:text-lg text-white/85 leading-relaxed font-normal">
            {campContent.aboutText}
          </p>
        </RevealOnScroll>

        {/* Minimalist Editorial List */}
        <div className="mt-12 sm:mt-16 grid gap-8 sm:gap-10 sm:grid-cols-2 border-t border-white/20 pt-10">
          {campContent.pillars.map((pillar, idx) => (
            <RevealOnScroll key={pillar.id} delay={idx * 0.08}>
              <div className="group border-b border-white/15 pb-6 sm:pb-8 transition-colors">
                <span className="font-mono text-xs text-[var(--gold)] font-extrabold tracking-widest">
                  0{idx + 1} • PILAR
                </span>
                <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[var(--gold)] transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
