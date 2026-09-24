"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppleDockNav, type StageId } from "@/components/landing/AppleDockNav";
import { MinimalGlassCanvas } from "@/components/landing/MinimalGlassCanvas";
import { HeroAmbience } from "@/components/landing/HeroAmbience";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import type { CampInfo } from "@/components/landing/types";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(value)
  );
}

type LandingFixedHeroProps = {
  camp: CampInfo | null;
  price: string | null;
};

export function LandingFixedHero({ camp, price }: LandingFixedHeroProps) {
  const [etapa, setEtapa] = useState<StageId>("inicio");

  const period =
    camp?.startDate && camp.endDate
      ? `${formatDate(camp.startDate)} — ${formatDate(camp.endDate)}`
      : "05 — 09 de Fevereiro";
  const place = camp?.location ?? "Elias Fausto";

  useEffect(() => {
    // Only lock overflow on desktop viewports
    if (window.innerWidth >= 1024) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, []);

  return (
    <main className="landing-hero-bg min-h-screen lg:fixed lg:inset-0 z-0 flex flex-col lg:h-[100dvh] overflow-x-hidden text-white relative">
      {/* Luz ambiente & farol */}
      <HeroAmbience />

      {/* Container Principal */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-3 sm:p-5 lg:p-7 pb-24 lg:pb-7">
        {/* Header Superior em Pílula de Vidro Fosco */}
        <header className="minimal-glass-dock mx-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2 sm:px-6 sm:py-2.5 shadow-md border border-white/25 backdrop-blur-3xl shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <LighthouseMark size={22} className="text-[var(--gold)]" />
            <span className="font-serif text-xs sm:text-base tracking-widest text-white font-extrabold uppercase">
              LIGHTHOUSE’27
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs font-bold tracking-wider text-white">
            <span className="text-[var(--gold)] font-mono">{period}</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-white/90">{place}</span>
            <Link
              href="/inscricao"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#0e2043] transition hover:bg-[var(--gold)]"
            >
              Inscrição <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Layout com Dock Lateral (Desktop) e Canvas Central */}
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 py-3 sm:py-4">
          {/* Dock Lateral Vertical em Telas Grandes */}
          <div className="hidden lg:block flex-shrink-0">
            <AppleDockNav
              aria-label="Navegação Principal"
              activeId={etapa}
              onChange={setEtapa}
            />
          </div>

          {/* Minimal Glass Canvas */}
          <div className="flex-1 w-full min-h-0">
            <MinimalGlassCanvas
              activeId={etapa}
              onChangeStage={setEtapa}
              camp={camp}
              price={price}
              period={period}
              place={place}
            />
          </div>
        </div>
      </div>

      {/* Dock Flutuante Inferior no Mobile */}
      <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-auto">
        <AppleDockNav
          aria-label="Navegação Mobile"
          activeId={etapa}
          onChange={setEtapa}
        />
      </div>
    </main>
  );
}

