"use client";

import { QRCodeSVG } from "qrcode.react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Copy,
  CheckCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { HeroAmbience } from "@/components/landing/HeroAmbience";

type Registration = {
  code: string;
  name: string;
  status: string;
  amountCents: number;
  paidAt: string | null;
  paymentExpiresAt: string | null;
  paymentUrl: string | null;
};

type PageKind = "success" | "pending" | "error";

const copy = {
  success: {
    eyebrow: "INSCRICAO CONFIRMADA",
    title: "Seu lugar está garantido.",
    description: "Guardamos a sua vaga para o Lighthouse 2026. Apresente este código na chegada.",
    icon: Check,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
  pending: {
    eyebrow: "PAGAMENTO EM ANALISE",
    title: "Estamos quase lá.",
    description: "O pagamento está sendo processado. Você pode continuar no checkout do Mercado Pago.",
    icon: Clock3,
    badgeColor: "bg-amber-500/20 text-[var(--gold)] border-[var(--amber)]/30",
  },
  error: {
    eyebrow: "PAGAMENTO NAO CONFIRMADO",
    title: "Não foi possível concluir.",
    description: "Sua inscrição ainda não foi confirmada. Tente novamente sem nova cobrança.",
    icon: CircleAlert,
    badgeColor: "bg-red-500/20 text-red-300 border-red-400/30",
  },
  expired: {
    eyebrow: "RESERVA EXPIRADA",
    title: "Sua reserva venceu.",
    description: "O prazo para pagamento acabou. Faça uma nova inscrição para garantir a vaga.",
    icon: CircleAlert,
    badgeColor: "bg-red-500/20 text-red-300 border-red-400/30",
  },
} as const;

function normalizeStatus(status: string): keyof typeof copy {
  if (["PAID", "APPROVED"].includes(status)) return "success";
  if (status === "EXPIRED") return "expired";
  if (["PAYMENT_FAILED", "REJECTED", "CANCELLED", "REFUNDED"].includes(status)) return "error";
  return "pending";
}

export function PaymentStatusPage({ kind }: { kind: PageKind }) {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? searchParams.get("external_reference");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [view, setView] = useState<keyof typeof copy>(kind);
  const [loading, setLoading] = useState(Boolean(code));
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchRegistration = useCallback(async () => {
    if (!code) {
      setLoading(false);
      return;
    }
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/registrations/${encodeURIComponent(code)}`, {
        cache: "no-store",
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Não foi possível consultar sua inscrição.");
      setRegistration(body);
      setView(normalizeStatus(body.status));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível consultar sua inscrição."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [code]);

  useEffect(() => {
    const request = Promise.resolve().then(fetchRegistration);
    return () => {
      void request;
    };
  }, [fetchRegistration]);

  const handleCopyCode = () => {
    if (!registration?.code) return;
    navigator.clipboard.writeText(registration.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = copy[view];
  const Icon = content.icon;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--abyss)] px-4 py-10 text-white overflow-hidden">
      {/* Luz ambiente & farol */}
      <HeroAmbience />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-white transition hover:text-[var(--gold)]"
          >
            <LighthouseMark size={32} /> Lighthouse 2026
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>
        </div>

        {/* Minimalist Glass Card */}
        <div className="minimal-glass-card mt-8 rounded-[2.5rem] p-6 sm:p-10 border border-white/20 text-white shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md ${content.badgeColor}`}
            >
              <Icon className="h-4 w-4" /> {content.eyebrow}
            </div>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Acampamento Lighthouse
            </span>
          </div>

          <div className="mt-6">
            <h1 className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] font-normal text-white leading-tight">
              {loading ? "Consultando..." : content.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-white/85 max-w-xl">
              {loading
                ? "Buscando os detalhes mais recentes do seu passe."
                : content.description}
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/20 p-4 text-xs font-medium text-red-200"
            >
              {error}
            </div>
          ) : registration ? (
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">
                    Participante
                  </p>
                  <p className="mt-1 font-serif text-2xl font-medium text-white">
                    {registration.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">
                    Código do Passe
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-xl font-bold text-white">
                      {registration.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="rounded-lg p-1.5 text-[var(--gold)] hover:bg-white/10 transition"
                      title="Copiar código"
                    >
                      {copied ? (
                        <CheckCheck className="h-4.5 w-4.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code de Check-in (Apenas se pago) */}
              {view === "success" && (
                <div className="flex flex-col items-center justify-center p-6 border border-[var(--gold)]/30 bg-[var(--gold)]/5 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] mb-4 text-center">
                    Apresente na entrada
                  </p>
                  <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(232,175,46,0.2)]">
                    <QRCodeSVG 
                      value={registration.code} 
                      size={180}
                      level="Q"
                      includeMargin={false}
                      fgColor="#0e2043"
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-4 text-center max-w-sm">
                    Este é o seu QR Code oficial. Tire um print ou guarde o link desta página.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {view === "pending" && registration.paymentUrl && (
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-white text-[#0e2043] font-bold hover:bg-[var(--gold)] h-12 rounded-2xl"
                  >
                    <a href={registration.paymentUrl}>
                      Continuar para o Pagamento <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                )}

                {view === "pending" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void fetchRegistration()}
                    disabled={refreshing}
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20 text-xs font-semibold h-12 rounded-2xl"
                  >
                    {refreshing ? (
                      <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-1" />
                    )}
                    Atualizar Status
                  </Button>
                )}

                {(view === "error" || view === "expired") && (
                  <Button asChild className="w-full sm:w-auto bg-white text-[#0e2043] font-bold h-12 rounded-2xl">
                    <Link href="/inscricao">
                      Tentar Novamente <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  variant="ghost"
                  className="text-xs font-semibold text-white/70 hover:text-white"
                >
                  <Link href="/">Voltar para a home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center text-xs text-white/60">
              <p>Abra esta página pelo link recebido no e-mail ou comprovante.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}