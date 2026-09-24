"use client";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { CheckCircle2, Clock, CreditCard, ShieldCheck } from "lucide-react";
import { campContent } from "@/content/camp";
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

  const dbBatches: BatchInfo[] = camp?.batches?.length
    ? camp.batches
    : [
        { id: "1", name: "1º Lote", isCurrent: true, startsAt: null, endsAt: null, priceCents: null },
        { id: "2", name: "2º Lote", isCurrent: false, startsAt: null, endsAt: null, priceCents: null },
        { id: "3", name: "3º Lote", isCurrent: false, startsAt: null, endsAt: null, priceCents: null },
      ];

  return (
    <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
      {/* SEÇÃO 1: CRONOGRAMA DE LOTES */}
      <section id="lotes" className="mx-auto max-w-5xl">
        <RevealOnScroll className="text-left mb-8 sm:mb-10">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5 text-[var(--gold)]" /> ETAPAS DO EVENTO
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-white leading-tight">
            Lotes
          </h2>
          <p className="mt-2 text-sm text-white/80 font-normal">
            Acompanhe a evolução e a transição dos lotes.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="rounded-[2.5rem] border border-white/20 bg-[#0e2043]/90 p-6 sm:p-10 backdrop-blur-3xl shadow-2xl overflow-x-auto">
            <div className={`min-w-[650px] grid grid-cols-${Math.max(dbBatches.length, 3)} divide-x divide-dashed divide-white/20 relative`}>
              {dbBatches.map((b, idx) => {
                const headerTitle = formatMonthOrName(b.startsAt, b.name);
                const dateRangeStr = formatDateRange(b.startsAt, b.endsAt);

                return (
                  <div key={b.id || b.name} className="flex flex-col px-4 sm:px-6 py-2 min-h-[220px]">
                    <div className="text-center font-serif text-base sm:text-lg font-bold text-[var(--gold)] mb-1">
                      {headerTitle}
                    </div>
                    {dateRangeStr && (
                      <div className="text-center text-[10px] font-mono text-white/50 mb-4">
                        {dateRangeStr}
                      </div>
                    )}

                    <div
                      className="flex-1 flex items-start"
                      style={{ paddingTop: `${idx * 44}px` }}
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

      {/* SEÇÃO 2: FORMULÁRIO DE INSCRIÇÃO & INCLUSÕES & CONDIÇÕES DE PAGAMENTO */}
      <section id="inscricao" className="mx-auto max-w-5xl border-t border-white/15 pt-16 sm:pt-24">
        <RevealOnScroll className="text-left mb-8 sm:mb-10">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold block mb-2">
            INSCRIÇÃO OFICIAL
          </span>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-extrabold text-white leading-tight">
            Faça sua Inscrição
          </h2>
          <p className="mt-2 text-sm text-white/80 font-normal">
            Preencha seus dados para emitir a sua vaga.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="rounded-[2.5rem] border border-white/20 bg-[#0e2043]/90 p-6 sm:p-10 backdrop-blur-3xl shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Esquerda: Preço, O que inclui (1 a 4) e Condições de Pagamento */}
            <div className="flex flex-col justify-between lg:w-[42%] border-b lg:border-b-0 lg:border-r border-white/15 pb-8 lg:pb-0 lg:pr-8 shrink-0 space-y-6">
              <div>
                <span className="inline-block rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-xs font-mono text-[var(--gold)] font-bold uppercase">
                  {activeBatchName} ATIVO
                </span>

                <div className="mt-3">
                  <span className="font-serif text-[clamp(2.5rem,5vw,3.8rem)] font-extrabold text-white leading-none">
                    {price ?? "Consulte a liderança"}
                  </span>
                </div>

                {/* O que o valor inclui? */}
                <div className="mt-6 border-t border-white/15 pt-6">
                  <h3 className="font-serif text-lg font-bold text-white mb-3">
                    {campContent.pricingIncludedTitle}
                  </h3>
                  <ol className="space-y-2.5">
                    {campContent.included.map((item, index) => (
                      <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-medium">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 font-mono text-xs font-bold text-[var(--gold)]">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Condições de Pagamento */}
                <div className="mt-6 border-t border-white/15 pt-6">
                  <h3 className="font-serif text-base font-bold text-white mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[var(--gold)]" />
                    {campContent.paymentConditionsTitle}
                  </h3>
                  <ul className="space-y-2">
                    {campContent.paymentConditions.map((cond) => (
                      <li key={cond} className="flex items-center gap-2 text-xs text-white/85 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
