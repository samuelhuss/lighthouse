"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, LoaderCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Detail = {
  id: string;
  registrationCode: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  address: string | null;
  zipCode: string | null;
  gender: string | null;
  guardianOneName: string | null;
  guardianOnePhone: string | null;
  guardianTwoName: string | null;
  guardianTwoPhone: string | null;
  medications: string | null;
  allergies: string | null;
  dietaryRestrictions: string | null;
  status: string;
  amountCents: number;
  createdAt: string;
  paidAt: string | null;
  paymentExpiresAt: string | null;
  batch: { name: string; priceCents: number } | null;
  payments: Array<{ id: string; status: string; amountCents: number; providerPaymentId: string | null; checkoutUrl: string | null; createdAt: string; paidAt: string | null }>;
};

const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const labels: Record<string, string> = { PAID: "Pago", PENDING_PAYMENT: "Pendente", PAYMENT_FAILED: "Falhou", CANCELLED: "Cancelado", EXPIRED: "Expirado", REFUNDED: "Reembolsado" };
const statusVariant: Record<string, BadgeProps["variant"]> = { PAID: "success", PENDING_PAYMENT: "warning", PAYMENT_FAILED: "destructive", CANCELLED: "destructive", EXPIRED: "destructive", REFUNDED: "outline" };
const date = (value: string | null) => (value ? new Date(value).toLocaleString("pt-BR") : "—");

export function RegistrationDetails({ id }: { id: string }) {
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch(`/api/v1/admin/registrations/${id}`, { credentials: "include", cache: "no-store" })
        .then(async (response) => {
          const body = await response.json();
          if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível carregar a inscrição.");
          return body.registration;
        })
        .then(setData)
        .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar a inscrição."));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</div>;
  if (!data) return <div className="flex min-h-60 items-center justify-center"><LoaderCircle className="animate-spin text-slate-400" /></div>;

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/inscricoes" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft size={15} />
          Voltar para inscrições
        </Link>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs text-slate-500">{data.registrationCode}</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">{data.name}</h1>
          </div>
          <Badge variant={statusVariant[data.status] ?? "default"}>{labels[data.status] ?? data.status}</Badge>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Participante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">E-mail</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">WhatsApp</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">CPF</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.cpf ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Sexo</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.gender ?? "—"}</dd>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Logradouro</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">CEP</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.zipCode ?? "—"}</dd>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Saúde e Restrições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Medicamentos</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.medications || "Nenhum"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Alergias</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.allergies || "Nenhuma"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Restrições Alimentares</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.dietaryRestrictions || "Nenhuma"}</dd>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Responsáveis (Menores de 18)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Responsável 1</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.guardianOneName ?? "—"} {data.guardianOnePhone ? `(${data.guardianOnePhone})` : ""}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Responsável 2</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.guardianTwoName ?? "—"} {data.guardianTwoPhone ? `(${data.guardianTwoPhone})` : ""}</dd>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-900">Inscrição</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-slate-500">Lote</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{data.batch?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Valor</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{money(data.amountCents)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Criada em</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{date(data.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Paga em</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{date(data.paidAt)}</dd>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-900">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.payments.map((payment) => (
            <div key={payment.id} className="flex flex-col justify-between gap-2 rounded-md border border-slate-100 p-3 text-sm sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-xs text-slate-500">{payment.providerPaymentId ?? payment.id.slice(0, 12)}</p>
                <p className="mt-0.5 text-slate-500">{date(payment.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-900">{money(payment.amountCents)}</span>
                <Badge variant={statusVariant[payment.status] ?? "default"}>{labels[payment.status] ?? payment.status}</Badge>
                {payment.status === "PENDING" && payment.checkoutUrl && <Button asChild variant="adminOutline" size="sm"><a href={payment.checkoutUrl} target="_blank" rel="noreferrer">Checkout <ExternalLink size={14} /></a></Button>}
                <Button asChild variant="adminGhost" size="sm"><Link href={`/admin/pagamentos/${payment.id}`}>Detalhes</Link></Button>
              </div>
            </div>
          ))}
          {!data.payments.length && <p className="text-sm text-slate-500">Nenhum pagamento registrado.</p>}
        </CardContent>
      </Card>
    </>
  );
}
