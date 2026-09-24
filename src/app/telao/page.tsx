"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, QrCode, CheckCircle2 } from "lucide-react";
import { HeroAmbience } from "@/components/landing/HeroAmbience";

export default function TelaoPage() {
  const [siteUrl, setSiteUrl] = useState<string>("https://lighthouse27.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(`${window.location.origin}/#inscricao`);
    }
  }, []);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    siteUrl
  )}&color=0e2043&bgcolor=ffffff&margin=10`;

  return (
    <main className="relative min-h-screen z-0 flex flex-col justify-between text-white p-6 sm:p-10 lg:p-12 selection:bg-[var(--gold)] selection:text-[#0e2043] overflow-hidden bg-[#0e2043]">
      {/* Background HeroAmbience Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroAmbience />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-end max-w-7xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold text-white transition hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
      </header>

      {/* Main 2-Column Widescreen Layout */}
      <div className="relative z-10 my-auto max-w-7xl w-full mx-auto py-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Big Screen Callout */}
        <div className="flex flex-col items-start text-left space-y-6">
          {/* HIGH CONTRAST DATE BADGE FOR PROJECTORS */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white border-2 border-[var(--gold)] px-5 py-2.5 text-xs sm:text-sm font-mono font-extrabold tracking-widest text-[#0e2043] uppercase shadow-2xl">
            <Sparkles className="h-4 w-4 text-[var(--gold)] shrink-0" />
            <span>18 — 20 DE ABRIL • LEME, SP</span>
          </div>

          <h1 className="font-serif text-[clamp(3.2rem,6vw,5.5rem)] font-extrabold tracking-tight text-white leading-[0.94] drop-shadow-2xl">
            Garanta sua vaga.
          </h1>

          <p className="font-serif text-2xl sm:text-3xl font-bold text-[var(--gold)] leading-tight">
            Faça sua inscrição agora!
          </p>

          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed font-normal">
            Três dias imersivos de busca espiritual, palavra transformadora, louvor intenso e comunhão com a igreja.
          </p>

          {/* Included Bullet Points */}
          <div className="grid grid-cols-2 gap-3 pt-2 w-full max-w-lg">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Hospedagem inclusa</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Alimentação inclusa</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Acesso a todas as atividades</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Pix ou até 12x no cartão</span>
            </div>
          </div>

          {/* Location footnote */}
          <div className="pt-4 border-t border-white/15 w-full">
            <p className="text-xs sm:text-sm text-white/70 font-medium">
              📍 Acampamento EETAD - Shalom • Leme, São Paulo
            </p>
          </div>
        </div>

        {/* Right Column: Giant High-Contrast QR Code Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-[2.5rem] border border-[var(--gold)]/40 bg-white/10 p-8 sm:p-10 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col items-center text-center max-w-md w-full relative">
            {/* Top Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 px-4 py-1 text-xs font-mono font-bold text-[var(--gold)] uppercase mb-6">
              <QrCode className="h-3.5 w-3.5" /> ACESSO RÁPIDO
            </span>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-white/20 mb-6 group hover:scale-105 transition-transform duration-300">
              <img
                src={qrImageUrl}
                alt="QR Code Inscrição Lighthouse 2027"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-2xl"
              />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white">
              Aponte a câmera do celular
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-white/80 font-medium">
              Acesse o formulário e faça sua inscrição em menos de 1 minuto.
            </p>

            {/* Direct Link Footer */}
            <div className="mt-6 pt-4 border-t border-white/15 w-full font-mono text-[11px] text-[var(--gold)] font-bold break-all">
              {siteUrl}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-white/50 font-mono">
        © 2027 Lighthouse'27 • Exibição em Telão
      </footer>
    </main>
  );
}
