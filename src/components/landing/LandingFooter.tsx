import Link from "next/link";
import { LighthouseMark } from "@/components/brand/LighthouseMark";

export function LandingFooter() {
  return (
    <footer className="border-t border-[color:var(--amber)/25%] bg-[linear-gradient(180deg,var(--sand)_0%,var(--background)_100%)] px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="#top" className="inline-flex items-center gap-2 text-[var(--pine)] transition-opacity hover:opacity-80">
          <LighthouseMark size={20} withBeam />
          <span className="font-serif text-lg">Lighthouse</span>
        </Link>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--moss)]">
          Acampamento da igreja · Uma luz que guia para casa.
        </p>
      </div>
    </footer>
  );
}
