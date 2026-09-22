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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const response = await fetch("/api/v1/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ ...values, phone: onlyDigits(values.phone), cpf: values.cpf ? onlyDigits(values.cpf) : undefined }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message ?? "Não foi possível criar sua inscrição.");
      window.location.assign(body.payment.paymentUrl);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível concluir agora. Tente novamente.");
    }
  }

  const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[color:var(--pine)/18%] bg-white/60 px-4 text-[var(--pine)] outline-none transition focus:border-[var(--clay)] focus:ring-2 focus:ring-[color:var(--clay)/20%]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-[color:var(--pine)/10%] bg-[var(--paper)] p-6 shadow-[0_20px_70px_rgba(35,58,47,.08)] sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-semibold text-[var(--pine)]">Nome completo
          <input {...register("name")} className={fieldClass} placeholder="Como podemos chamar você?" />
          {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name.message}</span>}
        </label>
        <label className="text-sm font-semibold text-[var(--pine)]">E-mail
          <input type="email" {...register("email")} className={fieldClass} placeholder="voce@email.com" />
          {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email.message}</span>}
        </label>
        <label className="text-sm font-semibold text-[var(--pine)]">WhatsApp
          <input {...register("phone")} className={fieldClass} placeholder="(00) 00000-0000" />
          {errors.phone && <span className="mt-1 block text-xs text-red-700">{errors.phone.message}</span>}
        </label>
        <label className="text-sm font-semibold text-[var(--pine)]">CPF <span className="font-normal text-[var(--moss)]">(opcional)</span>
          <input {...register("cpf")} className={fieldClass} placeholder="000.000.000-00" />
        </label>
        <label className="text-sm font-semibold text-[var(--pine)]">Data de nascimento
          <input type="date" {...register("birthDate")} className={fieldClass} />
        </label>
      </div>
      <label className="mt-7 flex items-start gap-3 text-sm leading-6 text-[var(--moss)]">
        <input type="checkbox" {...register("privacyConsent")} className="mt-1 accent-[var(--clay)]" />
        <span>Concordo com o uso dos meus dados para realizar a inscrição.{errors.privacyConsent && <span className="block text-xs text-red-700">{errors.privacyConsent.message}</span>}</span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm leading-6 text-[var(--moss)]">
        <input type="checkbox" {...register("marketingConsent")} className="mt-1 accent-[var(--clay)]" />
        <span>Quero receber novidades e informações importantes sobre o acampamento.</span>
      </label>
      {submitError && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{submitError}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-8 w-full">
        {isSubmitting ? <><LoaderCircle className="animate-spin" size={18} /> Enviando...</> : <>Continuar para o pagamento <ArrowRight size={18} /></>}
      </Button>
    </form>
  );
}
