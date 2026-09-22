"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CreditCard, Layers3, LogOut, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/inscricoes", label: "Inscrições", icon: Users },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/admin/lotes", label: "Lotes", icon: Layers3 },
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-60 border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
          <Link href="/admin" className="text-sm font-semibold tracking-tight text-slate-900">
            Acampamento
          </Link>
          <button className="lg:hidden" aria-label="Fechar menu" onClick={() => setOpen(false)}>
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <nav className="space-y-0.5 p-3">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === href
                  ? "bg-slate-100 font-medium text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="absolute bottom-4 left-3 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut size={16} />
          Sair
        </button>
      </aside>
      <div className="lg:pl-60">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <button className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}>
            <Menu size={20} className="text-slate-500" />
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
              AD
            </div>
            <span className="hidden text-sm text-slate-600 sm:block">Administrador</span>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
