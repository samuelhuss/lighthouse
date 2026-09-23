"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { cn } from "@/lib/utils";

const links = [
  ["Sobre", "sobre"],
  ["Programação", "experiencia"],
  ["Local", "local"],
  ["FAQ", "faq"],
] as const;

export function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500",
        scrolled
          ? "border-b border-[color:var(--amber)/25%] bg-[var(--paper)]/90 shadow-[0_8px_30px_rgba(232,175,46,.08)] backdrop-blur-md"
          : "border-b border-transparent bg-[linear-gradient(180deg,rgba(255,249,235,.75)_0%,transparent_100%)]",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="#top"
          className={cn(
            "inline-flex items-center gap-2.5 transition-colors",
            scrolled ? "text-[var(--pine)]" : "text-[var(--pine)]",
          )}
        >
          <LighthouseMark size={22} withBeam className={scrolled ? undefined : "beacon-pulse"} />
          <span className="font-serif text-lg tracking-tight">Lighthouse</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative text-sm text-[var(--moss)] transition-colors hover:text-[var(--pine)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--amber)] after:transition-[width] hover:after:w-full"
            >
              {label}
            </a>
          ))}
          <Button asChild size="sm">
            <Link href="/inscricao">
              Inscreva-se
              <ArrowUpRight size={15} />
            </Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="text-[var(--pine)] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[color:var(--amber)/20%] bg-[var(--paper)] md:hidden"
          >
            <div className="px-6 py-5">
              {links.map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-[var(--pine)]"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/inscricao"
                className="mt-2 inline-flex items-center gap-1 font-semibold text-[var(--amber)]"
              >
                Inscreva-se
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
