"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EmailCampaign() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/v1/admin/emails/campaign", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message, confirmation }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível enviar a campanha.");
      setFeedback({ kind: "success", text: `${body.sent} email(s) enviado(s) para inscritos com consentimento.${body.failed ? ` Falhas: ${body.failed}.` : ""}` });
      setSubject(""); setMessage(""); setConfirmation("");
    } catch (error) {
      setFeedback({ kind: "error", text: error instanceof Error ? error.message : "Não foi possível enviar a campanha." });
    } finally {
      setSending(false);
    }
  }

  return <>
    <div className="mb-6"><h1 className="text-xl font-semibold text-slate-900">Emails</h1><p className="mt-1 text-sm text-slate-500">Envie novidades somente para inscritos que autorizaram comunicações.</p></div>
    <Card className="max-w-2xl"><CardHeader><CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Mail size={16} />Nova campanha</CardTitle></CardHeader><CardContent>
      <form onSubmit={submit} className="space-y-5">
        <div><Label htmlFor="email-subject">Assunto</Label><Input id="email-subject" value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={150} className="mt-1.5" placeholder="O acampamento está chegando" /></div>
        <div><Label htmlFor="email-message">Mensagem</Label><textarea id="email-message" value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={10000} rows={10} className="mt-1.5 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Escreva a mensagem da campanha..." /></div>
        <div><Label htmlFor="email-confirmation">Confirmação</Label><p className="mt-1 text-xs text-slate-500">Para evitar disparos acidentais, digite ENVIAR.</p><Input id="email-confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required className="mt-1.5" placeholder="ENVIAR" /></div>
        {feedback && <p role="status" className={feedback.kind === "success" ? "flex items-center gap-2 text-sm text-emerald-700" : "text-sm text-red-700"}>{feedback.kind === "success" && <Check size={15} />}{feedback.text}</p>}
        <Button type="submit" variant="admin" disabled={sending}>{sending ? <LoaderCircle className="animate-spin" size={15} /> : <Mail size={15} />}Enviar para a base autorizada</Button>
      </form>
    </CardContent></Card>
  </>;
}
