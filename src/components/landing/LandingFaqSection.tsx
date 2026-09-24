"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { campContent } from "@/content/camp";
import { RevealOnScroll } from "@/components/landing/RevealOnScroll";

export function LandingFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll className="text-center">
          <span className="text-xs font-mono tracking-[0.25em] text-[var(--gold)] uppercase font-extrabold">
            Dúvidas Frequentes
          </span>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] font-extrabold text-white leading-tight">
            Perguntas Rápidas
          </h2>
        </RevealOnScroll>

        <div className="mt-10 divide-y divide-white/20 border-t border-b border-white/20">
          {campContent.faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer text-sm sm:text-base font-bold text-white hover:text-[var(--gold)] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`h-4 w-4 text-[var(--gold)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
