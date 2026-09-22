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
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
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
      <div className="space-y-3">
          {loading && [0, 1, 2].map((item) => (
            <Card key={item} aria-label="Carregando lote">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-48" /></div>
                <Skeleton className="h-9 w-20" />
              </CardContent>
            </Card>
          ))}
          {!loading && items.map((batch) => (
            <Card key={batch.id} className="admin-rise">
              <CardContent className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{batch.name}</p>
                    <Badge variant={batch.active ? "success" : "default"}>{batch.active ? "Ativo" : "Inativo"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {money(batch.priceCents)} · {batch.reservedCount} / {batch.capacity} vagas
                  </p>
                </div>
                <Button variant="adminOutline" size="sm" onClick={() => edit(batch)}>
                  <Pencil size={14} />
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))}
          {!loading && !items.length && <p className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Nenhum lote cadastrado.</p>}
        </div>
    </>
  );
}
