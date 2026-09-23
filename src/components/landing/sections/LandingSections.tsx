"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { campContent } from "@/content/camp";
import {
  RevealOnScroll,
  RevealStagger,
  RevealStaggerItem,
} from "@/components/landing/RevealOnScroll";
import type { CampInfo } from "@/components/landing/types";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--amber)]">{children}</p>
  );
}

type SectionsProps = {
  camp: CampInfo | null;
  price: string | null;
};

export function LandingSections({ camp, price }: SectionsProps) {
  return (
    <>
      <section id="sobre" className="relative bg-[var(--background)] px-6 py-24 lg:px-8 lg:py-32">
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-64 w-64 bg-[radial-gradient(circle,rgba(232,175,46,.12),transparent_70%)]" />
        <RevealOnScroll className="relative mx-auto max-w-6xl">
          <SectionLabel>Sobre</SectionLabel>
          <h2 className="mt-6 max-w-2xl font-serif text-[clamp(2rem,5vw,3.25rem)] leading-tight text-[var(--pine)]">
            {campContent.aboutTitle}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--moss)]">{campContent.aboutText}</p>
        </RevealOnScroll>
      </section>

      <section
        id="experiencia"
        className="relative overflow-hidden border-y border-[color:var(--amber)/25%] bg-[linear-gradient(180deg,#fff9eb_0%,#f6e7bd_48%,#f0d998_100%)] px-6 py-24 lg:px-8 lg:py-32"
      >
        <div aria-hidden className="landing-grain pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl">
          <RevealOnScroll>
            <SectionLabel>Programação</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,5vw,3.25rem)] text-[var(--pine)]">
              Três dias. Um farol.
            </h2>
          </RevealOnScroll>
          <RevealStagger className="mt-16 grid gap-8 md:grid-cols-3">
            {campContent.program.map((day) => (
              <RevealStaggerItem key={day.day}>
                <article className="group h-full rounded-2xl border border-[color:var(--pine)/10%] bg-[var(--paper)]/80 p-8 shadow-[0_12px_40px_rgba(34,49,100,.06)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-[color:var(--amber)/40%] hover:shadow-[0_20px_50px_rgba(232,175,46,.15)]">
                  <h3 className="font-serif text-2xl text-[var(--amber)]">{day.day}</h3>
                  <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--moss)]">
                    {day.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </RevealStaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section id="local" className="bg-[var(--sand)] px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <RevealOnScroll distance={36}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(34,49,100,.12)] ring-1 ring-[color:var(--amber)/30%]"
            >
              <div
                className="absolute inset-0 scale-105 bg-[linear-gradient(145deg,rgba(232,175,46,.25),rgba(14,32,67,.15)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                role="img"
                aria-label="Paisagem costeira ao entardecer"
              />
            </motion.div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <SectionLabel>O lugar</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,5vw,3rem)] text-[var(--pine)]">
              {camp?.location ?? "Um refúgio para respirar"}
            </h2>
            <p className="mt-6 max-w-md leading-7 text-[var(--moss)]">
              Longe da rotina, perto da presença de Deus — espaço para descanso, comunhão e silêncio.
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--azure)] transition-colors hover:text-[var(--pine)]"
            >
              Ver no mapa
              <ArrowUpRight size={16} />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-t border-[color:var(--amber)/20%] bg-[var(--paper)] px-6 py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <RevealOnScroll>
            <SectionLabel>Incluído</SectionLabel>
            <h2 className="mt-6 font-serif text-3xl text-[var(--pine)] sm:text-4xl">
              Você traz a fé. Nós cuidamos do resto.
            </h2>
          </RevealOnScroll>
          <RevealStagger className="mt-10 list-none space-y-3 lg:mt-0" stagger={0.07}>
            {campContent.included.map((item) => (
              <RevealStaggerItem key={item}>
                <div className="flex items-start gap-3 rounded-xl border border-transparent bg-[var(--background)]/60 px-4 py-3 text-[var(--moss)] transition-colors hover:border-[color:var(--amber)/35%]">
                  <Check size={18} className="mt-0.5 shrink-0 text-[var(--amber)]" aria-hidden />
                  {item}
                </div>
              </RevealStaggerItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section
        id="valores"
        className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-28"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(135deg,#e8af2e_0%,#e8c766_35%,#f6e7bd_70%,#223164_100%)]"
        />
        <div aria-hidden className="hero-beacon-glow absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />
        <div aria-hidden className="landing-grain absolute inset-0 opacity-25" />
        <RevealOnScroll className="relative mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="text-[var(--abyss)]">
            <SectionLabel>Inscrições</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,5vw,3.25rem)] text-[var(--pine)]">Seu lugar está aqui.</h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--pine)]/75">
              {camp?.availableSpots
                ? `${camp.availableSpots} vagas neste lote.`
                : "Consulte a disponibilidade com a liderança."}
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--paper)]/90 p-8 shadow-[0_20px_60px_rgba(14,32,67,.15)] backdrop-blur-md md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--moss)]">
              {camp?.currentBatch?.name ?? "Próximo lote"}
            </p>
            <p className="mt-2 font-serif text-5xl text-[var(--pine)]">{price ?? "Em breve"}</p>
            <Button size="lg" className="mt-8 w-full shadow-[0_8px_28px_rgba(232,175,46,.4)] md:w-auto" asChild>
              <Link href="/inscricao">
                Garantir meu lugar
                <ArrowUpRight size={18} />
              </Link>
            </Button>
          </div>
        </RevealOnScroll>
      </section>

      <section id="faq" className="bg-[var(--background)] px-6 py-24 lg:px-8 lg:py-32">
        <RevealOnScroll className="mx-auto max-w-2xl">
          <SectionLabel>Dúvidas</SectionLabel>
          <h2 className="mt-6 font-serif text-4xl text-[var(--pine)]">Antes de ir.</h2>
          <div className="mt-12">
            {campContent.faq.map((item, i) => (
              <RevealOnScroll key={item.question} delay={i * 0.06} distance={16}>
                <details className="group border-b border-[color:var(--pine)/12%] py-5 first:border-t">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-[var(--pine)] transition-colors hover:text-[var(--azure)]">
                    {item.question}
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-[var(--amber)] transition-transform duration-300 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="pt-4 text-sm leading-7 text-[var(--moss)]">{item.answer}</p>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
