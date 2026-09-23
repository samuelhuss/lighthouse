"use client";

import { IntroReveal } from "@/components/brand/IntroReveal";
import { LandingFixedHero } from "@/components/landing/LandingFixedHero";
import type { CampInfo } from "@/components/landing/types";

export function LandingPage({ camp }: { camp: CampInfo | null }) {
  const price = camp?.currentBatch
    ? (camp.currentBatch.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

  return (
    <IntroReveal>
      <LandingFixedHero camp={camp} price={price} />
    </IntroReveal>
  );
}
