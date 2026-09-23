import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { LighthouseMark } from "@/components/brand/LighthouseMark";
import Link from "next/link";

export default function RegistrationPage() {
  return <main className="min-h-screen bg-[var(--background)] px-6 py-12 lg:px-10"><div className="mx-auto max-w-6xl"><Link href="/" className="inline-flex items-center gap-2 font-serif text-xl font-semibold text-[var(--pine)]"><LighthouseMark size={26} /> Lighthouse</Link><div className="mt-16 grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-start"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[var(--azure)]">Sua inscrição</p><h1 className="mt-5 font-serif text-5xl leading-tight text-[var(--pine)]">Comece pelo seu nome.</h1><p className="mt-6 max-w-sm leading-7 text-[var(--moss)]">Preencha seus dados. No próximo passo, você será direcionado para o pagamento seguro.</p></div><RegistrationForm /></div></div></main>;
}