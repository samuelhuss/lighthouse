"use client";

import { useState } from "react";
import {
  CalendarDays,
  CircleHelp,
  Compass,
  Gift,
  Sparkles,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { HeroAmbience } from "@/components/landing/HeroAmbience";
import { FloatingActionOrb } from "@/components/landing/FloatingActionOrb";
import {
  LandingCardPanel,
  type CardPanelId,
} from "@/components/landing/LandingCardPanel";
import { campContent } from "@/content/camp";
import type { CampInfo } from "@/components/landing/types";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
}

type OrbDef = {
  id: CardPanelId;
  label: string;
  icon: typeof Sparkles;
  destaque?: boolean;
  floatDelay: number;
  /** Posição no desktop (percentual) */
  desktop: { top: string; left: string };
};

const orbes: OrbDef[] = [
  { id: "sobre", label: "Sobre", icon: Sparkles, floatDelay: 0, desktop: { top: "22%", left: "8%" } },
  { id: "programa", label: "Programa", icon: CalendarDays, floatDelay: 0.35, desktop: { top: "18%", left: "82%" } },
  { id: "local", label: "Local", icon: Compass, floatDelay: 0.7, desktop: { top: "52%", left: "90%" } },
  { id: "incluido", label: "Incluído", icon: Gift, floatDelay: 1.05, desktop: { top: "58%", left: "6%" } },
  { id: "faq", label: "FAQ", icon: CircleHelp, floatDelay: 1.4, desktop: { top: "78%", left: "14%" } },
  { id: "inscricao", label: "Inscrição", icon: Ticket, destaque: true, floatDelay: 0.5, desktop: { top: "76%", left: "78%" } },
];

type LandingBusinessCardProps = {
  camp: CampInfo | null;
  price: string | null;
};

export function LandingBusinessCard({ camp, price }: LandingBusinessCardProps) {
  const [panel, setPanel] = useState<CardPanelId | null>(null);

  const period =
    camp?.startDate && camp.endDate
      ? `${formatDate(camp.startDate)} — ${formatDate(camp.endDate)}`
      : "Datas em breve";
  const place = camp?.location ?? "Local em breve";

  return (
    <main className="landing-hero-bg relative flex min-h-[100dvh] flex-col overflow-hidden">
      <HeroAmbience />

      <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-10">
        <Link href="#top" className="inline-flex items-center gap-2 text-[var(--pine)]">
          <LighthouseMark size={24} withBeam className="beacon-pulse" />
          <span className="font-serif text-lg tracking-tight">Lighthouse</span>
        </Link>
        <Link
          href="/inscricao"
          className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-[var(--amber)] hover:text-[var(--abyss)] sm:text-sm"
        >
          Inscreva-se
        </Link>
      </header>

      {/* Ícones flutuantes — desktop */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
        {orbes.map((orb) => (
          <FloatingActionOrb
            key={orb.id}
            icon={orb.icon}
            label={orb.label}
            destaque={orb.destaque}
            floatDelay={orb.floatDelay}
            onClick={() => setPanel(orb.id)}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: orb.desktop.top, left: orb.desktop.left }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-36 pt-4 md:pb-16 md:pt-0">
        <motion.article
          id="top"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[1.75rem] border border-white/20 bg-[rgba(14,32,67,.42)] p-8 text-center text-white shadow-[0_24px_80px_rgba(6,13,28,.45)] backdrop-blur-xl sm:max-w-lg sm:p-10"
        >
          <LighthouseMark size={40} withBeam className="mx-auto beacon-pulse drop-shadow-[0_0_24px_rgba(232,175,46,.5)]" />
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            {campContent.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,7vw,3.25rem)] leading-[0.98] tracking-[-0.02em]">
            {campContent.heroTitle}
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/78 sm:text-base">{campContent.heroDescription}</p>

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 text-left text-xs sm:text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/85">Quando</p>
              <p className="mt-1 text-white/85">{period}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/85">Onde</p>
              <p className="mt-1 text-white/85">{place}</p>
            </div>
          </div>
        </motion.article>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 hidden text-center text-[11px] uppercase tracking-[0.28em] text-white/45 md:block"
        >
          Toque nos ícones ao redor
        </motion.p>
      </div>

      {/* Dock de ícones — mobile */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[rgba(6,13,28,.72)] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <p className="mb-3 text-center text-[10px] uppercase tracking-[0.22em] text-white/45">Explore</p>
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-x-2 gap-y-4">
          {orbes.map((orb) => (
            <FloatingActionOrb
              key={orb.id}
              icon={orb.icon}
              label={orb.label}
              destaque={orb.destaque}
              floatDelay={orb.floatDelay}
              onClick={() => setPanel(orb.id)}
            />
          ))}
        </div>
      </div>

      <LandingCardPanel panel={panel} onClose={() => setPanel(null)} camp={camp} price={price} />

      <p className="pointer-events-none absolute bottom-2 left-0 right-0 z-0 hidden text-center text-[10px] text-white/30 md:block">
        Uma luz que guia para casa
      </p>
    </main>
  );
}
