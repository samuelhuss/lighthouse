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

        {/* Card Principal */}
        <div className="w-full flex items-center justify-center my-auto">
          <div className="minimal-glass-card relative flex w-full flex-col lg:flex-row rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl gap-8 border border-white/25 backdrop-blur-3xl overflow-hidden">
            {/* Linha Dourada Topo */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[var(--amber)] via-[var(--gold)] to-emerald-400" />

            {/* Esquerdo: Informações do Evento */}
            <div className="flex flex-col justify-between lg:w-[42%] border-b lg:border-b-0 lg:border-r border-white/20 pb-6 lg:pb-0 lg:pr-8 shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/15 px-3.5 py-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--gold)]">
                  <Sparkles className="h-3 w-3" /> PASSE OFICIAL
                </span>

                <div className="mt-3 mb-2">
                  <Image
                    src="/brand/lighthouse-hero-logo.png"
                    alt="LIGHTHOUSE'27"
                    width={400}
                    height={140}
                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_20px_rgba(232,199,102,0.35)]"
                    priority
                  />
                </div>

                <div className="mt-3 flex flex-col gap-1 text-xs text-white/80 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" /> 05 — 09 de Fevereiro
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" /> Elias Fausto, SP
                  </span>
                </div>

                {/* Incluso */}
                <div className="mt-6 space-y-3 border-t border-white/20 pt-5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold)] tracking-wider block">
                    O QUE ESTÁ INCLUSO
                  </span>
                  <ul className="space-y-2 text-xs text-white/90 font-medium">
                    {campContent.included.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-3 text-[11px] text-white/80 font-medium">
                    <Lock className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                    <span>Seus dados são protegidos com criptografia.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direito: Formulário */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-5">
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-white">
                  Preencha seus dados
                </h2>
                <p className="text-xs text-white/80 mt-1">
                  Informe seus dados para emitir a sua vaga e avançar para o pagamento seguro.
                </p>
              </div>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}