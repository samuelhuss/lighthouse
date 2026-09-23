"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SegmentItem<T extends string> = {
  id: T;
  label: string;
};

type GlassSegmentNavProps<T extends string> = {
  items: SegmentItem<T>[];
  value: T;
  onChange: (id: T) => void;
  "aria-label": string;
};

/** Controle segmentado estilo vidro fosco (referência visual Apple) */
export function GlassSegmentNav<T extends string>({
  items,
  value,
  onChange,
  "aria-label": ariaLabel,
}: GlassSegmentNavProps<T>) {
  return (
    <nav aria-label={ariaLabel} className="glass-surface mx-auto w-full max-w-3xl rounded-2xl p-1.5">
      <div className="flex gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const ativo = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "relative shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium tracking-[-0.01em] transition-colors sm:px-5",
                ativo ? "text-white" : "text-white/72 hover:text-white",
              )}
            >
              {ativo && (
                <motion.span
                  layoutId="landing-glass-segment"
                  className="glass-segment-active absolute inset-0 rounded-xl"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
