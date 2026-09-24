"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Calendar,
  ExternalLink,
  Flame,
  Users,
  HeartHandshake,
  Sun,
  Clock,
  Home,
  Utensils,
  BookOpen,
  Coffee,
  Quote,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Zap,
} from "lucide-react";
import { campContent } from "@/content/camp";
import type { CampInfo } from "@/components/landing/types";
import type { StageId } from "./AppleDockNav";

type MinimalGlassCanvasProps = {
  activeId: StageId;
  onChangeStage: (id: StageId) => void;
  camp: CampInfo | null;
  price: string | null;
  period: string;
  place: string;
};

export function MinimalGlassCanvas({
  activeId,
  onChangeStage,
  camp,
  price,
  period,
  place,
}: MinimalGlassCanvasProps) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center p-1 sm:p-2">
      {/* 
        Telas Pequenas / Mobile (< lg):
        Exibe uma página contínua e fluida com TODAS as seções ricas em sequência.
        Cada seção possui id="section-{id}" para navegação rápida pelo dock flutuante.
      */}
      <div className="block lg:hidden w-full space-y-6 pb-24">
        {/* SEÇÃO 1: INÍCIO (MOBILE) */}
        <section
          id="section-inicio"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> LIGHTHOUSE’27
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 1º Lote Aberto
            </span>
          </div>

          <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-extrabold leading-[0.98] tracking-tight text-white">
            LIGHTHOUSE’27
          </h1>

          {/* Versículo Tema */}
          <div className="mt-3.5 rounded-2xl border border-[var(--gold)]/30 bg-white/10 p-4 backdrop-blur-md relative">
            <Quote className="h-4 w-4 text-[var(--gold)]/50 absolute top-3 right-3" />
            <p className="font-serif italic text-xs leading-relaxed text-white/95 pr-5">
              {campContent.verseText}
            </p>
            <p className="mt-1.5 text-[11px] font-bold text-[var(--gold)] text-right">
              — {campContent.verseReference}
            </p>
          </div>

          {/* Métricas */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center">
              <p className="font-serif text-base font-bold text-[var(--gold)]">3 Dias</p>
              <p className="text-[10px] text-white/75">Imersão de Fé</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center">
              <p className="font-serif text-base font-bold text-[var(--gold)]">100%</p>
              <p className="text-[10px] text-white/75">Alimentação Inclusa</p>
            </div>
          </div>

          {/* Data e Local */}
          <div className="mt-3 rounded-xl border border-white/20 bg-white/10 p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Calendar className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <span>{period}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
              <span>{place}</span>
            </div>
          </div>

          {/* CTA Mobile */}
          <div className="mt-5 flex flex-col gap-2.5">
            <Link
              href="/inscricao"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs font-bold text-[#0e2043] shadow-lg transition hover:bg-[var(--gold)] active:scale-[0.98]"
            >
              Garantir minha vaga <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* SEÇÃO 2: SOBRE (MOBILE) */}
        <section
          id="section-sobre"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Nossa Essência
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white leading-tight">
            {campContent.aboutTitle}
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-white/90">
            {campContent.aboutText}
          </p>

          {/* 4 Pilares */}
          <div className="mt-4 grid gap-2.5">
            {campContent.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-xl border border-white/20 bg-white/10 p-3 flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/20 text-[var(--gold)]">
                  {pillar.id === "louvor" && <Flame className="h-4 w-4" />}
                  {pillar.id === "comunhao" && <Users className="h-4 w-4" />}
                  {pillar.id === "descanso" && <Sun className="h-4 w-4" />}
                  {pillar.id === "devocional" && <HeartHandshake className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{pillar.title}</h3>
                  <p className="mt-0.5 text-[11px] text-white/80 leading-snug">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: PROGRAMAÇÃO (MOBILE) */}
        <section
          id="section-programa"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Cronograma Oficial
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Três dias marcantes.
          </h2>

          <div className="mt-4 space-y-3">
            {campContent.program.map((day) => (
              <div
                key={day.day}
                className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[var(--gold)]">
                      {day.day}
                    </h3>
                    <p className="text-[10px] text-white/60">{day.date}</p>
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase text-white/80">
                    {day.tag}
                  </span>
                </div>
                <ul className="mt-2.5 space-y-2 text-xs text-white/90">
                  {day.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-2">
                      <span className="rounded bg-[var(--gold)]/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--gold)] shrink-0">
                        {item.time}
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-white/90">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 4: LOCAL (MOBILE) */}
        <section
          id="section-local"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Estrutura & Espaço
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">{place}</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/90">
            Estrutura completa com chalés, refeitório, auditório climatizado e áreas verdes para edificação da igreja.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {campContent.venueFeatures.map((feat) => (
              <div key={feat.name} className="rounded-xl border border-white/20 bg-white/10 p-2.5">
                <h3 className="text-xs font-bold text-[var(--gold)]">{feat.name}</h3>
                <p className="mt-0.5 text-[10px] text-white/75 leading-tight">{feat.desc}</p>
              </div>
            ))}
          </div>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/30 bg-white/10 py-2.5 text-xs font-semibold text-[var(--gold)] transition hover:bg-white/20"
          >
            Abrir no Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>

        {/* SEÇÃO 5: INCLUSO (MOBILE) */}
        <section
          id="section-incluido"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Transparência Total
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Tudo incluso no passe.
          </h2>

          <div className="mt-3.5 space-y-2">
            {campContent.included.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 p-3"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-white/95">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 6: FAQ (MOBILE) */}
        <section
          id="section-faq"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
            Dúvidas Frequentes
          </span>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Perguntas Rápidas
          </h2>

          <div className="mt-3.5 space-y-2">
            {campContent.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-white/20 bg-white/10 p-3 transition"
              >
                <summary className="cursor-pointer list-none text-xs font-semibold text-white flex items-center justify-between">
                  <span>{item.question}</span>
                  <ChevronDown className="h-4 w-4 text-[var(--gold)] transition-transform group-open:rotate-180 shrink-0 ml-2" />
                </summary>
                <p className="mt-2 border-t border-white/15 pt-2 text-[11px] leading-relaxed text-white/85">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* SEÇÃO 7: INSCRIÇÃO (MOBILE) */}
        <section
          id="section-inscricao"
          className="minimal-glass-card rounded-[2rem] p-5 sm:p-7 text-center text-white backdrop-blur-3xl border border-white/25 shadow-xl"
        >
          <span className="inline-block rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
            {camp?.currentBatch?.name ?? "1º Lote Disponível"}
          </span>

          <h2 className="mt-3 font-serif text-3xl font-extrabold text-white">
            {price ?? "Consulte liderança"}
          </h2>

          <p className="mt-1.5 text-xs text-white/90">
            {camp?.availableSpots
              ? `Apenas ${camp.availableSpots} vagas restantes neste lote!`
              : "Garanta seu lugar com alimentação e hospedagem inclusas."}
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/inscricao"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-xs font-bold text-[#0e2043] shadow-xl transition hover:bg-[var(--gold)] active:scale-[0.98]"
            >
              Fazer Minha Inscrição Agora <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="text-[10px] text-white/70">
              Pagamento 100% seguro via Pix ou Cartão em até 12x.
            </span>
          </div>
        </section>
      </div>

      {/* 
        Telas Grandes / Desktop (>= lg):
        Renderiza o card canvas com tamanho fixo e transições ultra fluidas por aba,
        com visual altamente rico, denso e sofisticado.
      */}
      <div className="hidden lg:block minimal-glass-card relative h-[600px] w-full overflow-hidden rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl border border-white/25 backdrop-blur-3xl shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* SEÇÃO 1: INÍCIO */}
            {activeId === "inicio" && (
              <div className="my-auto flex flex-col items-start max-w-3xl">
                {/* Badges do Topo */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)] backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" /> LIGHTHOUSE’27
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 1º Lote Aberto
                  </span>
                </div>

                <h1 className="mt-4 font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[0.96] tracking-tight text-white drop-shadow-md">
                  LIGHTHOUSE’27
                </h1>

                {/* Versículo Tema em Card de Citação Iluminado */}
                <div className="mt-4 rounded-2xl border border-[var(--gold)]/30 bg-white/10 p-5 backdrop-blur-md relative w-full">
                  <Quote className="h-5 w-5 text-[var(--gold)]/50 absolute top-3.5 right-3.5" />
                  <p className="font-serif italic text-base leading-relaxed text-white/95 pr-6">
                    {campContent.verseText}
                  </p>
                  <p className="mt-2 text-xs font-bold text-[var(--gold)] text-right">
                    — {campContent.verseReference}
                  </p>
                </div>

                {/* Métricas e Info Bar */}
                <div className="mt-5 grid grid-cols-4 gap-3 w-full">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3.5 text-center backdrop-blur-md">
                    <p className="font-serif text-xl font-bold text-[var(--gold)]">3 Dias</p>
                    <p className="text-[11px] text-white/75">Imersão de Fé</p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-3.5 text-center backdrop-blur-md">
                    <p className="font-serif text-xl font-bold text-[var(--gold)]">100%</p>
                    <p className="text-[11px] text-white/75">Alimentação Inclusa</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/20 bg-white/10 p-3.5 flex items-center justify-around backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Calendar className="h-4 w-4 text-[var(--gold)] shrink-0" />
                      <span>{period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
                      <span>{place}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="mt-6 flex items-center gap-3 w-full">
                  <Link
                    href="/inscricao"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-[#0e2043] shadow-xl transition hover:bg-[var(--gold)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Garantir minha vaga <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onChangeStage("sobre")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Conhecer a programação <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SEÇÃO 2: SOBRE */}
            {activeId === "sobre" && (
              <div className="my-auto flex flex-col max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Nossa Essência
                </span>
                <h2 className="mt-1.5 font-serif text-3xl font-extrabold text-white leading-tight">
                  {campContent.aboutTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  {campContent.aboutText}
                </p>

                {/* 4 Cards de Recursos Ricos */}
                <div className="mt-5 grid grid-cols-2 gap-3.5">
                  {campContent.pillars.map((pillar) => (
                    <div
                      key={pillar.id}
                      className="rounded-2xl border border-white/20 bg-white/10 p-4 flex items-start gap-3.5 backdrop-blur-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold)]/20 text-[var(--gold)]">
                        {pillar.id === "louvor" && <Flame className="h-5 w-5" />}
                        {pillar.id === "comunhao" && <Users className="h-5 w-5" />}
                        {pillar.id === "descanso" && <Sun className="h-5 w-5" />}
                        {pillar.id === "devocional" && <HeartHandshake className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{pillar.title}</h3>
                        <p className="mt-1 text-xs text-white/80 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 3: PROGRAMAÇÃO */}
            {activeId === "programa" && (
              <div className="my-auto flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Cronograma Oficial
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-white">
                  Três dias marcantes na presença de Deus.
                </h2>

                <div className="mt-5 grid grid-cols-3 gap-3.5">
                  {campContent.program.map((day) => (
                    <div
                      key={day.day}
                      className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-[var(--gold)]">
                              {day.day}
                            </h3>
                            <p className="text-[10px] text-white/60">{day.date}</p>
                          </div>
                          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-white/80">
                            {day.tag}
                          </span>
                        </div>
                        <ul className="mt-3 space-y-2.5 text-xs text-white/90">
                          {day.items.map((item) => (
                            <li key={item.title} className="flex items-start gap-2">
                              <span className="rounded bg-[var(--gold)]/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--gold)] shrink-0">
                                {item.time}
                              </span>
                              <span className="text-xs font-medium leading-tight text-white/90">
                                {item.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 4: LOCAL */}
            {activeId === "local" && (
              <div className="my-auto flex flex-col max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Estrutura & Espaço
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-white">{place}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Um refúgio tranquilo com infraestrutura pronta para acolher toda a igreja com conforto, segurança e beleza natural.
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {campContent.venueFeatures.map((feat) => (
                    <div
                      key={feat.name}
                      className="rounded-xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md"
                    >
                      <h3 className="text-xs font-bold text-[var(--gold)]">{feat.name}</h3>
                      <p className="mt-1 text-[11px] text-white/80 leading-snug">{feat.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-xs text-white/75">Instruções detalhadas de rota enviadas no grupo oficial.</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-[var(--gold)] transition hover:bg-white/20"
                  >
                    Abrir no Google Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* SEÇÃO 5: INCLUSO */}
            {activeId === "incluido" && (
              <div className="my-auto flex flex-col max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Transparência Total
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-white">
                  Tudo incluso no seu investimento.
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {campContent.included.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-white/95">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 6: FAQ */}
            {activeId === "faq" && (
              <div className="my-auto flex flex-col max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Dúvidas Frequentes
                </span>
                <h2 className="mt-1 font-serif text-3xl font-bold text-white">
                  Perguntas Rápidas
                </h2>

                <div className="mt-4 space-y-2.5">
                  {campContent.faq.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-2xl border border-white/20 bg-white/10 p-4 transition"
                    >
                      <summary className="cursor-pointer list-none text-xs sm:text-sm font-semibold text-white flex items-center justify-between">
                        <span>{item.question}</span>
                        <ChevronDown className="h-4 w-4 text-[var(--gold)] transition-transform group-open:rotate-180 shrink-0 ml-2" />
                      </summary>
                      <p className="mt-2.5 border-t border-white/15 pt-2.5 text-xs leading-relaxed text-white/85">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 7: INSCRIÇÃO */}
            {activeId === "inscricao" && (
              <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto">
                <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/20 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  {camp?.currentBatch?.name ?? "1º Lote Disponível"}
                </span>

                <h2 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4rem)] font-extrabold text-white leading-none">
                  {price ?? "Consulte liderança"}
                </h2>

                <p className="mt-2 text-sm text-white/90">
                  {camp?.availableSpots
                    ? `Apenas ${camp.availableSpots} vagas restantes neste lote!`
                    : "Garanta seu lugar com hospedagem e alimentação inclusas."}
                </p>

                <div className="mt-6 flex flex-col items-center gap-3 w-full">
                  <Link
                    href="/inscricao"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-9 py-4 text-base font-bold text-[#0e2043] shadow-xl transition hover:bg-[var(--gold)] hover:scale-[1.03] active:scale-[0.98] w-full"
                  >
                    Fazer Minha Inscrição Agora <ArrowRight className="h-5 w-5" />
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-white/75 mt-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Mercado Pago
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-[var(--gold)]" /> Até 12x no cartão
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

