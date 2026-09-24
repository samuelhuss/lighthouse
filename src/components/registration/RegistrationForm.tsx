"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().trim().min(3, "Digite seu nome completo."),
  email: z.string().trim().email("Digite um e-mail válido."),
  phone: z.string().min(10, "Digite seu WhatsApp com DDD."),
  cpf: z.string().min(11, "Digite seu CPF completo."),
  birthDate: z.string().min(1, "Selecione sua data de nascimento."),
  privacyConsent: z.literal(true, { error: "Aceite os termos de privacidade para continuar." }),
  marketingConsent: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function RegistrationForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/v1/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          ...values,
          phone: onlyDigits(values.phone),
          cpf: onlyDigits(values.cpf),
        }),
      });
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error?.message ?? "Não foi possível criar sua inscrição.");
      window.location.assign(body.payment.paymentUrl);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir agora. Tente novamente."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex flex-col gap-2.5">
        {/* Nome Completo */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-white/90 uppercase mb-1">
            Nome Completo <span className="text-[var(--gold)]">*</span>
          </label>
          <input
            {...register("name")}
            className="w-full h-10.5 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-[var(--gold)] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
            placeholder="Digite seu nome completo"
          />
          {errors.name && (
            <span className="mt-0.5 block text-[11px] font-semibold text-rose-300">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* E-mail & WhatsApp */}
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold tracking-wider text-white/90 uppercase mb-1">
              E-mail <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full h-10.5 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-[var(--gold)] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <span className="mt-0.5 block text-[11px] font-semibold text-rose-300">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-white/90 uppercase mb-1">
              WhatsApp <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              {...register("phone")}
              className="w-full h-10.5 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-[var(--gold)] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
              placeholder="(00) 90000-0000"
            />
            {errors.phone && (
              <span className="mt-0.5 block text-[11px] font-semibold text-rose-300">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* CPF & Data de Nascimento */}
        <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold tracking-wider text-white/90 uppercase mb-1">
              CPF <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              {...register("cpf")}
              className="w-full h-10.5 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-[var(--gold)] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <span className="mt-0.5 block text-[11px] font-semibold text-rose-300">
                {errors.cpf.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-white/90 uppercase mb-1">
              Data de Nascimento <span className="text-[var(--gold)]">*</span>
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full h-10.5 rounded-xl border border-white/25 bg-white/10 px-3.5 text-xs font-medium text-white backdrop-blur-md transition-all focus:border-[var(--gold)] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
            />
            {errors.birthDate && (
              <span className="mt-0.5 block text-[11px] font-semibold text-rose-300">
                {errors.birthDate.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Consentimento */}
      <div className="space-y-1.5 pt-2 border-t border-white/15">
        <label className="flex items-start gap-2 cursor-pointer text-[11px] leading-relaxed text-white/90">
          <input
            type="checkbox"
            {...register("privacyConsent")}
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0 cursor-pointer"
          />
          <span>
            Concordo com os termos de inscrição. <span className="text-[var(--gold)]">*</span>
            {errors.privacyConsent && (
              <span className="block text-rose-300 font-semibold mt-0.5">
                {errors.privacyConsent.message}
              </span>
            )}
          </span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer text-[11px] leading-relaxed text-white/90">
          <input
            type="checkbox"
            {...register("marketingConsent")}
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0 cursor-pointer"
          />
          <span>Desejo receber avisos sobre o acampamento no WhatsApp.</span>
        </label>
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-400/40 bg-rose-500/20 p-2 text-xs font-semibold text-rose-200"
        >
          {submitError}
        </div>
      )}

      {/* Botão de Envio */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-white via-amber-50 to-[var(--gold)] text-xs sm:text-sm font-extrabold text-[#0e2043] shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#0e2043]" /> Processando...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>Ir para o Pagamento</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
