"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Bell, Mail, Activity, Zap } from "lucide-react";

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
          <div className="sticky top-20 bg-white/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold mb-6 text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs">1</span>
              Montar Novo Fluxo
            </h3>
            
            <div className="space-y-0 relative before:absolute before:inset-y-6 before:left-[19px] before:w-0.5 before:bg-slate-200">
              
              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 top-1 w-10 h-10 bg-indigo-50 border-2 border-indigo-200 rounded-full flex items-center justify-center text-indigo-500 z-10 shadow-sm">
                  <Activity size={18} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Quando acontecer (Gatilho)</label>
                  <select className="w-full bg-slate-50 border-0 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" value={form.event} onChange={e => setForm({...form, event: e.target.value})}>
                    <option value="PAGAMENTO_APROVADO">Pagamento Aprovado</option>
                    <option value="PAGAMENTO_FALHOU">Pagamento Recusado/Falhou</option>
                    <option value="NOVA_INSCRICAO">Nova Inscrição Criada</option>
                  </select>
                </div>
              </div>

              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 top-1 w-10 h-10 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center text-amber-500 z-10 shadow-sm">
                  <Zap size={18} />
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Fazer isso (Ação)</label>
                  <select className="w-full bg-slate-50 border-0 rounded-md px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none" value={form.action} onChange={e => {
                    setForm({...form, action: e.target.value, target: ""});
                  }}>
                    <option value="SEND_EMAIL">Enviar E-mail</option>
                    <option value="WEBHOOK">Disparar Webhook (POST)</option>
                  </select>
                </div>
              </div>

              <div className="relative pl-12 pb-6">
                <div className="absolute left-0 top-1 w-10 h-10 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-emerald-500 z-10 shadow-sm">
                  {form.action === "WEBHOOK" ? <Zap size={18} /> : <Mail size={18} />}
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{form.action === "WEBHOOK" ? "URL do Webhook" : "Para este destino"}</label>
                  <input type={form.action === "WEBHOOK" ? "url" : "email"} placeholder={form.action === "WEBHOOK" ? "https://hooks.zapier.com/..." : "contato@exemplo.com"} className="w-full bg-slate-50 border-0 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-300" value={form.target} onChange={e => setForm({...form, target: e.target.value})} />
                </div>
              </div>

            </div>

            <Button onClick={handleCreate} className="w-full mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md py-6">
              <Plus size={18} className="mr-2" />
              Ativar Fluxo
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white/80 p-6 rounded-2xl shadow-sm border border-slate-200/60 backdrop-blur-sm h-full">
            <h3 className="text-sm font-semibold mb-6 text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs">2</span>
              Fluxos Ativos
            </h3>
            
            <div className="h-[calc(100%-3rem)]">
              {loading ? (
                <p className="text-sm text-slate-500 text-center py-20 flex flex-col items-center gap-3">
                  <Activity className="animate-spin text-slate-300 w-6 h-6" />
                  Carregando fluxos...
                </p>
              ) : items.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Zap className="mx-auto text-slate-300 w-10 h-10 mb-3" />
                  <p className="text-sm text-slate-600 font-medium">Nenhum fluxo ativo</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Crie seu primeiro fluxo de automação no painel ao lado.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  {items.map(rule => (
                    <div key={rule.id} className="relative group bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                        <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                          <Activity size={12} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {rule.event === "PAGAMENTO_APROVADO" ? "Pagamento Aprovado" : rule.event === "PAGAMENTO_FALHOU" ? "Pagamento Recusado" : "Nova Inscrição"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                          <Zap size={12} />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{rule.action === "WEBHOOK" ? "Disparar Webhook" : "Enviar E-mail"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                          {rule.action === "WEBHOOK" ? <Zap size={12} /> : <Mail size={12} />}
                        </div>
                        <span className="text-xs font-medium text-slate-900 truncate">{rule.target}</span>
                      </div>

                      <button onClick={() => handleDelete(rule.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
