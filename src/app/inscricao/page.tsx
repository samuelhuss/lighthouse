import Image from "next/image";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { HeroAmbience } from "@/components/landing/HeroAmbience";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Calendar, MapPin, Sparkles } from "lucide-react";
import { campContent } from "@/content/camp";

export default function RegistrationPage() {
  return (
    <main className="relative min-h-screen z-0 flex flex-col text-white pb-16 selection:bg-[var(--gold)] selection:text-[#0e2043]">
      {/* Background canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroAmbience />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="flex w-full items-center justify-between rounded-full px-5 py-3 shadow-xl border border-white/20 bg-[#0e2043]/80 backdrop-blur-2xl shrink-0 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/lighthouse-icon.png"
              alt="Lighthouse Farol"
              width={32}
              height={32}
              className="h-7 w-auto object-contain drop-shadow-md"
            />
            <span className="font-serif text-sm sm:text-base tracking-widest text-white font-extrabold uppercase">
              LIGHTHOUSE’27
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-white/20 hover:border-white/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </Link>
        </header>

        {/* Card Principal Centralizado */}
        <div className="w-full max-w-3xl flex flex-col items-center justify-center mx-auto my-auto">
          <div className="minimal-glass-card relative flex w-full flex-col rounded-[2rem] p-6 sm:p-10 text-white shadow-2xl border border-white/25 backdrop-blur-3xl overflow-hidden">
            {/* Linha Dourada Topo */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--amber)] via-[var(--gold)] to-emerald-400" />

            {/* Cabeçalho Compacto do Formulário */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--gold)] mb-3">
                  <Sparkles className="h-3 w-3" /> PASSE OFICIAL
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                  Sua Inscrição
                </h2>
                <p className="text-xs text-white/70 mt-1 max-w-sm">
                  Preencha seus dados com atenção. Hospedagem e alimentação 100% inclusas.
                </p>
              </div>
              
              <div className="flex flex-col gap-1 text-[11px] text-white/80 font-medium md:text-right shrink-0">
                <span className="flex items-center md:justify-end gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" /> 05 — 09 de Fevereiro
                </span>
                <span className="flex items-center md:justify-end gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" /> Elias Fausto, SP
                </span>
                <span className="flex items-center md:justify-end gap-1.5 mt-1 text-emerald-400">
                  <Lock className="h-3.5 w-3.5 shrink-0" /> Checkout Seguro
                </span>
              </div>
            </div>

            {/* Formulário */}
            <div className="w-full">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}