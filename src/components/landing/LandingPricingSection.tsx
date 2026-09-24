"use client";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { CheckCircle2, Clock } from "lucide-react";
import type { CampInfo, BatchInfo } from "@/components/landing/types";

type LandingPricingSectionProps = {
  camp: CampInfo | null;
  price: string | null;
};

function formatMonthOrName(dateVal: Date | string | null, fallbackName: string) {
  if (!dateVal) return fallbackName;
  const d = new Date(dateVal);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(d);
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
}

function formatDateRange(startsAt: Date | string | null, endsAt: Date | string | null) {
  if (!startsAt) return null;
  const start = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(startsAt));
  if (!endsAt) return `A partir de ${start}`;
  const end = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(endsAt));
  return `${start} até ${end}`;
}

export function LandingPricingSection({ camp, price }: LandingPricingSectionProps) {
  const activeBatchName = camp?.currentBatch?.name ?? "1º Lote";

  // Lotes 100% dinâmicos vindos do banco de dados (Prisma)
  const dbBatches: BatchInfo[] = camp?.batches?.length
    ? camp.batches
    : [
        { id: "1", name: "1º Lote", isCurrent: true, startsAt: null, endsAt: null, priceCents: null },
        { id: "2", name: "2º Lote", isCurrent: false, startsAt: null, endsAt: null, priceCents: null },
        { id: "3", name: "3º Lote", isCurrent: false, startsAt: null, endsAt: null, priceCents: null },
      ];

  return (
    <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
      {/* 
        SEÇÃO 1: CRONOGRAMA DE LOTES (DADOS 100% DINÂMICOS DO BANCO)
        Conceito de matriz em cascata nas cores oficiais do site (Gold, Marinho e Vidro Fosco)
      */}
      <section id="lotes" className="mx-auto max-w-5xl">
        <RevealOnScroll className="text-left mb-8 sm:mb-10">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5 text-[var(--gold)]" /> ETAPAS DO EVENTO
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-white leading-tight">
            Lotes
          </h2>
          <p className="mt-2 text-sm text-white/80 font-normal">
            Acompanhe a evolução e a transição dos lotes direto do sistema.
          </p>
        </RevealOnScroll>

        {/* Matriz Cascata com Dados Reais do Banco de Dados */}
        <RevealOnScroll delay={0.1}>
          <div className="rounded-[2.5rem] border border-white/20 bg-[#0e2043]/90 p-6 sm:p-10 backdrop-blur-3xl shadow-2xl overflow-x-auto">
            <div className={`min-w-[650px] grid grid-cols-${Math.max(dbBatches.length, 3)} divide-x divide-dashed divide-white/20 relative`}>
              {dbBatches.map((b, idx) => {
                const headerTitle = formatMonthOrName(b.startsAt, b.name);
                const dateRangeStr = formatDateRange(b.startsAt, b.endsAt);

                return (
                  <div key={b.id || b.name} className="flex flex-col px-4 sm:px-6 py-2 min-h-[240px]">
                    {/* Cabeçalho da Coluna: Mês / Data vinda do Banco */}
                    <div className="text-center font-serif text-base sm:text-lg font-bold text-[var(--gold)] mb-1">
                      {headerTitle}
                    </div>
                    {dateRangeStr && (
                      <div className="text-center text-[10px] font-mono text-white/50 mb-4">
                        {dateRangeStr}
                      </div>
                    )}

                    {/* Pílula Cascata com Nome Dinâmico do Lote */}
                    <div
                      className="flex-1 flex items-start"
                      style={{ paddingTop: `${idx * 48}px` }}
                    >
                      <div
                        className={`w-full py-3.5 px-4 rounded-full text-center text-xs font-serif font-bold transition-all shadow-xl border ${
                          b.isCurrent
                            ? "bg-[#162747] text-white border-[var(--gold)] ring-2 ring-[var(--gold)]/40 shadow-[0_4px_25px_rgba(232,175,46,0.35)]"
                            : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {b.isCurrent && (
                            <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-ping shrink-0" />
                          )}
                          <span>{b.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 
        SEÇÃO 2: FORMULÁRIO DE INSCRIÇÃO
        Totalmente independente com respiro e layout limpo
      */}
      <section id="inscricao" className="mx-auto max-w-5xl border-t border-white/15 pt-16 sm:pt-24">
        <RevealOnScroll className="text-left mb-8 sm:mb-10">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold block mb-2">
            INSCRIÇÃO OFICIAL
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-white leading-tight">
            Garanta a sua vaga.
          </h2>
          <p className="mt-2 text-sm text-white/80 font-normal">
            Preencha seus dados para reservar seu lugar no acampamento.
          </p>
        </RevealOnScroll>

        {/* Container da Inscrição */}
        <RevealOnScroll delay={0.15}>
          <div className="rounded-[2.5rem] border border-white/20 bg-[#0e2043]/90 p-6 sm:p-10 backdrop-blur-3xl shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Esquerda: Valor do Lote Atual e Inclusões */}
            <div className="flex flex-col justify-between lg:w-[38%] border-b lg:border-b-0 lg:border-r border-white/15 pb-6 lg:pb-0 lg:pr-8 shrink-0">
              <div>
                <span className="inline-block rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-xs font-mono text-[var(--gold)] font-bold uppercase">
                  {activeBatchName} ATIVO
                </span>

                <div className="mt-4">
                  <span className="font-serif text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold text-white leading-none">
                    {price ?? "Consulte liderança"}
                  </span>
                  <p className="mt-2 text-xs text-white/70 font-medium">
                    Passe individual com tudo incluso
                  </p>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-white/90 font-medium border-t border-white/15 pt-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Hospedagem nos 3 dias</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Todas as refeições inclusas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Kit exclusivo do participante</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Direita: Formulário de Inscrição */}
            <div className="flex-1 flex flex-col justify-center">
              <RegistrationForm />
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
