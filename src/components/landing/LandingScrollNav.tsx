"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { LighthouseMark } from "@/components/brand/LighthouseMark";

const NAV_ITEMS = [
  { id: "essencia", label: "Essência" },
  { id: "programacao", label: "Programação" },
  { id: "local", label: "O Lugar" },
  { id: "inscricao", label: "Inscrição" },
  { id: "faq", label: "FAQ" },
];

export function LandingScrollNav({ period }: { period: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 pt-3 sm:pt-5 transition-all duration-500">
        <nav
          className={`mx-auto max-w-5xl rounded-full transition-all duration-500 border border-white/20 backdrop-blur-2xl ${
            isScrolled
              ? "bg-[#0e2043]/90 py-2.5 px-4 sm:px-5 shadow-xl"
              : "bg-[#0e2043]/50 py-3 px-4 sm:px-6"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo Brand */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-left cursor-pointer group shrink-0"
            >
              <div className="p-1 rounded-full bg-white/10 border border-white/20 group-hover:border-[var(--gold)]/50 transition-colors">
                <LighthouseMark size={20} className="text-[var(--gold)] group-hover:scale-105 transition-transform" />
              </div>
              <span className="hidden sm:inline-block font-serif text-sm font-extrabold tracking-widest text-white uppercase">
                LIGHTHOUSE’27
              </span>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider text-white/80">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-[var(--gold)] transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => scrollToSection("inscricao")}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3.5 sm:px-4 py-1.5 text-xs font-extrabold text-[#0e2043] transition-all hover:bg-[var(--gold)] active:scale-95 shadow-md cursor-pointer"
              >
                <span>Inscrição</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition cursor-pointer"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Dedicated Mobile Navigation Modal Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#0e2043]/95 backdrop-blur-3xl flex flex-col justify-between p-6 md:hidden"
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2">
                <LighthouseMark size={24} className="text-[var(--gold)]" />
                <span className="font-serif text-sm font-extrabold tracking-widest text-white uppercase">
                  LIGHTHOUSE’27
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links List */}
            <div className="flex flex-col gap-6 my-auto text-center py-8">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="font-serif text-2xl font-bold text-white hover:text-[var(--gold)] transition cursor-pointer py-1"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            {/* Bottom Modal CTA */}
            <div className="border-t border-white/15 pt-6 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("inscricao")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-white via-amber-50 to-[var(--gold)] text-sm font-extrabold text-[#0e2043] shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fazer Minha Inscrição Agora</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <span className="text-[11px] text-white/50 font-mono text-center">
                {period} • Estância Farol da Serra
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
