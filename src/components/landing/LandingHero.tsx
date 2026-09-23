"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import { campContent } from "@/content/camp";
import type { CampInfo } from "@/components/landing/types";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
}

type LandingHeroProps = {
  camp: CampInfo | null;
};

export function LandingHero({ camp }: LandingHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxGlow = useTransform(scrollYProgress, [0, 1], reduzir ? [0, 0] : [0, 120]);
  const parallaxContent = useTransform(scrollYProgress, [0, 1], reduzir ? [0, 0] : [0, 48]);
  const fadeHero = useTransform(scrollYProgress, [0, 0.85], [1, reduzir ? 1 : 0.35]);

  const period =
    camp?.startDate && camp.endDate
      ? `${formatDate(camp.startDate)} — ${formatDate(camp.endDate)}`
      : "Datas em breve";
  const place = camp?.location ?? "Local em breve";

  return (
    <section
      ref={ref}
      id="top"
      className="landing-hero-bg relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-6 pb-20 pt-32 lg:px-8 lg:pb-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,#fff9eb_0%,#f6e7bd_22%,#e8c76655_42%,#3462ac33_58%,#223164_78%,#0e2043_100%)]" />
        <motion.div style={{ y: parallaxGlow }} className="absolute inset-0">
          <div className="hero-beacon-glow absolute left-1/2 top-[-18%] h-[95vmin] w-[95vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,236,180,.95)_0%,rgba(232,175,46,.35)_35%,transparent_68%)]" />
          <div className="hero-beacon-glow absolute -right-[10%] top-[8%] h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(232,199,102,.5)_0%,transparent_70%)] [animation-delay:-3s]" />
        </motion.div>
        <div className="hero-beacon-beam absolute left-[18%] top-0 h-[70%] w-[45%] opacity-40" />
        <div className="landing-grain absolute inset-0 opacity-[0.35]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(14,32,67,.55)_45%,rgba(6,13,28,.92)_100%)]" />
      </div>

      <motion.div
        aria-hidden
        style={{ opacity: fadeHero }}
        className="pointer-events-none absolute right-[10%] top-24 hidden lg:block"
      >
        <LighthouseMark size={56} withBeam className="beacon-pulse drop-shadow-[0_0_40px_rgba(232,175,46,.45)]" />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-0 h-full w-px bg-gradient-to-b from-[var(--amber)] via-[var(--gold)]/40 to-transparent"
      />

      <motion.div style={{ y: parallaxContent }} className="relative mx-auto w-full max-w-6xl text-white">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]"
        >
          {campContent.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[14ch] font-serif text-[clamp(2.75rem,9vw,5.5rem)] leading-[0.95] tracking-[-0.02em] drop-shadow-[0_2px_24px_rgba(14,32,67,.35)]"
        >
          {campContent.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-md text-base leading-relaxed text-white/82 sm:text-lg"
        >
          {campContent.heroDescription}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10"
        >
          <Button size="lg" className="shadow-[0_8px_32px_rgba(232,175,46,.35)]" asChild>
            <Link href="/inscricao">
              Quero me inscrever
              <ArrowUpRight size={18} />
            </Link>
          </Button>
          <dl className="flex flex-col gap-1 border-l border-[var(--gold)]/40 pl-5 text-sm text-white/70 sm:flex-row sm:gap-8 sm:border-l-0 sm:pl-0">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/80">Quando</dt>
              <dd className="mt-1">{period}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/80">Onde</dt>
              <dd className="mt-1">{place}</dd>
            </div>
          </dl>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/45">Role</span>
        <span className="scroll-hint-line block h-10 w-px origin-top bg-gradient-to-b from-[var(--amber)] to-transparent" />
      </motion.div>
    </section>
  );
}
