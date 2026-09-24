"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingScheduleSection() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const activeDay = campContent.program[selectedDayIndex];

  return (
    <section id="programacao" className="relative py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <RevealOnScroll className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
            CRONOGRAMA OFICIAL • 3 DIAS DE EVENTO
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold text-white leading-tight">
            Três dias marcantes.
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Uma programação desenvolvida para edificação, louvor e comunhão.
          </p>
        </RevealOnScroll>

        {/* Day Selector Segmented Bar */}
        <div className="mt-10 flex justify-center border-b border-white/20 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {campContent.program.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={day.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`relative py-2 text-sm font-bold transition-all cursor-pointer ${
                    isSelected ? "text-[var(--gold)]" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span>{day.day}</span>
                  <span className="ml-2 text-xs font-mono font-normal opacity-70">({day.date})</span>
                  {isSelected && (
                    <motion.div
                      layoutId="minimalTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--gold)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Timeline */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-4">
                <span className="text-xs font-mono text-[var(--gold)] font-bold uppercase tracking-wider">
                  {activeDay.tag}
                </span>
              </div>

              <div className="divide-y divide-white/20 border-t border-b border-white/20">
                {activeDay.items.map((item) => (
                  <div key={item.title} className="py-4 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs font-bold text-[var(--gold)] w-20 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-sm font-semibold text-white/95 flex-1">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
