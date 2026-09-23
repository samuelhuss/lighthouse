"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleAlert, Clock3, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LighthouseMark } from "@/components/brand/LighthouseMark";

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
    eyebrow: "Pagamento confirmado",
    title: "Seu lugar está garantido.",
    description: "A sua inscrição foi confirmada. Guarde o código abaixo para consultar os detalhes quando precisar.",
    icon: Check,
  },
  pending: {
    eyebrow: "Pagamento em análise",
    title: "Estamos quase lá.",
    description: "O pagamento ainda está sendo processado. Você pode consultar novamente em alguns instantes.",
    icon: Clock3,
  },
  error: {
    eyebrow: "Pagamento não confirmado",
    title: "Não conseguimos concluir agora.",
    description: "Sua inscrição ainda não foi confirmada. Nenhuma nova cobrança foi feita por esta consulta.",
    icon: CircleAlert,
  },
  expired: {
    eyebrow: "Reserva expirada",
    title: "Sua reserva expirou.",
    description: "O prazo para pagamento acabou e a vaga foi liberada. Faça uma nova inscrição para garantir seu lugar.",
    icon: CircleAlert,
  },
} as const;

// EXPIRED and CANCELLED must never be shown as "pending" — the registration status in the database is always the source of truth.
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

  const fetchRegistration = useCallback(async () => {
    if (!code) {
      setLoading(false);
      return;
    }
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/registrations/${encodeURIComponent(code)}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível consultar sua inscrição.");
      setRegistration(body);
      setView(normalizeStatus(body.status));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível consultar sua inscrição.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [code]);

  useEffect(() => {
    const request = Promise.resolve().then(fetchRegistration);
    return () => { void request; };
  }, [fetchRegistration]);

  const content = copy[view];
  const Icon = content.icon;

  return (
    <main className="flex min-h-screen items-center bg-[var(--background)] px-6 py-12 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 font-serif text-xl font-semibold text-[var(--pine)]"><LighthouseMark size={26} /> Lighthouse</Link>
        <div className="mt-16 grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${view === "success" ? "bg-[var(--pine)] text-white" : view === "error" || view === "expired" ? "bg-red-100 text-red-700" : "bg-[var(--sand)] text-[var(--pine)]"}`}>
              {loading ? <LoaderCircle className="animate-spin" size={25} /> : <Icon size={27} />}
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.22em] text-[var(--azure)]">{content.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-[var(--pine)] sm:text-6xl">{loading ? "Consultando sua inscrição." : content.title}</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-[var(--moss)]">{loading ? "Só um instante. Estamos conferindo a confirmação no servidor." : content.description}</p>
          </div>

          <section className="rounded-2xl border border-[color:var(--pine)/10%] bg-[var(--paper)] p-7 shadow-[0_20px_70px_rgba(35,58,47,.08)] sm:p-10">
            {error ? <div role="alert" className="rounded-xl bg-red-50 p-5 text-sm leading-6 text-red-800">{error}</div> : registration ? <><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--moss)]">Inscrição de</p><p className="mt-2 text-2xl font-semibold text-[var(--pine)]">{registration.name}</p><div className="mt-8 grid gap-5 border-y border-[color:var(--pine)/12%] py-6 sm:grid-cols-2"><div><p className="text-xs uppercase tracking-[.15em] text-[var(--moss)]">Código</p><p className="mt-2 font-mono text-lg font-semibold text-[var(--pine)]">{registration.code}</p></div><div><p className="text-xs uppercase tracking-[.15em] text-[var(--moss)]">Valor</p><p className="mt-2 text-lg font-semibold text-[var(--pine)]">{(registration.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div></div>{registration.paymentExpiresAt && view === "pending" && <p className="mt-5 text-sm text-[var(--moss)]">Reserva válida até {new Date(registration.paymentExpiresAt).toLocaleString("pt-BR")}.</p>}<div className="mt-7 flex flex-wrap gap-3">{view === "pending" && registration.paymentUrl && <Button asChild><a href={registration.paymentUrl}>Continuar para o pagamento <ArrowRight size={17} /></a></Button>}{view === "pending" && <Button type="button" variant="outline" onClick={() => void fetchRegistration()} disabled={refreshing}>{refreshing ? <LoaderCircle className="animate-spin" size={17} /> : <RefreshCw size={17} />} Verificar status</Button>}{(view === "error" || view === "expired") && <Button asChild><Link href="/inscricao">Tentar novamente <ArrowRight size={17} /></Link></Button>}<Button asChild variant={view === "error" || view === "expired" ? "ghost" : "default"}><Link href="/">Voltar para o site <ArrowLeft size={17} /></Link></Button></div></> : <div className="space-y-4 text-sm leading-6 text-[var(--moss)]"><p>Para consultar o status, abra esta página pelo link recebido após o pagamento.</p><Button asChild variant="outline"><Link href="/">Voltar para o site <ArrowLeft size={17} /></Link></Button></div>}
          </section>
        </div>
      </div>
    </main>
  );
}