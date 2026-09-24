"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Eye, LoaderCircle, Mail, Megaphone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type Audience = { total: number; recipients: Array<{ name: string; email: string }> };

export function EmailCampaign() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [from, setFrom] = useState("Remetente não configurado");
  const [audience, setAudience] = useState<Audience | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ subject: subject || "O acampamento está chegando", message: message || "Aqui aparecerá uma prévia da mensagem da campanha." });
      setLoadingPreview(true);
      void fetch(`/api/v1/admin/emails/campaign?${params.toString()}`, { credentials: "include", cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível gerar o preview."); return body; }).then((body) => { setFrom(body.from); setAudience(body.audience); setPreviewHtml(body.previewHtml); }).catch(() => undefined).finally(() => setLoadingPreview(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [subject, message]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/v1/admin/emails/campaign", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message, confirmation }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível enviar a campanha.");
      setFeedback({ kind: "success", text: `${body.sent} email(s) enviado(s) para a base autorizada.${body.failed ? ` Falhas: ${body.failed}.` : ""}` });
      setConfirmation("");
    } catch (error) {
      setFeedback({ kind: "error", text: error instanceof Error ? error.message : "Não foi possível enviar a campanha." });
    } finally {
      setSending(false);
    }
  }

  return <>
    <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-purple-900 shadow-xl border border-indigo-900/50">
      <div className="absolute inset-0 bg-[url('/brand/lighthouse-hero.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-10"></div>
      <div className="relative z-10 px-6 py-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-indigo-200 shadow-inner">
            <Megaphone size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Comunicação e Disparos</h1>
            <p className="mt-1 text-indigo-100 text-sm max-w-xl">
              Monte sua campanha, revise o visual em tempo real e alcance todos os campistas inscritos com apenas um clique.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,.85fr)_minmax(420px,1.15fr)]">
      <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Megaphone size={16} />Editor da campanha</CardTitle></CardHeader><CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div><Label htmlFor="email-subject">Assunto</Label><Input id="email-subject" value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={150} className="mt-1.5" placeholder="O acampamento está chegando" /></div>
          <div><Label htmlFor="email-message">Mensagem</Label><p className="mt-1 text-xs text-slate-500">Quebras de linha duplas separam parágrafos no email.</p><textarea id="email-message" value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={10000} rows={11} className="mt-1.5 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Escreva a mensagem da campanha..." /></div>
          <div className="rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-900">A mensagem será enviada somente para emails únicos com consentimento de novidades.</div>
          <div><Label htmlFor="email-confirmation">Confirmação de envio</Label><p className="mt-1 text-xs text-slate-500">Digite ENVIAR somente depois de revisar o preview e a audiência.</p><Input id="email-confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required className="mt-1.5" placeholder="ENVIAR" /></div>
          {feedback && <p role="status" className={feedback.kind === "success" ? "flex items-center gap-2 text-sm text-emerald-700" : "text-sm text-red-700"}>{feedback.kind === "success" && <Check size={15} />}{feedback.text}</p>}
          <Button type="submit" variant="admin" disabled={sending || !audience?.total}>{sending ? <LoaderCircle className="animate-spin" size={15} /> : <Mail size={15} />}Enviar para a base autorizada</Button>
        </form>
      </CardContent></Card>

      <div className="space-y-4">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Eye size={16} />Preview do email</CardTitle></CardHeader><CardContent className="p-3"><div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-100 px-2 pb-3 text-xs text-slate-500"><span><strong className="text-slate-700">De:</strong> {from}</span><span><strong className="text-slate-700">Assunto:</strong> {subject || "O acampamento está chegando"}</span></div>{loadingPreview ? <Skeleton className="h-[430px] w-full" /> : <iframe title="Preview do email" srcDoc={previewHtml} className="h-[430px] w-full rounded-md border border-slate-200 bg-white" sandbox="" />}</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Users size={16} />Audiência</CardTitle></CardHeader><CardContent>{audience ? <><p className="text-2xl font-semibold text-slate-900">{audience.total}</p><p className="text-xs text-slate-500">email(s) único(s) com consentimento de marketing</p><div className="mt-4 max-h-48 space-y-2 overflow-y-auto border-t border-slate-100 pt-3">{audience.recipients.map((recipient) => <div key={recipient.email} className="flex justify-between gap-3 text-xs"><span className="font-medium text-slate-700">{recipient.name}</span><span className="truncate text-slate-500">{recipient.email}</span></div>)}{audience.total > audience.recipients.length && <p className="pt-1 text-xs text-slate-400">Mostrando os primeiros {audience.recipients.length} destinatários.</p>}</div></> : <Skeleton className="h-24 w-full" />}</CardContent></Card>
      </div>
    </div>
  </>;
}
