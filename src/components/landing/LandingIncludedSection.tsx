"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { campContent } from "@/content/camp";
import { RevealOnScroll, RevealStagger, RevealStaggerItem } from "@/components/landing/RevealOnScroll";

export function LandingIncludedSection() {
  return (
    <section id="incluso" className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a1833]">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-7xl h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(232,175,46,0.12)_0%,transparent_70%)]" />
      <div className="landing-grain absolute inset-0 opacity-25 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[var(--gold)] backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold)]" /> TRANSPARÊNCIA TOTAL
          </span>
          <h2 className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white leading-tight">
            Você traz a fé. Nós cuidamos do resto.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-white/80 leading-relaxed">
            Sem custos ocultos ou taxas adicionais. Sua vaga inclui toda a infraestrutura necessária para você aproveitar 100% da experiência.
          </p>
        </RevealOnScroll>

        {/* Perks Grid */}
        <RevealStagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campContent.included.map((item) => (
            <RevealStaggerItem key={item}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="group flex items-start gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-2xl shadow-lg transition-all duration-300 hover:border-emerald-400/50 hover:bg-white/15"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-[#0e2043] transition-all duration-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {item}
                  </h3>
                  <p className="mt-1 text-[11px] text-white/70">Incluso no seu passaporte Lighthouse’27</p>
                </div>
              </motion.div>
            </RevealStaggerItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
