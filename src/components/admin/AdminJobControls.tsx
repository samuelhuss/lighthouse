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
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-900">Operações de manutenção</p>
            <p className="mt-1 text-sm text-slate-500">Atualize inscrições vencidas e reconcilie pagamentos com o Mercado Pago.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="adminOutline" onClick={() => void runJob("expire-registrations")} disabled={running !== null}>
              {running === "expire-registrations" ? <LoaderCircle className="animate-spin" size={14} /> : <Clock3 size={14} />}
              Expirar inscrições
            </Button>
            <Button size="sm" variant="adminOutline" onClick={() => void runJob("reconcile-payments")} disabled={running !== null}>
              {running === "reconcile-payments" ? <LoaderCircle className="animate-spin" size={14} /> : <RefreshCw size={14} />}
              Reconciliar pagamentos
            </Button>
          </div>
        </div>
        {message && (
          <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
            <Check size={15} />
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
