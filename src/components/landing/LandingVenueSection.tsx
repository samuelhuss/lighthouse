"use client";

import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingVenueSection() {
  return (
    <section id="local" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Visual Image / Map Showcase */}
          <RevealOnScroll>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/25 shadow-2xl bg-white/5">
              <iframe 
                src="https://maps.google.com/maps?q=ESF-040+-+Elias+Fausto,+SP,+13350-000&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-luminosity hover:grayscale-0 hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(180deg, transparent 60%, rgba(14,32,67,0.9) 100%)' }} />
              <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none">
                <span className="text-xs font-mono text-[var(--gold)] uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" /> SÃO PAULO
                </span>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  Elias Fausto, SP
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
                  href="https://maps.app.goo.gl/E1AheJQCK1Rc4vPC9"
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

        {/* Photo Gallery Grid (Mosaic) */}
        <RevealOnScroll delay={0.3} className="mt-12 sm:mt-16">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-left">
              
              {/* Photo 1 - Pool (Span 2 desktop, Span 2 mobile) */}
              <div className="col-span-2 relative aspect-video md:aspect-[8/5] w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790367092839.webp" 
                  alt="Área da piscina" 
                  fill sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>

              {/* Photo 2 - Entrance Gate (Span 1 desktop, Span 1 mobile) */}
              <div className="col-span-1 relative aspect-square md:aspect-[4/5] w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790366739716.webp" 
                  alt="Entrada do local" 
                  fill sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>

              {/* Photo 3 - House (Span 1 desktop, Span 1 mobile) */}
              <div className="col-span-1 relative aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790367100265.webp" 
                  alt="Casa principal" 
                  fill sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>

              {/* Photo 4 - Gazebo / Pond (Span 1 desktop, Span 1 mobile) */}
              <div className="col-span-1 relative aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790367100266.webp" 
                  alt="Área do lago" 
                  fill sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              
              {/* Photo 5 - Palm Trees (Span 1 desktop, Span 1 mobile) */}
              <div className="col-span-1 relative aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790367858825.webp" 
                  alt="Jardim com palmeiras" 
                  fill sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>

              {/* Photo 6 - Wide Landscape (Span 3 desktop, Span 2 mobile) */}
              <div className="col-span-2 md:col-span-3 relative aspect-video md:aspect-[21/9] lg:aspect-[3/1] w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-[#0e2043]/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none" />
                <Image 
                  src="/venue/media_1790366739749.webp" 
                  alt="Vista panorâmica" 
                  fill sizes="100vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>

            </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
