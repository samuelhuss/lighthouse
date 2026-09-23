"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Check,
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
    <div className="relative mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center p-1 sm:p-2">
      {/* Canvas Principal sem nenhuma caixa interna */}
      <div className="minimal-glass-card relative flex h-[500px] sm:h-[540px] lg:h-[570px] w-full flex-col overflow-hidden rounded-[2.25rem] p-5 sm:p-8 lg:p-10 text-white shadow-2xl shrink-0 border border-white/35 backdrop-blur-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* SEÇÃO 1: INÍCIO */}
            {activeId === "inicio" && (
              <div className="my-auto flex flex-col items-start max-w-3xl">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
                  SALMOS 27:1
                </p>

                <h1 className="mt-2 font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[0.96] tracking-tight text-white drop-shadow-sm">
                  LIGHTHOUSE’27
                </h1>

                {/* Versículo Tema como subtítulo fluido (Sem caixa de citação) */}
                <p className="mt-3 sm:mt-4 max-w-2xl font-serif italic text-sm sm:text-lg leading-relaxed text-white/95">
                  {campContent.verseText}
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--gold)]">
                  — {campContent.verseReference}
                </p>

                {/* Linha de Metadata sem sub-cards */}
                <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-white/20 pt-4 sm:pt-5 w-full">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/95">
                    <Calendar className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>{period}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/95">
                    <MapPin className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>{place}</span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/inscricao"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold text-[#0e2043] shadow-xl transition hover:bg-[var(--gold)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Garantir minha vaga <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onChangeStage("sobre")}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SEÇÃO 2: SOBRE */}
            {activeId === "sobre" && (
              <div className="my-auto flex flex-col max-w-3xl">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Sobre o retiro
                </span>
                <h2 className="mt-1.5 font-serif text-2xl sm:text-4xl font-normal text-white leading-tight">
                  {campContent.aboutTitle}
                </h2>
                <p className="mt-3 text-xs sm:text-base leading-relaxed text-white/90">
                  {campContent.aboutText}
                </p>

                {/* Lista fluida sem caixas internas */}
                <div className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2 border-t border-white/20 pt-4">
                  <div className="flex items-start gap-3">
                    <Flame className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Presença & Cultos</h3>
                      <p className="mt-0.5 text-xs text-white/80">
                        Noites de louvor e palavra transformadora.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Comunhão da Igreja</h3>
                      <p className="mt-0.5 text-xs text-white/80">
                        Refeições juntas e amizades fortalecidas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Descanso na Natureza</h3>
                      <p className="mt-0.5 text-xs text-white/80">
                        Longe da correria e barulho da cidade.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HeartHandshake className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Cuidado & Devocional</h3>
                      <p className="mt-0.5 text-xs text-white/80">
                        Equipe dedicada a servir cada irmão.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEÇÃO 3: PROGRAMAÇÃO */}
            {activeId === "programa" && (
              <div className="my-auto flex flex-col">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Cronograma
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                  Três dias de fé.
                </h2>

                {/* Colunas fluida sem caixas internas */}
                <div className="mt-5 grid gap-4 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
                  {campContent.program.map((day, idx) => (
                    <div
                      key={day.day}
                      className={idx > 0 ? "pt-3 sm:pt-0 sm:pl-4" : ""}
                    >
                      <h3 className="font-serif text-lg font-bold text-[var(--gold)]">
                        {day.day}
                      </h3>
                      <ul className="mt-2.5 space-y-2 text-xs text-white/90 leading-relaxed">
                        {day.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 4: LOCAL */}
            {activeId === "local" && (
              <div className="my-auto flex flex-col max-w-2xl">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Localização
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">{place}</h2>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/90">
                  Um refúgio tranquilo com infraestrutura pronta para acolher toda a igreja.
                </p>

                {/* Lista fluida de itens */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2 border-t border-white/20 pt-4">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-white">
                    <Home className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Chalés climatizados</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-white">
                    <Utensils className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Refeitório completo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-white">
                    <BookOpen className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Auditório equipado</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-white">
                    <Coffee className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Área de convivência</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-xs text-white/70">Instruções enviadas na confirmação.</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--gold)] transition hover:bg-white/20"
                  >
                    Abrir no Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* SEÇÃO 5: INCLUSO */}
            {activeId === "incluido" && (
              <div className="my-auto flex flex-col max-w-2xl">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Incluso no Passe
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                  Tudo preparado para você.
                </h2>

                {/* Lista fluida sem caixas */}
                <div className="mt-5 space-y-3 border-t border-white/20 pt-4">
                  {campContent.included.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-white/95">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 6: FAQ */}
            {activeId === "faq" && (
              <div className="my-auto flex flex-col max-w-2xl">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Dúvidas Frequentes
                </span>
                <h2 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                  Perguntas rápidas.
                </h2>

                <div className="mt-4 divide-y divide-white/20">
                  {campContent.faq.map((item) => (
                    <details key={item.question} className="group py-3">
                      <summary className="cursor-pointer list-none text-xs sm:text-sm font-semibold text-white flex items-center justify-between">
                        <span>{item.question}</span>
                        <span className="text-[var(--gold)] transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-2 text-xs leading-relaxed text-white/85">
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
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
                  LIGHTHOUSE’27
                </span>

                <h2 className="mt-3 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-normal text-white leading-none">
                  {price ?? "Consulte liderança"}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-white/90">
                  {camp?.availableSpots
                    ? `Apenas ${camp.availableSpots} vagas restantes!`
                    : "Garanta seu lugar com o lote atual."}
                </p>

                <div className="mt-6 flex flex-col items-center gap-2.5 w-full">
                  <Link
                    href="/inscricao"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm sm:text-base font-bold text-[#0e2043] shadow-xl transition hover:bg-[var(--gold)] hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
                  >
                    Fazer Minha Inscrição <ArrowRight className="h-4.5 w-4.5" />
                  </Link>

                  <span className="text-[11px] text-white/70">
                    Pagamento 100% seguro via Mercado Pago.
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
