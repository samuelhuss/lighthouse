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
    <main className="flex min-h-screen items-center justify-center bg-[#0e2043] relative overflow-hidden px-6 py-12">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--gold)]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--azure)]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3 transition hover:opacity-80">
            <img src="/brand/lighthouse-icon.webp" alt="Lighthouse" className="h-12 w-auto opacity-90" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-white">Lighthouse '27</span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/90">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Administração</h1>
                <p className="text-xs text-white/60 font-mono tracking-wider">ACESSO RESTRITO</p>
              </div>
            </div>
            
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 text-xs font-bold uppercase tracking-wider">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(event) => setEmail(event.target.value)} 
                  autoComplete="email"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--gold)]/50 focus-visible:border-[var(--gold)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80 text-xs font-bold uppercase tracking-wider">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(event) => setPassword(event.target.value)} 
                  autoComplete="current-password"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--gold)]/50 focus-visible:border-[var(--gold)]"
                />
              </div>
              
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-4 bg-[var(--gold)] hover:bg-white text-[#0e2043] font-bold tracking-wide transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Verificando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Acessar Painel <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
