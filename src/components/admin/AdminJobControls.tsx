"use client";

import { useState } from "react";
import { Check, Clock3, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type JobName = "expire-registrations" | "reconcile-payments";

export function AdminJobControls() {
  const [running, setRunning] = useState<JobName | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runJob(job: JobName) {
    setRunning(job);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/v1/admin/jobs/${job}`, { method: "POST", credentials: "include" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível executar o job.");
      setMessage(job === "expire-registrations" ? `${body.expired} inscrição(ões) expirada(s).` : `${body.processed} pagamento(s) reconciliado(s).`);
    } catch (jobError) {
      setError(jobError instanceof Error ? jobError.message : "Não foi possível executar o job.");
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Expiration Job */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Clock3 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Limpeza de Inscrições</h3>
                <p className="text-xs text-slate-500 mt-0.5">Expira vagas não pagas no prazo.</p>
              </div>
            </div>
            <Button size="sm" variant="adminOutline" className="h-8" onClick={() => void runJob("expire-registrations")} disabled={running !== null}>
              {running === "expire-registrations" ? <LoaderCircle className="animate-spin" size={14} /> : "Executar"}
            </Button>
          </div>
        </div>

        {/* Reconciliation Job */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <RefreshCw size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sincronização Financeira</h3>
                <p className="text-xs text-slate-500 mt-0.5">Reconcilia Mercado Pago c/ sistema.</p>
              </div>
            </div>
            <Button size="sm" variant="adminOutline" className="h-8" onClick={() => void runJob("reconcile-payments")} disabled={running !== null}>
              {running === "reconcile-payments" ? <LoaderCircle className="animate-spin" size={14} /> : "Executar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="overflow-hidden rounded-xl bg-slate-900 shadow-inner border border-slate-800">
        <div className="flex items-center border-b border-slate-800 bg-slate-950 px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="ml-4 text-xs font-mono text-slate-500">terminal_log.sh</span>
        </div>
        <div className="p-4 font-mono text-xs sm:text-sm h-32 overflow-y-auto">
          <p className="text-slate-500 mb-2">$ Aguardando comandos do operador...</p>
          {running && (
            <p className="text-amber-400 mb-1 flex items-center gap-2">
              <LoaderCircle className="animate-spin h-3 w-3" />
              Executando tarefa de sistema: {running}...
            </p>
          )}
          {message && (
            <p className="text-emerald-400">
              <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
              [SUCESSO] {message}
            </p>
          )}
          {error && (
            <p className="text-red-400">
              <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
              [ERRO FATAL] {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
