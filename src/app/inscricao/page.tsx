import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { HeroAmbience } from "@/components/landing/HeroAmbience";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { campContent } from "@/content/camp";

export default function RegistrationPage() {
  return (
    <main className="landing-hero-bg fixed inset-0 z-0 flex h-[100dvh] flex-col overflow-hidden text-white">
      {/* Luz ambiente & farol */}
      <HeroAmbience />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-2.5 sm:p-5 lg:p-7">
        {/* Header Superior */}
        <header className="minimal-glass-dock mx-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-xl border border-white/35 backdrop-blur-3xl shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-sm sm:text-base font-bold text-white transition hover:text-[var(--gold)]"
          >
            <LighthouseMark size={20} className="text-[var(--gold)]" />
            <span className="tracking-widest uppercase font-extrabold">LIGHTHOUSE’27</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </Link>
        </header>

        {/* Canvas da Inscrição: Rolável no mobile e Fixo no desktop */}
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center py-2">
          <div className="minimal-glass-card relative flex h-full max-h-[calc(100dvh-85px)] lg:max-h-[640px] w-full flex-col lg:flex-row overflow-y-auto lg:overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-7 text-white shadow-2xl gap-4 sm:gap-6 border border-white/35 backdrop-blur-3xl">
            {/* Lado Esquerdo / Superior: Informações do Evento */}
            <div className="flex flex-col justify-between lg:w-[42%] border-b lg:border-b-0 lg:border-r border-white/20 pb-3 lg:pb-0 lg:pr-6 shrink-0">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--gold)]">
                  SALMOS 27:1
                </span>

                <h1 className="mt-1 sm:mt-2 font-serif text-2xl sm:text-4xl font-extrabold leading-[0.98] text-white">
                  LIGHTHOUSE’27
                </h1>

                <p className="mt-2 font-serif italic text-xs leading-relaxed text-white/95">
                  {campContent.verseText}
                </p>
              </div>

              {/* Incluso no Passe */}
              <div className="mt-3 space-y-1.5 border-t border-white/20 pt-2.5">
                <div className="flex items-center justify-between pb-0.5">
                  <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                    Incluso no Passe
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> 100% Incluso
                  </span>
                </div>

                <ul className="space-y-1 text-[11px] sm:text-xs text-white/90">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Hospedagem em quartos confortáveis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Alimentação completa nos 3 dias</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Ministrações e momentos de louvor</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Lado Direito / Inferior: Formulário */}
            <div className="flex-1 min-h-0 flex flex-col justify-center">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}