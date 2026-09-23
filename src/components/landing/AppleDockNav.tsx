"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  Calendar,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StageId =
  | "inicio"
  | "sobre"
  | "programa"
  | "local"
  | "incluido"
  | "faq"
  | "inscricao";

export type DockItem = {
  id: StageId;
  label: string;
  icon: typeof Sparkles;
};

export const dockItems: DockItem[] = [
  { id: "inicio", label: "Início", icon: Sparkles },
  { id: "sobre", label: "Sobre", icon: Compass },
  { id: "programa", label: "Programa", icon: Calendar },
  { id: "local", label: "Local", icon: MapPin },
  { id: "incluido", label: "Incluso", icon: CheckCircle2 },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "inscricao", label: "Inscrição", icon: Ticket },
];

type AppleDockNavProps = {
  activeId: StageId;
  onChange: (id: StageId) => void;
  "aria-label"?: string;
};

export function AppleDockNav({
  activeId,
  onChange,
  "aria-label": ariaLabel = "Navegação",
}: AppleDockNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="minimal-glass-dock mx-auto flex items-center justify-center gap-1 rounded-full p-1.5 shadow-xl transition-all duration-300 border border-white/35 backdrop-blur-3xl lg:mx-0 lg:flex-col lg:rounded-[2rem] lg:p-2"
    >
      <div className="flex items-center gap-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:px-0">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          const isHighlight = item.id === "inscricao";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 lg:w-full lg:rounded-2xl lg:px-4 lg:py-2.5",
                isActive
                  ? "text-white font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/15",
                isHighlight && !isActive && "text-[var(--gold)] font-bold"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="vertical-dock-pill"
                  className={cn(
                    "absolute inset-0 rounded-full lg:rounded-2xl shadow-md",
                    isHighlight
                      ? "bg-[var(--gold)] text-[#0e2043]"
                      : "bg-white/25 backdrop-blur-md border border-white/40"
                  )}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <Icon
                className={cn(
                  "relative z-10 h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive
                    ? isHighlight
                      ? "text-[#0e2043]"
                      : "text-white"
                    : "text-white/90 group-hover:text-white"
                )}
              />

              <span
                className={cn(
                  "relative z-10 hidden whitespace-nowrap text-[11px] sm:text-xs tracking-tight sm:inline-block",
                  isHighlight && isActive && "text-[#0e2043] font-bold"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
