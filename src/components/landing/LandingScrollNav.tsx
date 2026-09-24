"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre Nós" },
  { id: "regras", label: "Regras" },
  { id: "local", label: "O Lugar" },
  { id: "lotes", label: "Lotes" },
  { id: "faq", label: "FAQ" },
];

export function LandingScrollNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Inicializa o estado corretamente no primeiro render
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex justify-center ${
          isScrolled ? "pt-0 md:pt-4" : "pt-0"
        }`}
      >
        <nav
          className={`w-full transition-all duration-500 max-w-5xl ${
            isScrolled
              ? "mx-0 bg-transparent px-4 sm:px-8 py-4 sm:py-6 border-transparent md:mx-6 md:rounded-full md:bg-[#0e2043]/90 md:backdrop-blur-2xl md:shadow-2xl md:border md:border-white/15 md:px-6 md:py-2.5"
              : "mx-0 bg-transparent px-4 sm:px-8 py-4 sm:py-6 border-transparent"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Desktop Links Spacer */}
            <div className="hidden md:flex flex-1" />

            {/* Desktop Links */}
            <div className="hidden md:flex items-center justify-center gap-6 text-xs font-bold tracking-wider">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors cursor-pointer hover:opacity-100 ${
                    isScrolled ? "text-white/80 hover:text-[var(--gold)]" : "text-[#0e2043]/85 hover:text-[#0e2043]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action Buttons & Mobile Toggle */}
            <div className="flex items-center justify-between w-full md:w-auto md:justify-end md:gap-3 md:flex-1">
              <button
                onClick={() => scrollToSection("inscricao")}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold transition-all hover:scale-[1.03] active:scale-95 cursor-pointer ${
                  isScrolled
                    ? "bg-white text-[#0e2043] shadow-md hover:bg-[var(--gold)]"
                    : "bg-[#0e2043] text-white shadow-xl hover:bg-[#0e2043]/90"
                }`}
              >
                <span>Inscrição</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`md:hidden p-1.5 rounded-full border transition cursor-pointer ${
                  isScrolled
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-[#0e2043]/10 border-[#0e2043]/30 text-[#0e2043] hover:bg-[#0e2043]/20"
                }`}
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#0e2043]/95 backdrop-blur-3xl flex flex-col justify-between p-6 md:hidden"
          >
            <div className="flex items-center justify-end border-b border-white/15 pb-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 cursor-pointer"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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

            <div className="border-t border-white/15 pt-6">
              <button
                onClick={() => scrollToSection("inscricao")}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-white via-amber-50 to-[var(--gold)] text-sm font-extrabold text-[#0e2043] shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fazer Minha Inscrição Agora</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
