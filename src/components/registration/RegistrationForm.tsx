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
  phone: z.string().min(10, "Digite seu WhatsApp."),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
  privacyConsent: z.literal(true, { error: "Aceite a política de privacidade para continuar." }),
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
          cpf: values.cpf ? onlyDigits(values.cpf) : undefined,
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
      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
        <label className="sm:col-span-2 text-xs font-semibold text-white">
          Nome Completo
          <input
            {...register("name")}
            className="minimal-input mt-1 h-10.5 w-full rounded-xl px-3.5 text-xs placeholder:text-white/50 font-medium"
            placeholder="Digite seu nome completo"
          />
          {errors.name && (
            <span className="mt-0.5 block text-[11px] font-normal text-red-300">
              {errors.name.message}
            </span>
          )}
        </label>

        <label className="text-xs font-semibold text-white">
          E-mail
          <input
            type="email"
            {...register("email")}
            className="minimal-input mt-1 h-10.5 w-full rounded-xl px-3.5 text-xs placeholder:text-white/50 font-medium"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <span className="mt-0.5 block text-[11px] font-normal text-red-300">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="text-xs font-semibold text-white">
          WhatsApp
          <input
            {...register("phone")}
            className="minimal-input mt-1 h-10.5 w-full rounded-xl px-3.5 text-xs placeholder:text-white/50 font-medium"
            placeholder="(00) 00000-0000"
          />
          {errors.phone && (
            <span className="mt-0.5 block text-[11px] font-normal text-red-300">
              {errors.phone.message}
            </span>
          )}
        </label>

        <label className="text-xs font-semibold text-white">
          CPF <span className="text-white/60 font-normal">(opcional)</span>
          <input
            {...register("cpf")}
            className="minimal-input mt-1 h-10.5 w-full rounded-xl px-3.5 text-xs placeholder:text-white/50 font-medium"
            placeholder="000.000.000-00"
          />
        </label>

        <label className="text-xs font-semibold text-white">
          Data de Nascimento
          <input
            type="date"
            {...register("birthDate")}
            className="minimal-input mt-1 h-10.5 w-full rounded-xl px-3.5 text-xs text-white font-medium"
          />
        </label>
      </div>

      {/* Aceites */}
      <div className="space-y-1.5 pt-2 border-t border-white/20">
        <label className="flex items-start gap-2 text-[11px] leading-relaxed text-white/90">
          <input
            type="checkbox"
            {...register("privacyConsent")}
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0"
          />
          <span>
            Concordo com o uso dos meus dados para realização da inscrição.
            {errors.privacyConsent && (
              <span className="block text-red-300 font-bold">
                {errors.privacyConsent.message}
              </span>
            )}
          </span>
        </label>
        <label className="flex items-start gap-2 text-[11px] leading-relaxed text-white/90">
          <input
            type="checkbox"
            {...register("marketingConsent")}
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0"
          />
          <span>Quero receber avisos importantes sobre o acampamento.</span>
        </label>
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/25 p-2.5 text-xs font-medium text-white"
        >
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-2xl bg-white text-xs sm:text-sm font-bold text-[#0e2043] shadow-lg transition hover:bg-[var(--gold)] hover:scale-[1.01] active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" /> Processando...
          </>
        ) : (
          <>
            Ir para o Pagamento Seguro <ArrowRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </form>
  );
}
