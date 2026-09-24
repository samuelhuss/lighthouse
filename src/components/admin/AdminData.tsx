"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, CreditCard, Layers3, RefreshCw, Search, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminJobControls } from "@/components/admin/AdminJobControls";

type Dashboard = { registrations: { total: number; paid: number; pending: number; failed: number; cancelled: number; checkedIn: number; }; capacity: { total: number; reserved: number; available: number }; revenue: { paidCents: number; averageTicketCents: number }; today: { registrations: number; payments: number }; latestRegistrations: Array<{ id: string; code: string; name: string; status: string; amountCents: number; createdAt: string }>; googleSheets: { configured: boolean } };
type Registration = { id: string; code: string; name: string; email: string; status: string; amountCents: number; createdAt: string; checkedInAt: string | null; };
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
  onClear,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions: ReadonlyArray<readonly [string, string]>;
  onClear?: () => void;
}) {
  const hasFilters = Boolean(search || status);
  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="relative flex-1 lg:max-w-md">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Busca</label>
          <Search size={14} className="pointer-events-none absolute left-2.5 top-[2.15rem] -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-8" />
        </div>
        <div className="w-full sm:w-52">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Status</label>
          <Select value={status || "all"} onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}>
            <SelectTrigger aria-label="Filtrar por status"><SelectValue placeholder="Todos os status" /></SelectTrigger>
            <SelectContent>{statusOptions.map(([value, label]) => <SelectItem key={value || "all"} value={value || "all"}>{label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {hasFilters && onClear && <Button type="button" variant="adminGhost" size="sm" onClick={onClear} className="self-end"><X size={14} />Limpar filtros</Button>}
      </div>
      {hasFilters && <p className="mt-2 text-xs text-slate-400">Filtros ativos aplicados à busca.</p>}
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

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Card key={item}><CardContent className="space-y-3 p-5"><Skeleton className="h-3 w-24" /><Skeleton className="h-8 w-16" /></CardContent></Card>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardContent className="space-y-3 p-5"><Skeleton className="h-3 w-32" /><Skeleton className="h-9 w-40" /><Skeleton className="h-3 w-48" /></CardContent></Card>
        <Card><CardContent className="space-y-4 p-5"><div className="flex justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-16" /></div><Skeleton className="h-2 w-full" /></CardContent></Card>
      </div>
    </div>
  );
}

function TableSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="space-y-3 p-5" aria-label="Carregando tabela">
      {[0, 1, 2, 3, 4].map((row) => <div key={row} className="flex items-center gap-4" style={{ animationDelay: `${row * 45}ms` }}><Skeleton className="h-4 w-24" /><Skeleton className="h-4 flex-1" /><Skeleton className="h-4 w-20" />{columns > 3 && <Skeleton className="h-4 w-16" />} {columns > 4 && <Skeleton className="h-4 w-24" />}</div>)}
    </div>
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
  if (!data) return <><PageHeader title="Dashboard" /><DashboardSkeleton /></>;

  const stats = [
    ["Inscrições", data.registrations.total],
    ["Pagas", data.registrations.paid],
    ["Pendentes", data.registrations.pending],
    ["Vagas disponíveis", data.capacity.available],
  ] as const;
  const capacityPct = data.capacity.total > 0 ? Math.min(100, Math.round((data.capacity.reserved / data.capacity.total) * 100)) : 0;

  return (
    <>
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-[#0e2043] shadow-xl admin-rise border border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/brand/lighthouse-hero.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2043] via-[#0e2043]/90 to-transparent z-10"></div>
        
        <div className="relative z-20 px-8 py-10 sm:px-12 sm:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 text-[var(--gold)] text-[10px] font-bold tracking-widest uppercase">
              Operação Lighthouse
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Central de Comando
            </h1>
            <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl">
              Bem-vindo ao painel administrativo. Acompanhe as inscrições, gerencie os pagamentos e prepare-se para acender o farol de 2027.
            </p>
          </div>
          <div className="shrink-0">
            <Button variant="adminOutline" className="bg-white/10 hover:bg-white border-white/20 hover:text-[#0e2043] text-white shadow-lg backdrop-blur-md transition-all" onClick={load}>
              <RefreshCw size={16} className="mr-2" />
              Sincronizar Dados
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value], index) => (
          <Card key={label} className="admin-rise" style={{ animationDelay: `${index * 55}ms` }}>
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="admin-rise relative overflow-hidden bg-gradient-to-br from-white to-amber-50/50 border-amber-100" style={{ animationDelay: "220ms" }}>
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600/80 mb-2">Receita Confirmada</p>
                <p className="mt-2 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{money(data.revenue.paidCents)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <CreditCard size={24} />
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-500 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Somente pagamentos 100% aprovados
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-rise relative overflow-hidden bg-gradient-to-br from-[#0e2043] to-[#162747] text-white border-[#0e2043]" style={{ animationDelay: "275ms" }}>
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Lotação do Evento</p>
                <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-xs font-mono text-[var(--gold)]">
                  {capacityPct}%
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{data.capacity.reserved}</span>
                <span className="text-white/50 text-lg font-medium">/ {data.capacity.total} vagas</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between text-xs font-medium text-white/50 mb-2">
                <span>Vagas ocupadas</span>
                <span>{data.capacity.available} restantes</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10 border border-white/5 relative">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-amber-300 shadow-[0_0_10px_rgba(232,175,46,0.5)] transition-all duration-1000 ease-out" 
                  style={{ width: `${capacityPct}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Inscrições hoje", data.today.registrations], ["Check-ins (Presentes)", `${data.registrations.checkedIn} / ${data.registrations.paid}`], ["Pagamentos hoje", data.today.payments], ["Ticket médio", money(data.revenue.averageTicketCents)]].map(([label, value], index) => <Card key={label} className="admin-rise" style={{ animationDelay: `${320 + index * 55}ms` }}><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xl font-semibold text-slate-900">{value}</p></CardContent></Card>)}
      </div>
      <Card className="mt-4 admin-rise" style={{ animationDelay: "540ms" }}>
        <CardHeader><CardTitle className="text-sm font-semibold text-slate-900">Últimas inscrições</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.latestRegistrations.map((registration) => <Link key={registration.id} href={`/admin/inscricoes/${registration.id}`} className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-amber-50"><span><span className="font-medium text-slate-900">{registration.name}</span><span className="ml-2 font-mono text-xs text-slate-400">{registration.code}</span></span><span className="flex items-center gap-3"><StatusBadge status={registration.status} /><span className="text-sm text-slate-600">{money(registration.amountCents)}</span></span></Link>)}
          {!data.latestRegistrations.length && <p className="text-sm text-slate-500">Nenhuma inscrição registrada.</p>}
        </CardContent>
      </Card>
    </>
  );
}

export function RegistrationsView() {
  const [items, setItems] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [batchId, setBatchId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [checkInStatus, setCheckInStatus] = useState("");
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
  const debouncedSearch = useDebouncedValue(search);

  const load = () => {
    setError(null);
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String((page - 1) * limit) });
    if (status) params.set("status", status);
    if (batchId) params.set("batchId", batchId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", `${dateTo}T23:59:59.999Z`);
    if (checkInStatus) params.set("checkInStatus", checkInStatus);
    params.set("sortBy", sortBy); params.set("sortDir", sortDir);
    if (debouncedSearch) params.set("search", debouncedSearch);
    void adminFetch<{ items: Registration[]; pagination: { total: number } }>(`/api/v1/admin/registrations?${params.toString()}`).then((body) => { setItems(body.items); setTotal(body.pagination.total); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, status, batchId, dateFrom, dateTo, checkInStatus, sortBy, sortDir, page, limit]);
  useEffect(() => { void adminFetch<{ items: Array<{ id: string; name: string }> }>("/api/v1/admin/batches").then((body) => setBatches(body.items)).catch(() => undefined); }, []);

  return (
    <>
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-md border border-amber-600/20">
        <div className="absolute inset-0 bg-[url('/brand/lighthouse-hero.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-10"></div>
        <div className="relative z-10 px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Registro de Inscrições</h1>
            <p className="mt-1 text-amber-50 text-sm">Visualize e gerencie todos os campistas inscritos no evento.</p>
          </div>
          <Button variant="adminOutline" className="bg-white/20 hover:bg-white border-white/30 hover:text-amber-700 text-white shadow-sm backdrop-blur-md" onClick={load}>
            <RefreshCw size={14} className="mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>
      <FilterBar
        search={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Buscar por nome, e-mail ou código"
        status={status}
        onStatusChange={(value) => { setStatus(value); setPage(1); }}
        statusOptions={registrationStatusOptions}
        onClear={() => { setSearch(""); setStatus(""); setPage(1); }}
      />
      <div className="mb-4 flex items-center justify-end gap-2 text-xs text-slate-500">
        <label htmlFor="registration-page-size">Por página</label>
        <Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}>
          <SelectTrigger id="registration-page-size" className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent>{[20, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Filtros avançados</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div><label className="mb-1.5 block text-xs text-slate-500">Lote</label><Select value={batchId || "all"} onValueChange={(value) => { setBatchId(value === "all" ? "" : value); setPage(1); }}><SelectTrigger><SelectValue placeholder="Todos os lotes" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os lotes</SelectItem>{batches.map((batch) => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="mb-1.5 block text-xs text-slate-500">Check-in</label><Select value={checkInStatus || "all"} onValueChange={(value) => { setCheckInStatus(value === "all" ? "" : value); setPage(1); }}><SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="done">Liberado</SelectItem><SelectItem value="pending">Aguardando</SelectItem></SelectContent></Select></div>
          <div><label className="mb-1.5 block text-xs text-slate-500">De</label><Input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} aria-label="Data inicial" /></div>
          <div><label className="mb-1.5 block text-xs text-slate-500">Até</label><Input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} aria-label="Data final" /></div>
          <div><label className="mb-1.5 block text-xs text-slate-500">Ordenar por</label><Select value={sortBy} onValueChange={(value) => { setSortBy(value); setPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[["createdAt", "Data"], ["name", "Nome"], ["status", "Status"], ["amountCents", "Valor"], ["paidAt", "Pagamento"]].map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="mb-1.5 block text-xs text-slate-500">Ordem</label><Select value={sortDir} onValueChange={(value) => { setSortDir(value); setPage(1); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="desc">Decrescente</SelectItem><SelectItem value="asc">Crescente</SelectItem></SelectContent></Select></div>
        </div>
      </div>
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <Card className={`overflow-hidden py-0 transition-opacity duration-200 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Check-in</TableHead>
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
                  <TableCell>
                    {item.checkedInAt ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 ring-1 ring-inset ring-emerald-500/20">
                        Liberado
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 ring-1 ring-inset ring-slate-500/20">
                        Aguardando
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!loading && !items.length && <p className="p-10 text-center text-sm text-slate-500">Nenhuma inscrição encontrada.</p>}
          {loading && !items.length && <TableSkeleton />}
          <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
        </Card>
      )}
    </>
  );
}

export function PaymentsView() {
  const [items, setItems] = useState<Array<{ id: string; status: string; registrationStatus: string; amountCents: number; paymentMethod: string; externalReference: string; createdAt: string }>>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const load = () => {
    setError(null);
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit), offset: String((page - 1) * limit) });
    if (status) params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    void adminFetch<{ items: typeof items; pagination: { total: number } }>(`/api/v1/admin/payments?${params.toString()}`).then((body) => { setItems(body.items); setTotal(body.pagination.total); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [debouncedSearch, status, page, limit]);

  return (
    <>
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 shadow-md border border-emerald-700/20">
        <div className="absolute inset-0 bg-[url('/brand/lighthouse-hero.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-10"></div>
        <div className="relative z-10 px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Central de Pagamentos</h1>
            <p className="mt-1 text-emerald-50 text-sm">Acompanhe as transações financeiras e liquidações em tempo real.</p>
          </div>
          <Button variant="adminOutline" className="bg-white/20 hover:bg-white border-white/30 hover:text-emerald-800 text-white shadow-sm backdrop-blur-md" onClick={load}>
            <RefreshCw size={14} className="mr-2" />
            Sincronizar
          </Button>
        </div>
      </div>
      <FilterBar
        search={search}
        onSearchChange={(value) => { setSearch(value); setPage(1); }}
        searchPlaceholder="Buscar por código ou referência"
        status={status}
        onStatusChange={(value) => { setStatus(value); setPage(1); }}
        statusOptions={paymentStatusOptions}
        onClear={() => { setSearch(""); setStatus(""); setPage(1); }}
      />
      <div className="mb-4 flex items-center justify-end gap-2 text-xs text-slate-500">
        <label htmlFor="payment-page-size">Por página</label>
        <Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1); }}>
          <SelectTrigger id="payment-page-size" className="w-20"><SelectValue /></SelectTrigger>
          <SelectContent>{[20, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <Card className={`overflow-hidden py-0 transition-opacity duration-200 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Inscrição</TableHead>
                <TableHead>Status do pagamento</TableHead>
                <TableHead>Status da inscrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs"><Link href={`/admin/pagamentos/${item.id}`} className="hover:text-amber-700 hover:underline">{item.id.slice(0, 12)}...</Link></TableCell>
                  <TableCell className="font-mono text-xs">{item.externalReference}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell><StatusBadge status={item.registrationStatus} /></TableCell>
                  <TableCell>{money(item.amountCents)}</TableCell>
                  <TableCell className="text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!loading && !items.length && <p className="p-10 text-center text-sm text-slate-500">Nenhum pagamento encontrado.</p>}
          {loading && !items.length && <TableSkeleton />}
          <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
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
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0e2043] tracking-tight">Lotes e Capacidade</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie a liberação de vagas e os preços de cada fase.</p>
        </div>
        <Button variant="admin" size="sm" onClick={() => alert("O formulário de criação de lote será conectado na próxima etapa.")} className="bg-[var(--gold)] text-[#0e2043] hover:bg-[#0e2043] hover:text-white shadow-md">
          <ArrowUpRight size={14} className="mr-1" />
          Configurar novo lote
        </Button>
      </div>

      {error ? (
        <ErrorState message={error} retry={load} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((batch, index) => {
            const isSoldOut = batch.reservedCount >= batch.capacity;
            const percentage = batch.capacity > 0 ? Math.round((batch.reservedCount / batch.capacity) * 100) : 0;
            
            return (
              <div key={batch.id} className="relative group admin-rise" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Decorative Ticket Stub edge */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50/50 rounded-full z-10 border-r border-slate-200"></div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50/50 rounded-full z-10 border-l border-slate-200"></div>
                
                <div className={cn(
                  "relative h-full overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl",
                  batch.active 
                    ? "border-[var(--gold)]/50 ring-1 ring-[var(--gold)]/20" 
                    : "border-slate-200 opacity-80 grayscale-[0.2]"
                )}>
                  {/* Top Header */}
                  <div className={cn(
                    "px-6 py-5 border-b border-dashed",
                    batch.active ? "bg-[#0e2043] text-white border-white/20" : "bg-slate-100 text-slate-900 border-slate-300"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-[10px] font-bold tracking-widest uppercase mb-1",
                          batch.active ? "text-[var(--gold)]" : "text-slate-500"
                        )}>
                          Fase de Vendas
                        </span>
                        <h3 className="text-xl font-bold tracking-tight">{batch.name}</h3>
                      </div>
                      <Badge variant={batch.active ? "success" : "outline"} className={batch.active ? "bg-emerald-500 text-white border-transparent" : ""}>
                        {batch.active ? "Em vigor" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Bottom Content */}
                  <div className="p-6">
                    <div className="flex flex-col mb-6">
                      <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Valor do Ingresso</span>
                      <span className="text-3xl font-extrabold text-slate-900">{money(batch.priceCents)}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-500 uppercase tracking-wider">Ocupação</span>
                        <span className={isSoldOut ? "text-red-500" : "text-slate-900"}>
                          {isSoldOut ? "ESGOTADO" : `${percentage}% preenchido`}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isSoldOut ? "bg-red-500" : batch.active ? "bg-[#0e2043]" : "bg-slate-400"
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 text-right font-mono">
                        {batch.reservedCount} de {batch.capacity} vagas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!items.length && (
            <div className="col-span-full py-20 rounded-2xl border border-dashed border-slate-300 bg-white/50 text-center">
              <Layers3 className="mx-auto mb-3 h-8 w-8 text-slate-400 opacity-50" />
              <p className="text-sm font-medium text-slate-600">Nenhum lote configurado.</p>
              <p className="mt-1 text-xs text-slate-400">Configure um lote para iniciar as vendas.</p>
            </div>
          )}
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

export function JobsView() {
  return (
    <>
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 shadow-md border border-slate-700">
        <div className="absolute inset-0 bg-[url('/brand/lighthouse-hero.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-[0.05]"></div>
        <div className="relative z-10 px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Servidor & Jobs</h1>
            <p className="mt-1 text-slate-400 text-sm">Controle as tarefas de processamento em segundo plano.</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AdminJobControls />
        </div>
      </div>
    </>
  );
}
