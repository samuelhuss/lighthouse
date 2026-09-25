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
          <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-32">
            
            {/* Bloco 1: Abertura Monumental */}
            <div className="max-w-4xl">
              <p className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.3] text-white/90">
                Entre 05 e 09 de fevereiro de 2027, o D'One Ministry abre as portas para mais uma edição inesquecível do <span className="text-[var(--gold)] font-bold">D'One Camp</span> — nosso acampamento cristão anual para jovens e adolescentes.
              </p>
            </div>

            {/* Bloco 2: O Contraste e a Pergunta */}
            <div className="max-w-3xl ml-auto sm:text-right">
              <p className="text-lg sm:text-2xl leading-relaxed text-white/50 font-light mb-8">
                {campContent.aboutText[1]}
              </p>
              <p className="font-serif text-2xl sm:text-4xl text-white italic leading-tight">
                "{campContent.aboutText[2]}"
              </p>
            </div>

            {/* Bloco 3: O Chamado (Lighthouse) */}
            <div className="relative pl-6 sm:pl-10">
              {/* Linha vertical decorativa */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--gold)] to-transparent rounded-full"></div>
              
              <h3 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white uppercase tracking-tight leading-[1.1] mb-6">
                Agora, chegou o momento de <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] to-yellow-200">
                  erguer e carregar essa luz.
                </span>
              </h3>
              
              <div className="space-y-4 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed font-light">
                <p>
                  <strong className="text-white font-bold">{campContent.aboutText[4]}</strong>
                </p>
                <p>
                  {campContent.aboutText[5]}
                </p>
              </div>
            </div>

          </div>
        </RevealOnScroll>

        {/* Visão e Propósito */}
        <RevealOnScroll delay={0.2} className="mt-20">
          <div className="border-t border-white/15 pt-12">
            <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold mb-8 block text-center sm:text-left">
              VISÃO E PROPÓSITO DO D'ONE CAMP
            </span>
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
              {campContent.pillars.map((pillar, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white/10 shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
