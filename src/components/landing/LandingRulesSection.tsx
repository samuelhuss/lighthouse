"use client";

import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { Ban } from "lucide-react";

export function LandingRulesSection() {
  return (
    <section id="regras" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <RevealOnScroll className="mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
            CONVIVÊNCIA & SEGURANÇA
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2.2rem,6vw,3.5rem)] font-extrabold text-white leading-tight">
            {campContent.rulesTitle}
          </h2>
        </RevealOnScroll>

        {/* Rules — editorial list style */}
        <div className="divide-y divide-white/15 border-t border-white/15">
          {campContent.rules.map((rule, idx) => (
            <RevealOnScroll key={rule.id} delay={idx * 0.07}>
              <div className="py-8 sm:py-10 grid sm:grid-cols-[80px_1fr] gap-4 sm:gap-10 items-start">
                <span className="font-mono text-3xl sm:text-4xl font-black text-white/10 leading-none tabular-nums">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed font-normal">
                    {rule.description}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Proibidos — Minimalist Grid */}
        <RevealOnScroll delay={0.2} className="mt-24">
          <div className="border-t border-white/20 pt-12">
            <span className="text-xs font-mono tracking-[0.25em] text-white/50 uppercase font-bold flex items-center gap-2 mb-10">
              <Ban className="w-4 h-4" /> PROIBIDO
            </span>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {campContent.prohibitedItems.map((item, idx) => (
                <div key={idx} className="relative pl-5">
                  <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-white/30"></span>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed font-normal">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
