"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  Calendar,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Ticket,
  ChevronRight,
  ExternalLink,
  Map,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { campContent } from "@/content/camp";
import type { CampInfo } from "@/components/landing/types";
import type { StageId } from "./AppleDockNav";
import { cn } from "@/lib/utils";

type AppleWalletStackProps = {
  activeId: StageId;
  onChangeStage: (id: StageId) => void;
  camp: CampInfo | null;
  price: string | null;
  period: string;
  place: string;
};

const cardsConfig: {
  id: StageId;
  title: string;
  eyebrow: string;
  icon: typeof Sparkles;
  gradient: string;
  accentColor: string;
}[] = [
  {
    id: "inicio",
    title: "Passaporte Lighthouse 2026",
    eyebrow: "RETIRO DE FÉ & COMUNHÃO",
    icon: Sparkles,
    gradient: "from-[#0e2043]/90 via-[#223164]/95 to-[#0b162c]/95",
    accentColor: "border-[var(--amber)]/40 text-[var(--gold)]",
  },
  {
    id: "sobre",
    title: "Propósito & Visão",
    eyebrow: "SOBRE O ACAMPAMENTO",
    icon: Compass,
    gradient: "from-[#1b2a4a]/90 via-[#182542]/95 to-[#0e182e]/95",
    accentColor: "border-[var(--azure)]/50 text-[var(--gold)]",
  },
  {
    id: "programa",
    title: "Cronograma de 3 Dias",
    eyebrow: "PROGRAMAÇÃO OFICIAL",
    icon: Calendar,
    gradient: "from-[#172d54]/90 via-[#1e345e]/95 to-[#10203e]/95",
    accentColor: "border-[var(--gold)]/50 text-[var(--gold)]",
  },
  {
    id: "local",
    title: "Localização & Estrutura",
    eyebrow: "ONDE VAI ACONTECER",
    icon: MapPin,
    gradient: "from-[#183446]/90 via-[#152e3e]/95 to-[#0b1e2a]/95",
    accentColor: "border-[var(--amber)]/40 text-[var(--gold)]",
  },
  {
    id: "incluido",
    title: "Tudo O Que Está Incluso",
    eyebrow: "HOSPEDAGEM & ALIMENTAÇÃO",
    icon: CheckCircle2,
    gradient: "from-[#1e2746]/90 via-[#161f3a]/95 to-[#0d1428]/95",
    accentColor: "border-emerald-400/40 text-emerald-300",
  },
  {
    id: "faq",
    title: "Dúvidas Frequentes",
    eyebrow: "PERGUNTAS & RESPOSTAS",
    icon: HelpCircle,
    gradient: "from-[#251d42]/90 via-[#1c1535]/95 to-[#110c24]/95",
    accentColor: "border-indigo-400/40 text-indigo-300",
  },
  {
    id: "inscricao",
    title: "Garantir Sua Credencial",
    eyebrow: "PASSE FINAL",
    icon: Ticket,
    gradient: "from-[#38260d]/90 via-[#271a08]/95 to-[#160d03]/95",
    accentColor: "border-[var(--amber)] text-[var(--gold)]",
  },
];

export function AppleWalletStack({
  activeId,
  onChangeStage,
  camp,
  price,
  period,
  place,
}: AppleWalletStackProps) {
  const activeIndex = cardsConfig.findIndex((c) => c.id === activeId);

  return (
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-4 py-2 sm:px-6">
      {/* Container do Stack estilo Apple Wallet */}
      <div className="wallet-card-container relative flex h-full max-h-[640px] min-h-[480px] w-full flex-col justify-end overflow-hidden pb-4 sm:min-h-[520px]">
        {cardsConfig.map((card, index) => {
          const isActive = card.id === activeId;
          const isBehind = index < activeIndex;
          const isAhead = index > activeIndex;

          // Cálculo do deslocamento em estilo carteira
          let translateY = 0;
          let scale = 1;
          let zIndex = 10;
          let opacity = 1;

          if (isActive) {
            translateY = 0;
            scale = 1;
            zIndex = 30;
            opacity = 1;
          } else if (isBehind) {
            // Cartões anteriores empilhados no topo com peek
            const diff = activeIndex - index;
            translateY = -Math.min(diff * 48, 140);
            scale = Math.max(1 - diff * 0.04, 0.84);
            zIndex = 20 - diff;
            opacity = diff > 3 ? 0 : 0.85;
          } else if (isAhead) {
            // Cartões posteriores empilhados abaixo com leve elevação
            const diff = index - activeIndex;
            translateY = Math.min(diff * 24 + 400, 520);
            scale = 0.96;
            zIndex = 10 - diff;
            opacity = diff > 2 ? 0 : 0.4;
          }

          const CardIcon = card.icon;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                y: translateY,
                scale,
                zIndex,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 32,
                mass: 0.8,
              }}
              onClick={() => {
                if (!isActive) onChangeStage(card.id);
              }}
              className={cn(
                "absolute inset-x-0 bottom-0 top-0 flex flex-col overflow-hidden rounded-[2rem] border bg-gradient-to-br transition-shadow duration-300 wallet-pass-edge backdrop-blur-xl",
                card.gradient,
                isActive
                  ? "border-white/30 shadow-[0_24px_64px_rgba(0,0,0,0.5)] cursor-default"
                  : "border-white/15 shadow-md hover:border-white/40 cursor-pointer"
              )}
            >
              {/* Brilho metálico superior / foil sheen */}
              <div className="wallet-card-shine absolute inset-0 pointer-events-none" />

              {/* Cabeçalho do Passe (Pass Stub) */}
              <div
                className={cn(
                  "flex items-center justify-between border-b px-6 py-4 transition-colors sm:px-8 sm:py-5",
                  isActive
                    ? "border-white/20 bg-white/5"
                    : "border-white/10 bg-black/20 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border bg-white/10 shadow-sm",
                      card.accentColor
                    )}
                  >
                    <CardIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                      {card.eyebrow}
                    </p>
                    <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                      {card.title}
                    </h2>
                  </div>
                </div>

                {/* Badge de status ou botão de expandir no cartão */}
                <div className="flex items-center gap-2">
                  {!isActive ? (
                    <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition group-hover:bg-white/20">
                      Ver <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="hidden items-center gap-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--amber)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--gold)] sm:flex">
                      <Zap className="h-3 w-3 animate-pulse" /> Ativo
                    </span>
                  )}
                </div>
              </div>

              {/* Corpo de Conteúdo do Cartão Ativo */}
              <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto p-6 sm:p-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key={`content-${card.id}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex min-h-0 flex-1 flex-col justify-between"
                    >
                      {/* CARTÃO 1: INÍCIO */}
                      {card.id === "inicio" && (
                        <div className="my-auto flex flex-col">
                          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[var(--gold)] uppercase backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            {campContent.eyebrow}
                          </div>
                          <h1 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.1rem,6vw,3.75rem)] font-normal leading-[1.02] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.3)]">
                            {campContent.heroTitle}
                          </h1>
                          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base">
                            {campContent.heroDescription}
                          </p>

                          {/* Metadata do evento em grid */}
                          <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                                Quando
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white">
                                {period}
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                                Onde
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white">
                                {place}
                              </p>
                            </div>
                          </div>

                          <div className="mt-7 flex flex-wrap items-center gap-4">
                            <Link
                              href="/inscricao"
                              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--amber)] to-[var(--gold)] px-6 py-3.5 text-sm font-bold text-[var(--abyss)] shadow-lg shadow-[var(--amber)]/20 transition hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Garantir meu lugar <ChevronRight className="h-4 w-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => onChangeStage("sobre")}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
                            >
                              Conhecer o projeto <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 2: SOBRE */}
                      {card.id === "sobre" && (
                        <div className="my-auto flex flex-col max-w-2xl">
                          <h3 className="font-serif text-[clamp(1.75rem,4.5vw,2.5rem)] leading-tight text-white">
                            {campContent.aboutTitle}
                          </h3>
                          <p className="mt-5 text-[15px] leading-8 text-white/90 sm:text-base">
                            {campContent.aboutText}
                          </p>

                          <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                              <p className="font-serif text-2xl font-bold text-[var(--gold)]">
                                3 Dias
                              </p>
                              <p className="mt-1 text-xs text-white/70">
                                Imersão e renovo
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                              <p className="font-serif text-2xl font-bold text-[var(--gold)]">
                                100%
                              </p>
                              <p className="mt-1 text-xs text-white/70">
                                Incluso alimentação
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                              <p className="font-serif text-2xl font-bold text-[var(--gold)]">
                                Comunhão
                              </p>
                              <p className="mt-1 text-xs text-white/70">
                                Com a igreja toda
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 3: PROGRAMAÇÃO */}
                      {card.id === "programa" && (
                        <div className="my-auto flex flex-col">
                          <h3 className="font-serif text-2xl text-white sm:text-3xl">
                            Três dias. Um farol.
                          </h3>
                          <p className="mt-2 text-sm text-white/70">
                            Confira o que preparamos para cada etapa do retiro.
                          </p>

                          <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {campContent.program.map((day) => (
                              <div
                                key={day.day}
                                className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md"
                              >
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                  <h4 className="font-serif text-lg font-bold text-[var(--gold)]">
                                    {day.day}
                                  </h4>
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                                    Etapa
                                  </span>
                                </div>
                                <ul className="mt-3 space-y-2 text-xs text-white/88 leading-relaxed">
                                  {day.items.map((item) => (
                                    <li
                                      key={item}
                                      className="flex items-start gap-1.5"
                                    >
                                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 4: LOCAL */}
                      {card.id === "local" && (
                        <div className="my-auto flex flex-col max-w-xl">
                          <h3 className="font-serif text-2xl text-white sm:text-3xl">
                            {place}
                          </h3>
                          <p className="mt-4 text-[15px] leading-relaxed text-white/90">
                            Um espaço especialmente escolhido para proporcionar
                            descanso, oração e um ambiente longe do barulho da
                            cidade.
                          </p>

                          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
                            <div className="flex items-center gap-3">
                              <Map className="h-6 w-6 text-[var(--gold)]" />
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  Fácil acesso & Estacionamento
                                </p>
                                <p className="text-xs text-white/70">
                                  Endereço e orientações enviadas no bilhete.
                                </p>
                              </div>
                            </div>
                            <a
                              href="https://maps.google.com"
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-[var(--gold)] border border-white/15 transition hover:bg-white/20"
                            >
                              Abrir no Google Maps <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 5: INCLUSO */}
                      {card.id === "incluido" && (
                        <div className="my-auto flex flex-col max-w-xl">
                          <h3 className="font-serif text-2xl text-white sm:text-3xl">
                            Você traz a fé. Nós cuidamos do resto.
                          </h3>
                          <div className="mt-6 grid gap-2.5">
                            {campContent.included.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 backdrop-blur-sm"
                              >
                                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 6: FAQ */}
                      {card.id === "faq" && (
                        <div className="my-auto flex flex-col max-w-xl">
                          <h3 className="font-serif text-2xl text-white sm:text-3xl">
                            Dúvidas Frequentes
                          </h3>
                          <div className="mt-5 space-y-3">
                            {campContent.faq.map((item) => (
                              <details
                                key={item.question}
                                className="group rounded-xl border border-white/10 bg-white/5 p-4 transition"
                              >
                                <summary className="cursor-pointer list-none text-sm font-semibold text-white flex items-center justify-between">
                                  <span>{item.question}</span>
                                  <span className="text-[var(--gold)] transition-transform group-open:rotate-45">
                                    +
                                  </span>
                                </summary>
                                <p className="mt-3 text-xs leading-relaxed text-white/80 border-t border-white/10 pt-3">
                                  {item.answer}
                                </p>
                              </details>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CARTÃO 7: INSCRIÇÃO */}
                      {card.id === "inscricao" && (
                        <div className="my-auto flex flex-col items-center text-center">
                          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--amber)]/40 bg-[var(--amber)]/10 px-4 py-1.5 text-xs font-bold text-[var(--gold)]">
                            <Ticket className="h-4 w-4" />
                            {camp?.currentBatch?.name ?? "Lote Atual"}
                          </div>

                          <p className="mt-4 font-serif text-[clamp(2.5rem,7vw,4rem)] font-bold text-white tracking-tight">
                            {price ?? "Consulte liderança"}
                          </p>

                          <p className="mt-2 text-sm text-white/80">
                            {camp?.availableSpots
                              ? `Apenas ${camp.availableSpots} vagas restantes neste lote!`
                              : "Garanta a sua vaga antes da virada de lote."}
                          </p>

                          <Link
                            href="/inscricao"
                            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--amber)] to-[var(--gold)] px-8 py-4 text-base font-bold text-[var(--abyss)] shadow-xl shadow-[var(--amber)]/25 transition hover:scale-[1.04] active:scale-[0.98]"
                          >
                            Garantir Minha Credencial <ChevronRight className="h-5 w-5" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
