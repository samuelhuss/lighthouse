"use client";

import { HeroAmbience } from "@/components/landing/HeroAmbience";
import { LandingScrollNav } from "@/components/landing/LandingScrollNav";
import { LandingHeroSection } from "@/components/landing/LandingHeroSection";
import { LandingEssenceSection } from "@/components/landing/LandingEssenceSection";
import { LandingScheduleSection } from "@/components/landing/LandingScheduleSection";
import { LandingVenueSection } from "@/components/landing/LandingVenueSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingFooterSection } from "@/components/landing/LandingFooterSection";
import type { CampInfo } from "@/components/landing/types";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(value)
  );
}

type LandingScrollExperienceProps = {
  camp: CampInfo | null;
  price: string | null;
};

export function LandingScrollExperience({ camp, price }: LandingScrollExperienceProps) {
  const period =
    camp?.startDate && camp.endDate
      ? `${formatDate(camp.startDate)} — ${formatDate(camp.endDate)}`
      : "18 — 20 de Abril";
  const place = camp?.location ?? "Estância Farol da Serra";

  return (
    <div className="relative min-h-screen text-white selection:bg-[var(--gold)] selection:text-[#0e2043] overflow-x-hidden">
      {/* 
        Single Unified Full-Page Background Canvas (HeroAmbience)
        Eliminates disconnected color section cuts & harsh blue tones.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroAmbience />
      </div>

      {/* Floating Glass Header Navigation */}
      <LandingScrollNav period={period} />

      {/* Main Content Floating over Unified Background */}
      <main className="relative z-10 space-y-8 sm:space-y-16 pb-12">
        {/* 1. Hero Section */}
        <LandingHeroSection
          camp={camp}
          price={price}
          period={period}
          place={place}
        />

        {/* 2. Nossa Essência */}
        <LandingEssenceSection />

        {/* 3. Cronograma Oficial */}
        <LandingScheduleSection />

        {/* 4. O Lugar / Estrutura */}
        <LandingVenueSection place={place} />

        {/* 5. Valores & Inscrição */}
        <LandingPricingSection camp={camp} price={price} />

        {/* 6. Dúvidas Frequentes */}
        <LandingFaqSection />
      </main>

      {/* Footer */}
      <LandingFooterSection />
    </div>
  );
}
