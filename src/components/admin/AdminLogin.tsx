"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const configResponse = await fetch("/api/admin/auth/config", { cache: "no-store" });
      const config = await configResponse.json();
      if (!configResponse.ok) throw new Error(config.error?.message ?? "Autenticação não configurada.");
      const supabase = createClient(config.url, config.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.session) throw new Error("E-mail ou senha inválidos.");
      const response = await fetch("/api/admin/auth/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken: data.session.access_token }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Esta conta não possui acesso administrativo.");
      router.replace("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
          Acampamento
        </Link>
        <Card className="mt-8 p-7">
          <CardContent className="p-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-white">
              <ShieldCheck size={18} />
            </div>
            <h1 className="mt-5 text-lg font-semibold text-slate-900">Acesso administrativo</h1>
            <p className="mt-1.5 text-sm text-slate-500">Entre com sua conta autorizada para acompanhar o acampamento.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5" autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5" autoComplete="current-password" />
              </div>
              {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <Button type="submit" variant="admin" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={16} />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar no painel <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
