"use client";

import { HeroAmbience } from "@/components/landing/HeroAmbience";
import { LandingScrollNav } from "@/components/landing/LandingScrollNav";
import { LandingHeroSection } from "@/components/landing/LandingHeroSection";
import { LandingEssenceSection } from "@/components/landing/LandingEssenceSection";
import { LandingRulesSection } from "@/components/landing/LandingRulesSection";
import { LandingVenueSection } from "@/components/landing/LandingVenueSection";
import { LandingPricingSection } from "@/components/landing/LandingPricingSection";
import { LandingFaqSection } from "@/components/landing/LandingFaqSection";
import { LandingFooterSection } from "@/components/landing/LandingFooterSection";
import type { CampInfo } from "@/components/landing/types";


type LandingScrollExperienceProps = {
  camp: CampInfo | null;
  price: string | null;
};

export function LandingScrollExperience({ camp, price }: LandingScrollExperienceProps) {
  return (
    <div className="relative min-h-screen text-white selection:bg-[var(--gold)] selection:text-[#0e2043] overflow-x-hidden bg-[#0e2043]">
      {/* Background HeroAmbience Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroAmbience />
      </div>

      {/* Floating Glass Header Navigation */}
      <LandingScrollNav />

      {/* Main Content Floating over Canvas */}
      <main className="relative z-10 space-y-8 sm:space-y-16 pb-12">
        {/* 1. Hero Section (Ultra-clean Title & Header) */}
        <LandingHeroSection />

        {/* 2. O que é o Lighthouse */}
        <LandingEssenceSection />

        {/* 3. Regras do Acampamento */}
        <LandingRulesSection />

        {/* 4. O Lugar (Acampamento EETAD - Shalom) */}
        <LandingVenueSection />

        {/* 5. Lotes & Inscrição */}
        <LandingPricingSection camp={camp} price={price} />

        {/* 6. FAQ */}
        <LandingFaqSection />
      </main>

      {/* Footer */}
      <LandingFooterSection />
    </div>
  );
}
