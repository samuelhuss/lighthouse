"use client";

import { IntroReveal } from "@/components/brand/IntroReveal";
import { LandingScrollExperience } from "@/components/landing/LandingScrollExperience";
import type { CampInfo } from "@/components/landing/types";

export function LandingPage({ camp }: { camp: CampInfo | null }) {
  const price = camp?.currentBatch
    ? (camp.currentBatch.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

  return (
    <IntroReveal>
      <LandingScrollExperience camp={camp} price={price} />
    </IntroReveal>
  );
}

