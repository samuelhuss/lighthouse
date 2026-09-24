"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingVenueSection() {
  return (
    <section id="local" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Visual Image Showcase */}
          <RevealOnScroll>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/25 shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(14,32,67,0.9) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-mono text-[var(--gold)] uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" /> LEME - SÃO PAULO
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-white">
                  Acampamento EETAD - Shalom
                </h3>
              </div>
            </div>
          </RevealOnScroll>

          {/* Description & Location Info */}
          <RevealOnScroll delay={0.15}>
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
                LOCAL DO EVENTO
              </span>
              <h2 className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white leading-tight">
                {campContent.venueTitle}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed font-normal">
                {campContent.venueText}
              </p>

              <div className="mt-8 pt-6 border-t border-white/20">
                <a
                  href="https://maps.google.com/?q=Acampamento+EETAD+Shalom+Leme+SP"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition backdrop-blur-md"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[var(--gold)]" />
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
