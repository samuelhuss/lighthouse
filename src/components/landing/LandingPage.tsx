"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronDown, Menu, MapPin, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { campContent } from "@/content/camp";

type CampInfo = {
  name: string;
  description: string | null;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  availableSpots: number;
  currentBatch: { name: string; priceCents: number } | null;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));
}

export function LandingPage({ camp }: { camp: CampInfo | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const price = camp?.currentBatch ? (camp.currentBatch.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null;
  const links = [["Sobre", "sobre"], ["Experiência", "experiencia"], ["Local", "local"], ["Valores", "valores"], ["FAQ", "faq"]];

  return (
    <main className="overflow-hidden bg-[var(--background)]">
      <nav className="absolute inset-x-0 top-0 z-20 border-b border-white/15 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <Link href="#top" className="font-serif text-xl font-semibold tracking-tight">fora<span className="text-[var(--clay)]">.</span></Link>
          <div className="hidden items-center gap-7 text-sm text-white/80 md:flex">
            {links.map(([label, id]) => <a key={id} href={`#${id}`} className="transition-colors hover:text-white">{label}</a>)}
          </div>
          <Button asChild size="sm" className="hidden bg-white text-[var(--pine)] hover:bg-white/90 md:inline-flex"><Link href="/inscricao">Inscreva-se <ArrowUpRight size={15} /></Link></Button>
          <button aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/15 bg-[var(--pine)] px-6 py-5 md:hidden">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="block py-3 text-white/85">{label}</a>)}<Link href="/inscricao" className="mt-3 block font-semibold text-[var(--clay)]">Inscreva-se <ArrowUpRight className="inline" size={15} /></Link></div>}
      </nav>

      <section id="top" className="relative flex min-h-[720px] items-end bg-[linear-gradient(180deg,rgba(18,47,40,.08),rgba(18,47,40,.88)),url('https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center px-6 pb-16 pt-40 text-white lg:min-h-[820px] lg:px-10 lg:pb-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[.24em] text-[#e5b093]">{campContent.eyebrow}</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl lg:text-8xl">{campContent.heroTitle}</h1>
            <p className="mt-7 max-w-lg text-lg leading-7 text-white/75">{campContent.heroDescription}</p>
            <Button size="lg" className="mt-8" asChild><Link href="/inscricao">Quero me inscrever <ArrowUpRight size={18} /></Link></Button>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/30 pt-5 text-sm text-white/75">
            <div><CalendarDays className="mb-3 text-[#e5b093]" size={20} /><p>{camp?.startDate && camp.endDate ? `${formatDate(camp.startDate)} — ${formatDate(camp.endDate)}` : "Data em breve"}</p></div>
            <div><MapPin className="mb-3 text-[#e5b093]" size={20} /><p>{camp?.location ?? "Local em breve"}</p></div>
          </div>
        </div>
      </section>

      <section id="sobre" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-36">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-[var(--clay)]">01 / Sobre</p>
        <div><h2 className="max-w-3xl font-serif text-4xl leading-tight text-[var(--pine)] sm:text-6xl">{campContent.aboutTitle}</h2><p className="mt-8 max-w-xl text-lg leading-8 text-[var(--moss)]">{campContent.aboutText}</p></div>
      </section>

      <section id="experiencia" className="bg-[var(--pine)] px-6 py-24 text-white lg:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><div className="mb-16 flex items-end justify-between gap-8"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#e5b093]">02 / Experiência</p><h2 className="font-serif text-4xl sm:text-6xl">Dias feitos para viver.</h2></div><span className="hidden text-right text-sm text-white/50 sm:block">Uma programação com<br />espaço para o inesperado.</span></div><div className="grid gap-0 border-t border-white/20 md:grid-cols-3">{campContent.program.map((day) => <div key={day.day} className="border-b border-white/20 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0"><h3 className="font-serif text-3xl text-[#e5b093]">{day.day}</h3><ul className="mt-7 space-y-4 text-sm text-white/70">{day.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div></div></section>

      <section id="local" className="grid min-h-[520px] bg-[#d8d2c6] lg:grid-cols-2"><div className="bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center" /><div className="flex items-center px-6 py-20 lg:px-16"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[var(--clay)]">03 / O lugar</p><h2 className="font-serif text-5xl text-[var(--pine)]">{camp?.location ?? "Um lugar para respirar"}</h2><p className="mt-6 max-w-md leading-7 text-[var(--moss)]">Um refúgio cercado de verde, com tudo o que precisamos para desacelerar e estar juntos.</p><a href="https://maps.google.com" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 font-semibold text-[var(--clay)]">Ver localização <ArrowUpRight size={16} /></a></div></div></section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[var(--clay)]">04 / Incluído</p><h2 className="mt-5 font-serif text-4xl text-[var(--pine)] sm:text-5xl">Você cuida do presente. A gente cuida do resto.</h2></div><ul className="divide-y divide-[color:var(--pine)/15%] border-y border-[color:var(--pine)/15%]">{campContent.included.map((item) => <li key={item} className="flex items-center gap-4 py-5 text-lg text-[var(--moss)]"><Check size={19} className="text-[var(--clay)]" />{item}</li>)}</ul></section>

      <section id="valores" className="bg-[#e5b093] px-6 py-20 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[var(--pine)]/60">05 / Inscrições</p><h2 className="font-serif text-5xl text-[var(--pine)]">Seu lugar está aqui.</h2><p className="mt-5 max-w-md text-[var(--pine)]/70">{camp?.availableSpots ? `${camp.availableSpots} vagas disponíveis neste lote.` : "Consulte a disponibilidade atual."}</p></div><div className="md:text-right"><p className="text-sm font-semibold text-[var(--pine)]/70">{camp?.currentBatch?.name ?? "Próximo lote"}</p><p className="my-2 font-serif text-5xl text-[var(--pine)]">{price ?? "Em breve"}</p><Button variant="default" size="lg" className="bg-[var(--pine)] hover:bg-[#0e3028]" asChild><Link href="/inscricao">Garantir meu lugar <ArrowUpRight size={18} /></Link></Button></div></div></section>

      <section id="faq" className="mx-auto max-w-4xl px-6 py-24 lg:py-32"><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[var(--clay)]">06 / Dúvidas</p><h2 className="font-serif text-5xl text-[var(--pine)]">Antes de ir.</h2><div className="mt-12">{campContent.faq.map((item) => <details key={item.question} className="group border-t border-[color:var(--pine)/20%] py-5"><summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-[var(--pine)]">{item.question}<ChevronDown size={20} className="transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pt-4 leading-7 text-[var(--moss)]">{item.answer}</p></details>)}</div></section>

      <footer className="bg-[var(--pine)] px-6 py-10 text-white lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-white/60 sm:flex-row"><span className="font-serif text-xl text-white">fora<span className="text-[var(--clay)]">.</span></span><span>Acampamento 2026 · Feito para estar presente.</span></div></footer>
    </main>
  );
}