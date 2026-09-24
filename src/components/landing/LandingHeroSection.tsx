"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";

type LandingHeroSectionProps = {
  camp: CampInfo | null;
  price: string | null;
  period: string;
  place: string;
};

import type { CampInfo } from "@/components/landing/types";

export function LandingHeroSection({ camp, price, period, place }: LandingHeroSectionProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="inicio" className="relative min-h-[85dvh] flex flex-col justify-between pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative z-10 mx-auto max-w-4xl w-full my-auto flex flex-col items-center">
        {/* Date & Location Pill - High Contrast */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-[#0e2043]/30 bg-[#0e2043]/85 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[var(--gold)] uppercase shadow-lg backdrop-blur-md"
        >
          <span>{period}</span>
          <span>•</span>
          <span>{place}</span>
        </motion.div>

        {/* Main Title - Mobile & Desktop Perfect Scaling */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 sm:mt-6 font-serif text-[clamp(2.8rem,10vw,6.8rem)] font-extrabold tracking-tight text-[#0e2043] leading-[0.92] drop-shadow-sm"
        >
          LIGHTHOUSE’27
        </motion.h1>

        {/* Short Punchy Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg text-[#223164]/95 font-semibold leading-relaxed px-2"
        >
          Três dias imersivos de busca espiritual, palavra transformadora, louvor intenso e comunhão com a igreja.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={() => scrollToSection("inscricao")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0e2043] px-8 py-3.5 text-xs sm:text-sm font-extrabold text-white transition-all hover:bg-[var(--azure)] active:scale-95 shadow-xl cursor-pointer"
          >
            <span>Fazer Minha Inscrição</span>
            <ArrowRight className="h-4 w-4 text-[var(--gold)]" />
          </button>

          <button
            onClick={() => scrollToSection("essencia")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0e2043] hover:text-[var(--azure)] transition cursor-pointer py-2 px-4"
          >
            <span>Conhecer o acampamento</span>
            <ArrowDown className="h-3.5 w-3.5 text-[#0e2043]" />
          </button>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <div className="relative z-10 text-center mt-6">
        <button
          onClick={() => scrollToSection("essencia")}
          className="inline-flex flex-col items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#0e2043]/70 hover:text-[#0e2043] transition uppercase cursor-pointer"
        >
          <span>Role para explorar</span>
          <div className="h-4 w-0.5 bg-[#0e2043] animate-pulse" />
        </button>
      </div>
    </section>
  );
}
