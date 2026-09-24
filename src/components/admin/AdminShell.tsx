"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CreditCard, Layers3, LogOut, Mail, Menu, Users, X, Activity, QrCode } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/inscricoes", label: "Inscrições", icon: Users },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/admin/lotes", label: "Lotes", icon: Layers3 },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/check-in", label: "Check-in", icon: QrCode },
  { href: "/admin/jobs", label: "Servidor & Jobs", icon: Activity },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[#0e2043] text-white transition-transform lg:translate-x-0 shadow-2xl lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="flex items-center gap-3 transition hover:opacity-80">
            <img src="/brand/lighthouse-icon.webp" alt="Lighthouse" className="h-6 w-auto opacity-90" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-white">Lighthouse '27</span>
          </Link>
          <button className="lg:hidden p-1 text-white/50 hover:text-white transition" aria-label="Fechar menu" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-[var(--gold)] shadow-sm"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[var(--gold)]" : "text-white/50"} />
                {label}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut size={16} />
            Sair do Painel
          </button>
        </div>
      </aside>
      
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-[#0e2043]/50 backdrop-blur-sm lg:hidden" 
          onClick={() => setOpen(false)} 
        />
      )}

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 lg:px-8 shadow-sm">
          <button className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition rounded-md hover:bg-slate-100" aria-label="Abrir menu" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          
          <div className="ml-auto flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="hidden text-xs font-bold text-slate-900 sm:block">Administrador</span>
              <span className="hidden text-[10px] text-slate-500 uppercase tracking-widest sm:block">Acesso Restrito</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/30 text-xs font-extrabold text-[#0e2043]">
              AD
            </div>
          </div>
        </header>
        <main className="w-full p-4 lg:p-8 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
