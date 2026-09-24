"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Copy, LoaderCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Payment = {
  id: string;
  provider: string;
  providerPaymentId: string | null;
  providerPreferenceId: string | null;
  checkoutUrl: string | null;
  externalReference: string;
  amountCents: number;
  status: string;
  statusDetail: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  registration: { id: string; registrationCode: string; name: string; email: string; status: string };
};

const labels: Record<string, string> = { PENDING: "Pendente", APPROVED: "Aprovado", REJECTED: "Rejeitado", CANCELLED: "Cancelado", REFUNDED: "Reembolsado" };
const variants: Record<string, BadgeProps["variant"]> = { APPROVED: "success", PENDING: "warning", REJECTED: "destructive", CANCELLED: "destructive", REFUNDED: "outline" };
const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const date = (value: string | null) => value ? new Date(value).toLocaleString("pt-BR") : "—";

function Field({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  return <div><dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 flex items-center gap-2 break-all font-medium text-slate-900">{value}{copyable && <Button type="button" variant="adminGhost" size="icon" className="h-7 w-7 shrink-0" aria-label={`Copiar ${label}`} title={`Copiar ${label}`} onClick={() => void navigator.clipboard?.writeText(value)}><Copy size={13} /></Button>}</dd></div>;
}

export function PaymentDetails({ id }: { id: string }) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetch(`/api/v1/admin/payments/${id}`, { credentials: "include", cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível carregar o pagamento."); return body.payment; }).then(setPayment).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar o pagamento.")), 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>;
  if (!payment) return <div className="flex min-h-60 items-center justify-center"><LoaderCircle className="animate-spin text-slate-400" /></div>;

  return <>
    <div className="mb-6"><Link href="/admin/pagamentos" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"><ArrowLeft size={15} />Voltar para pagamentos</Link></div>
    
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 shadow-2xl border border-emerald-900/50">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
      </div>
      <div className="relative z-10 px-6 py-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-3xl font-extrabold text-white shadow-inner">
            R$
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm text-emerald-300 font-bold tracking-widest">{payment.id.slice(0, 12)}</span>
              <Badge variant={variants[payment.status] ?? "default"} className="uppercase tracking-wider text-[10px]">{labels[payment.status] ?? payment.status}</Badge>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">{money(payment.amountCents)}</h1>
            <p className="mt-1 text-white/60 text-sm font-medium">Processado via {payment.provider} • Ref: {payment.externalReference}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-sm font-semibold text-slate-900">Pagamento</CardTitle></CardHeader><CardContent><dl className="grid gap-5 sm:grid-cols-2"><Field label="Provider" value={payment.provider} /><Field label="Valor" value={money(payment.amountCents)} /><Field label="Payment ID" value={payment.providerPaymentId ?? "—"} copyable /><Field label="Preference ID" value={payment.providerPreferenceId ?? "—"} copyable /><Field label="Referência externa" value={payment.externalReference} copyable /><Field label="Método" value={payment.paymentMethod ?? "—"} /><Field label="Detalhe do status" value={payment.statusDetail ?? "—"} /><Field label="Pago em" value={date(payment.paidAt)} /></dl>{payment.status === "PENDING" && payment.checkoutUrl && <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4"><Field label="URL do Checkout" value={payment.checkoutUrl} copyable /><Button asChild variant="admin" size="sm" className="mt-3"><a href={payment.checkoutUrl} target="_blank" rel="noreferrer">Abrir Checkout</a></Button></div>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-sm font-semibold text-slate-900">Inscrição relacionada</CardTitle></CardHeader><CardContent><dl className="space-y-5"><Field label="Participante" value={payment.registration.name} /><Field label="E-mail" value={payment.registration.email} /><Field label="Código" value={payment.registration.registrationCode} /><Field label="Status da inscrição" value={payment.registration.status} /><Field label="Criado em" value={date(payment.createdAt)} /><Field label="Atualizado em" value={date(payment.updatedAt)} /></dl><Button asChild variant="adminOutline" size="sm" className="mt-6"><Link href={`/admin/inscricoes/${payment.registration.id}`}>Ver inscrição</Link></Button></CardContent></Card>
    </div>
  </>;
}
