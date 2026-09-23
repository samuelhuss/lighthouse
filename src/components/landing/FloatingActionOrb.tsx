"use client";

import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FloatingActionOrbProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  /** Destaque visual (ex.: inscrições) */
  destaque?: boolean;
  floatDelay?: number;
  className?: string;
  style?: CSSProperties;
};

export function FloatingActionOrb({
  icon: Icon,
  label,
  onClick,
  destaque = false,
  floatDelay = 0,
  className,
  style,
}: FloatingActionOrbProps) {
  const reduzir = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={style}
      className={cn(
        "group flex flex-col items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        className,
      )}
      animate={reduzir ? undefined : { y: [0, -10, 0] }}
      transition={{
        duration: 4.5 + floatDelay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay,
      }}
      whileHover={reduzir ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      <span
        className={cn(
          "relative flex size-12 items-center justify-center rounded-full border backdrop-blur-md transition-shadow duration-300 sm:size-14",
          destaque
            ? "border-[var(--amber)] bg-[var(--amber)] text-[var(--abyss)] shadow-[0_0_32px_rgba(232,175,46,.55)]"
            : "border-white/25 bg-[rgba(14,32,67,.45)] text-[var(--gold)] shadow-[0_8px_28px_rgba(14,32,67,.35)] group-hover:border-[var(--gold)]/60 group-hover:bg-[rgba(14,32,67,.65)]",
        )}
      >
        {!destaque && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(232,175,46,.25)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
        <Icon className="relative size-5 sm:size-[22px]" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="max-w-[4.5rem] text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75 sm:max-w-none sm:text-[11px]">
        {label}
      </span>
    </motion.button>
  );
}
