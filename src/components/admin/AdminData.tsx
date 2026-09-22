"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, RefreshCw, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminJobControls } from "@/components/admin/AdminJobControls";

type Dashboard = { registrations: { total: number; paid: number; pending: number; failed: number; cancelled: number }; capacity: { total: number; reserved: number; available: number }; revenue: { paidCents: number } };
type Registration = { id: string; code: string; name: string; email: string; status: string; amountCents: number; createdAt: string };
type Batch = { id: string; name: string; priceCents: number; capacity: number; reservedCount: number; active: boolean; startsAt: string | null; endsAt: string | null };

const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const statusLabel: Record<string, string> = { PAID: "Pago", PENDING_PAYMENT: "Pendente", PAYMENT_PROCESSING: "Processando", PAYMENT_FAILED: "Falhou", CANCELLED: "Cancelado", EXPIRED: "Expirado", REFUNDED: "Reembolsado", PENDING: "Pendente", APPROVED: "Aprovado", REJECTED: "Rejeitado" };
const statusVariant: Record<string, BadgeProps["variant"]> = { PAID: "success", APPROVED: "success", PENDING_PAYMENT: "warning", PAYMENT_PROCESSING: "warning", PENDING: "warning", PAYMENT_FAILED: "destructive", REJECTED: "destructive", CANCELLED: "destructive", EXPIRED: "destructive", REFUNDED: "outline" };
const registrationStatusOptions = [
  ["", "Todos os status"],
  ["PENDING_PAYMENT", "Pendente"],
  ["PAYMENT_PROCESSING", "Processando"],
  ["PAID", "Pago"],
  ["PAYMENT_FAILED", "Falhou"],
  ["CANCELLED", "Cancelado"],
  ["EXPIRED", "Expirado"],
  ["REFUNDED", "Reembolsado"],
] as const;
const paymentStatusOptions = [
  ["", "Todos os status"],
  ["PENDING", "Pendente"],
  ["APPROVED", "Aprovado"],
  ["REJECTED", "Rejeitado"],
  ["CANCELLED", "Cancelado"],
  ["REFUNDED", "Reembolsado"],
] as const;
const selectClassName = "h-9 rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-700 outline-none focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-200";

function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  status,
  onStatusChange,
  statusOptions,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-8" />
        {search && (
          <button type="button" onClick={() => onSearchChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Limpar busca">
            <X size={14} />
          </button>
        )}
      </div>
      <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClassName}>
        {statusOptions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

async function adminFetch<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: "include", cache: "no-store" });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível carregar os dados.");
  return body;
}

function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={statusVariant[status] ?? "default"}>{statusLabel[status] ?? status}</Badge>;
}

function ErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex gap-3 p-5">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-medium text-red-900">Não conseguimos carregar os dados.</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          <Button variant="adminOutline" size="sm" className="mt-3 border-red-300 text-red-800 hover:bg-red-100" onClick={retry}>
            <RefreshCw size={14} />
            Tentar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardView() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = () => {
    setError(null);
    void adminFetch<Dashboard>("/api/v1/admin/dashboard").then(setData).catch((e) => setError(e.message));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (error) return <><PageHeader title="Dashboard" /><ErrorState message={error} retry={load} /></>;
  if (!data) return <><PageHeader title="Dashboard" /><div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white" /></>;

  const stats = [
    ["Inscrições", data.registrations.total],
    ["Pagas", data.registrations.paid],
    ["Pendentes", data.registrations.pending],
    ["Vagas disponíveis", data.capacity.available],
  ] as const;
  const capacityPct = data.capacity.total > 0 ? Math.min(100, Math.round((data.capacity.reserved / data.capacity.total) * 100)) : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral do acampamento"
        action={
          <Button variant="adminOutline" size="sm" onClick={load}>
            <RefreshCw size={14} />
            Atualizar
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Receita confirmada</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{money(data.revenue.paidCents)}</p>
            <p className="mt-4 text-xs text-slate-400">Somente pagamentos aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Capacidade</p>
              <span className="text-sm text-slate-500">{data.capacity.reserved} / {data.capacity.total}</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${capacityPct}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <AdminJobControls />
      </div>
    </>
  );
}

export function RegistrationsView() {
  const [items, setItems] = useState<Registration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const load = () => {
    setError(null);
    const params = new URLSearchParams({ limit: "100" });
    if (status) params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    void adminFetch<{ items: Registration[] }>(`/api/v1/admin/registrations?${params.toString()}`).then((body) => setItems(body.items)).catch((e) => setError(e.message));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, status]);

  return (
    <>
      <PageHeader
        title="Inscrições"
        action={
          <Button variant="adminOutline" size="sm" onClick={load}>
            <RefreshCw size={14} />
            Atualizar
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome, e-mail ou código"
        status={status}
        onStatusChange={setStatus}
        statusOptions={registrationStatusOptions}
      />
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criada em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    <Link href={`/admin/inscricoes/${item.id}`} className="text-slate-900 hover:underline">
                      {item.code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.email}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>{money(item.amountCents)}</TableCell>
                  <TableCell className="text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!items.length && <p className="p-10 text-center text-sm text-slate-500">Nenhuma inscrição encontrada.</p>}
        </Card>
      )}
    </>
  );
}

export function PaymentsView() {
  const [items, setItems] = useState<Array<{ id: string; status: string; amountCents: number; paymentMethod: string; externalReference: string; createdAt: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const load = () => {
    setError(null);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    void adminFetch<{ items: typeof items }>(`/api/v1/admin/payments?${params.toString()}`).then((body) => setItems(body.items)).catch((e) => setError(e.message));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, status]);

  return (
    <>
      <PageHeader
        title="Pagamentos"
        action={
          <Button variant="adminOutline" size="sm" onClick={load}>
            <RefreshCw size={14} />
            Atualizar
          </Button>
        }
      />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por código ou referência"
        status={status}
        onStatusChange={setStatus}
        statusOptions={paymentStatusOptions}
      />
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Inscrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id.slice(0, 12)}...</TableCell>
                  <TableCell className="font-mono text-xs">{item.externalReference}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>{money(item.amountCents)}</TableCell>
                  <TableCell className="text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!items.length && <p className="p-10 text-center text-sm text-slate-500">Nenhum pagamento encontrado.</p>}
        </Card>
      )}
    </>
  );
}

export function BatchesView() {
  const [items, setItems] = useState<Batch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => {
    setError(null);
    void adminFetch<{ items: Batch[] }>("/api/v1/admin/batches").then((body) => setItems(body.items)).catch((e) => setError(e.message));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader
        title="Lotes"
        action={
          <Button variant="admin" size="sm" onClick={() => alert("O formulário de criação de lote será conectado na próxima etapa.")}>
            <ArrowUpRight size={14} />
            Novo lote
          </Button>
        }
      />
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((batch) => (
            <Card key={batch.id}>
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
                <div>
                  <p className="text-base font-semibold text-slate-900">{batch.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{money(batch.priceCents)}</p>
                </div>
                <Badge variant={batch.active ? "success" : "default"}>{batch.active ? "Ativo" : "Inativo"}</Badge>
              </CardHeader>
              <CardContent className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500">Ocupação</span>
                <strong className="text-slate-900">{batch.reservedCount} / {batch.capacity}</strong>
              </CardContent>
            </Card>
          ))}
          {!items.length && <p className="col-span-full rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Nenhum lote cadastrado.</p>}
        </div>
      )}
    </>
  );
}

export function AdminLoginNotice() {
  return (
    <Card className="mx-auto max-w-md p-8 text-center">
      <AlertCircle className="mx-auto text-slate-400" size={26} />
      <h1 className="mt-4 text-lg font-semibold text-slate-900">Sessão necessária</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        A API administrativa exige um token Supabase com perfil de administrador. A tela de login será conectada à autenticação na próxima etapa.
      </p>
      <Link href="/" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:underline">
        Voltar ao site <ArrowUpRight size={14} />
      </Link>
    </Card>
  );
}
