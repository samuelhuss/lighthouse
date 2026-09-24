"use client";

import { LighthouseMark } from "@/components/brand/LighthouseMark";

export function LandingFooterSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative z-10 border-t border-white/15 bg-black/20 backdrop-blur-xl text-white py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5">
          <LighthouseMark size={22} className="text-[var(--gold)]" />
          <span className="font-serif text-sm font-extrabold tracking-widest uppercase text-white">
            LIGHTHOUSE’27
          </span>
        </div>

        {/* Minimal Navigation Links (Sem o botão/link Admin) */}
        <div className="flex items-center gap-6 text-xs text-white/70 font-bold">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-[var(--gold)] transition cursor-pointer">
            Início
          </button>
          <button onClick={() => scrollToSection("programacao")} className="hover:text-[var(--gold)] transition cursor-pointer">
            Programação
          </button>
          <button onClick={() => scrollToSection("inscricao")} className="hover:text-[var(--gold)] transition cursor-pointer">
            Inscrição
          </button>
        </div>

        {/* Copyright */}
        <span className="text-[11px] text-white/50 font-mono">
          © 2027 Lighthouse.
        </span>
      </div>
    </footer>
  );
}
