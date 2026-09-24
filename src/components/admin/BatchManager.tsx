"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle, Pencil, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Batch = { id: string; name: string; priceCents: number; capacity: number; reservedCount: number; active: boolean; startsAt: string | null; endsAt: string | null };
type BatchForm = { name: string; price: string; capacity: string; startsAt: string; endsAt: string; active: boolean };
const emptyForm: BatchForm = { name: "", price: "", capacity: "", startsAt: "", endsAt: "", active: true };
const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function fetchBatches() {
  const response = await fetch("/api/v1/admin/batches", { credentials: "include", cache: "no-store" });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível carregar os lotes.");
  return body.items as Batch[];
}

export function BatchManager() {
  const [items, setItems] = useState<Batch[]>([]);
  const [form, setForm] = useState<BatchForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchBatches());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os lotes.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function edit(batch: Batch) {
    setEditingId(batch.id);
    setForm({
      name: batch.name,
      price: String(batch.priceCents / 100),
      capacity: String(batch.capacity),
      startsAt: batch.startsAt?.slice(0, 16) ?? "",
      endsAt: batch.endsAt?.slice(0, 16) ?? "",
      active: batch.active,
    });
    setDialogOpen(true);
  }
  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(false);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name,
      priceCents: Math.round(Number(form.price.replace(",", ".")) * 100),
      capacity: Number(form.capacity),
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
      active: form.active,
    };
    try {
      const response = await fetch(editingId ? `/api/v1/admin/batches/${editingId}` : "/api/v1/admin/batches", {
        method: editingId ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível salvar o lote.");
      reset();
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o lote.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-slate-900">Lotes</h1>
        <div className="flex gap-2">
          <Button variant="adminOutline" size="sm" onClick={() => void load()}>
            <RefreshCw size={14} />
            Atualizar
          </Button>
          <Button variant="admin" size="sm" onClick={() => { reset(); setDialogOpen(true); }}>
            <Plus size={14} />
            Novo lote
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) reset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar lote" : "Novo lote"}</DialogTitle>
            <DialogDescription>Defina preço, capacidade e período de disponibilidade.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="batch-name">Nome</Label>
                <Input id="batch-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="1º Lote" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="batch-price">Preço (R$)</Label>
                  <Input id="batch-price" required min="0.01" step="0.01" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5" placeholder="230,00" />
                </div>
                <div>
                  <Label htmlFor="batch-capacity">Capacidade</Label>
                  <Input id="batch-capacity" required min="1" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="mt-1.5" placeholder="50" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="batch-starts">Início</Label>
                  <Input id="batch-starts" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="batch-ends">Fim</Label>
                  <Input id="batch-ends" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="mt-1.5" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked === true })} />
                Lote ativo
              </label>
            {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="adminOutline" onClick={reset}>Cancelar</Button>
              <Button type="submit" variant="admin" disabled={saving}>
                {saving ? <LoaderCircle className="animate-spin" size={15} /> : editingId ? <Pencil size={15} /> : <Plus size={15} />}
                {editingId ? "Salvar alterações" : "Criar lote"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && [0, 1, 2].map((item) => (
            <Card key={item} aria-label="Carregando lote">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-48" /></div>
                <Skeleton className="h-9 w-20" />
              </CardContent>
            </Card>
          ))}
          {!loading && items.map((batch, index) => {
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
                      <Badge variant={batch.active ? "success" : "secondary"} className={batch.active ? "bg-emerald-500 text-white border-transparent" : ""}>
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
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-[11px] text-slate-400 font-mono">
                          {batch.reservedCount} de {batch.capacity} vagas
                        </div>
                        <Button variant={batch.active ? "admin" : "adminOutline"} size="sm" onClick={() => edit(batch)} className={batch.active ? "bg-[var(--gold)] text-[#0e2043]" : ""}>
                          <Pencil size={14} className="mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && !items.length && (
            <div className="col-span-full py-20 rounded-2xl border border-dashed border-slate-300 bg-white/50 text-center">
              <p className="text-sm font-medium text-slate-600">Nenhum lote configurado.</p>
              <p className="mt-1 text-xs text-slate-400">Configure um lote para iniciar as vendas.</p>
            </div>
          )}
        </div>
    </>
  );
}
