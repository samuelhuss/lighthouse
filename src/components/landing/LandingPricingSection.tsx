"use client";

import { useState } from "react";

import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";
import { ArrowLeft, CheckCircle2, Clock, CreditCard, ShieldCheck } from "lucide-react";
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

  const [showForm, setShowForm] = useState(false);

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
          <div className="rounded-[2.5rem] border border-white/20 bg-[#0e2043]/90 p-6 sm:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="grid">
              
              {/* ETAPA 1: Informações (Esconde ao clicar em continuar) */}
              <div 
                className={`col-start-1 row-start-1 transition-all duration-500 flex flex-col lg:flex-row gap-8 lg:gap-12 ${showForm ? 'opacity-0 pointer-events-none -translate-x-8' : 'opacity-100 translate-x-0 relative z-10'}`}
              >
                {/* Esquerda: Preço de Impacto */}
                <div className="flex flex-col justify-center lg:w-[45%] shrink-0 pb-2 lg:pb-0 relative">
                  {/* Efeito de brilho atrás do preço */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-[var(--gold)]/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-4 py-1.5 text-[10px] sm:text-xs font-mono text-[var(--gold)] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(232,175,46,0.15)]">
                      <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[var(--gold)] animate-pulse" />
                      {activeBatchName} ATIVO
                    </span>
                    
                    <div className="mt-4 sm:mt-6 mb-2">
                      <span className="font-serif text-[clamp(3.5rem,8vw,5.5rem)] font-extrabold text-white leading-none drop-shadow-xl">
                        {price ?? "Consulte"}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-white/70 font-medium">
                      Por campista. Pagamento 100% seguro.
                    </p>

                    <div className="mt-6 sm:mt-10 flex items-center justify-center lg:justify-start gap-4 text-[10px] sm:text-xs font-semibold text-emerald-400">
                      <div className="flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                        <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Compra Criptografada
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direita: Inclusões, Condições e Botão */}
                <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-10 xl:pl-12">
                  <div className="flex-1 flex flex-col space-y-6 sm:space-y-8">
                    
                    {/* O que o valor inclui? */}
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-4">
                        {campContent.pricingIncludedTitle}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {campContent.included.map((item, index) => (
                          <li key={item} className="flex items-start gap-2.5 text-[12px] sm:text-[13px] text-white/90 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Condições de Pagamento */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--gold)]" />
                        {campContent.paymentConditionsTitle}
                      </h3>
                      <ul className="space-y-2">
                        {campContent.paymentConditions.map((cond) => (
                          <li key={cond} className="flex items-center gap-2.5 text-[12px] sm:text-[13px] text-white/85 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
                            <span>{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA de Avançar */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mt-auto pt-6">
                      <p className="text-[11px] sm:text-xs text-white/70 mb-4 leading-relaxed text-center sm:text-left">
                        Ao prosseguir, você concorda com as regras do acampamento. Clique abaixo para informar seus dados e realizar o pagamento.
                      </p>
                      <button 
                        onClick={() => setShowForm(true)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] px-6 py-4 text-xs sm:text-sm font-extrabold text-[#0e2043] shadow-[0_4px_20px_rgba(232,175,46,0.25)] transition-all hover:scale-[1.02] hover:bg-amber-300"
                      >
                        Avançar para o Formulário
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ETAPA 2: O Formulário Isolado (Aparece após continuar) */}
              <div 
                className={`col-start-1 row-start-1 transition-all duration-700 w-full max-w-3xl mx-auto flex flex-col h-full ${showForm ? 'opacity-100 translate-x-0 relative z-20' : 'opacity-0 translate-x-12 pointer-events-none'}`}
              >
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-4 gap-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-white">Formulário de Inscrição</h3>
                    <p className="text-[10px] sm:text-xs text-[var(--gold)] font-medium tracking-widest uppercase mt-1">Passaporte Oficial • {activeBatchName}</p>
                  </div>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-white/40"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Voltar
                  </button>
                </div>
                
                <div className="w-full flex-1">
                  <RegistrationForm />
                </div>
              </div>

            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
