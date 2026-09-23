"use client";

import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { campContent } from "@/content/camp";
import type { CampInfo } from "@/components/landing/types";

export type CardPanelId = "sobre" | "programa" | "local" | "incluido" | "inscricao" | "faq";

const titulos: Record<CardPanelId, string> = {
  sobre: "Sobre o acampamento",
  programa: "Programação",
  local: "O lugar",
  incluido: "O que está incluído",
  inscricao: "Inscrições",
  faq: "Dúvidas frequentes",
};

type LandingCardPanelProps = {
  panel: CardPanelId | null;
  onClose: () => void;
  camp: CampInfo | null;
  price: string | null;
};

export function LandingCardPanel({ panel, onClose, camp, price }: LandingCardPanelProps) {
  const aberto = panel !== null;

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[min(85dvh,640px)] overflow-y-auto border-[color:var(--amber)/30%] bg-[var(--paper)] p-0 shadow-[0_24px_80px_rgba(14,32,67,.25)] sm:max-w-md">
        {panel && (
          <>
            <div className="border-b border-[color:var(--amber)/25%] bg-[linear-gradient(135deg,#fff9eb,#f6e7bd)] px-6 py-5">
              <DialogHeader className="gap-1 text-left">
                <DialogTitle className="font-serif text-2xl text-[var(--pine)]">{titulos[panel]}</DialogTitle>
                <DialogDescription className="text-[var(--moss)]">
                  Acampamento Lighthouse · toque fora para voltar
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="px-6 py-5">{renderCorpo(panel, camp, price)}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function renderCorpo(panel: CardPanelId, camp: CampInfo | null, price: string | null) {
  switch (panel) {
    case "sobre":
      return (
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-[var(--pine)]">{campContent.aboutTitle}</h3>
          <p className="text-sm leading-7 text-[var(--moss)]">{campContent.aboutText}</p>
        </div>
      );
    case "programa":
      return (
        <ul className="space-y-6">
          {campContent.program.map((day) => (
            <li key={day.day}>
              <p className="font-serif text-lg text-[var(--amber)]">{day.day}</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--moss)]">
                {day.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    case "local":
      return (
        <div className="space-y-4">
          <p className="font-serif text-2xl text-[var(--pine)]">{camp?.location ?? "Local em breve"}</p>
          <p className="text-sm leading-7 text-[var(--moss)]">
            Longe da rotina, perto da presença de Deus — espaço para descanso, comunhão e silêncio.
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--azure)]"
          >
            Abrir no mapa
            <ArrowUpRight size={16} />
          </a>
        </div>
      );
    case "incluido":
      return (
        <ul className="space-y-3">
          {campContent.included.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-[var(--moss)]">
              <Check className="mt-0.5 shrink-0 text-[var(--amber)]" size={18} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );
    case "inscricao":
      return (
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--moss)]">
              {camp?.currentBatch?.name ?? "Próximo lote"}
            </p>
            <p className="mt-2 font-serif text-4xl text-[var(--pine)]">{price ?? "Em breve"}</p>
            <p className="mt-3 text-sm text-[var(--moss)]">
              {camp?.availableSpots
                ? `${camp.availableSpots} vagas disponíveis neste lote.`
                : "Consulte a disponibilidade com a liderança."}
            </p>
          </div>
          <Button size="lg" className="w-full" asChild>
            <Link href="/inscricao">
              Garantir meu lugar
              <ArrowUpRight size={18} />
            </Link>
          </Button>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-1">
          {campContent.faq.map((item) => (
            <details key={item.question} className="group border-b border-[color:var(--pine)/12%] py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--pine)]">
                {item.question}
                <ChevronDown size={16} className="shrink-0 text-[var(--amber)] transition-transform group-open:rotate-180" />
              </summary>
              <p className="pt-2 text-sm leading-6 text-[var(--moss)]">{item.answer}</p>
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}
