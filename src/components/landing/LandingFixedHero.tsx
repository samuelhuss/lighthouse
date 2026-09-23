"use client";

import { useEffect, useState } from "react";
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
      : "Datas em breve";
  const place = camp?.location ?? "Local em breve";

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  return (
    <main className="landing-hero-bg fixed inset-0 z-0 flex h-[100dvh] flex-col overflow-hidden text-white">
      {/* Luz ambiente & farol */}
      <HeroAmbience />

      {/* Container Principal */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-2.5 sm:p-5 lg:p-7">
        {/* Header Superior em Pílula de Vidro Fumê */}
        <header className="minimal-glass-dock mx-auto flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-2.5 shadow-xl border border-white/25 backdrop-blur-3xl">
          <div className="flex items-center gap-2.5">
            <LighthouseMark size={22} className="text-[var(--gold)]" />
            <span className="font-serif text-sm sm:text-base tracking-widest text-white font-extrabold uppercase">
              LIGHTHOUSE’27
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-wider text-white">
            <span className="text-[var(--gold)] font-mono">{period}</span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="hidden sm:inline text-white/90">{place}</span>
          </div>
        </header>

        {/* Layout com Dock Lateral (Desktop) e Dock Inferior (Mobile) */}
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col lg:flex-row items-center justify-center gap-3 lg:gap-6 py-1.5 sm:py-3">
          {/* Dock Lateral Vertical em Telas Grandes */}
          <div className="order-2 lg:order-1 flex-shrink-0 w-full lg:w-auto">
            <AppleDockNav
              aria-label="Navegação Principal"
              activeId={etapa}
              onChange={setEtapa}
            />
          </div>

          {/* Minimal Glass Canvas */}
          <div className="order-1 lg:order-2 flex-1 w-full min-h-0">
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
    </main>
  );
}
