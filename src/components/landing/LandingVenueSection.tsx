"use client";

import { ExternalLink } from "lucide-react";
import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

type LandingVenueSectionProps = {
  place: string;
};

export function LandingVenueSection({ place }: LandingVenueSectionProps) {
  return (
    <section id="local" className="relative py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Visual Showcase */}
          <RevealOnScroll>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/25 shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(14,32,67,0.9) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-mono text-[var(--gold)] uppercase font-extrabold tracking-wider">
                  Refúgio em meio à natureza
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                  {place}
                </h3>
              </div>
            </div>
          </RevealOnScroll>

          {/* Clean Description & Features List */}
          <RevealOnScroll delay={0.15}>
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
                Estrutura & Espaço
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Um espaço preparado para acolher você.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                Chalés climatizados, refeitório amplo, auditório completo e áreas verdes tranquilas para oração e renovação.
              </p>

              <div className="mt-8 space-y-4 border-t border-white/20 pt-6">
                {campContent.venueFeatures.slice(0, 4).map((feature) => (
                  <div key={feature.name} className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white">{feature.name}</span>
                    <span className="text-xs text-white/70">{feature.desc}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--gold)] hover:underline"
                >
                  <span>Ver localização no Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
