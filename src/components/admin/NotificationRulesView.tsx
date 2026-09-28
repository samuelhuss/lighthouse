"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Bell, Mail } from "lucide-react";

type NotificationRule = {
  id: string;
  event: string;
  action: string;
  target: string;
  active: boolean;
  createdAt: string;
};

export function NotificationRulesView() {
  const [items, setItems] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ event: "PAGAMENTO_APROVADO", action: "SEND_EMAIL", target: "" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ items: NotificationRule[] }>("/api/v1/admin/notifications");
      setItems(data.items);
    } catch (e) {
      alert("Erro ao carregar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.target) return alert("Preencha o destino (ex: e-mail).");
    try {
      await adminFetch("/api/v1/admin/notifications", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setForm({ ...form, target: "" });
      load();
    } catch (e: any) {
      alert("Erro: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta regra?")) return;
    try {
      await adminFetch(`/api/v1/admin/notifications/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      alert("Erro: " + e.message);
    }
  };

  return (
    <>
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 shadow-md border border-purple-700/50">
        <div className="relative z-10 px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Central de Notificações</h1>
            <p className="mt-1 text-purple-100 text-sm">Configure regras para ser avisado quando eventos importantes acontecerem.</p>
          </div>
          <Bell className="text-purple-300/50 w-16 h-16 absolute right-4 opacity-50" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Nova Regra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Quando acontecer o evento</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.event} onChange={e => setForm({...form, event: e.target.value})}>
                  <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
                  <option value="NOVA_INSCRICAO">Nova Inscrição Criada</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Ação</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.action} onChange={e => setForm({...form, action: e.target.value})}>
                  <option value="SEND_EMAIL">Enviar E-mail</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Destino (Seu E-mail)</label>
                <input type="email" placeholder="contato@exemplo.com" className="w-full border rounded-md px-3 py-2 text-sm" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
              </div>

              <Button onClick={handleCreate} className="w-full" variant="admin">
                <Plus size={16} className="mr-2" />
                Adicionar Regra
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Regras Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500 text-center py-10">Carregando...</p>
              ) : items.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-lg">
                  <Bell className="mx-auto text-slate-300 w-8 h-8 mb-3" />
                  <p className="text-sm text-slate-500 font-medium">Nenhuma regra configurada</p>
                  <p className="text-xs text-slate-400 mt-1">Adicione uma regra ao lado para começar a receber alertas.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(rule => (
                    <div key={rule.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg shadow-sm bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] bg-white">{rule.event}</Badge>
                          <span className="text-slate-400 text-xs">→</span>
                          <Badge variant="default" className="text-[10px]"><Mail size={10} className="mr-1 inline" /> {rule.action}</Badge>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{rule.target}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(rule.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: "include", cache: "no-store", ...options });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível carregar os dados.");
  return body;
}
