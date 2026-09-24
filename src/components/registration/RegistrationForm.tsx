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
  cpf: z.string().min(11, "Digite seu CPF completo."),
  birthDate: z.string().min(1, "Selecione sua data de nascimento."),
  
  address: z.string().min(3, "Digite seu endereço."),
  zipCode: z.string().min(8, "Digite seu CEP."),
  
  phone: z.string().min(10, "Digite seu número."),
  gender: z.string().min(1, "Selecione o sexo."),

  guardianOneName: z.string().optional(),
  guardianOnePhone: z.string().optional(),
  guardianTwoName: z.string().optional(),
  guardianTwoPhone: z.string().optional(),
  
  medications: z.string().optional(),
  allergies: z.string().optional(),
  dietaryRestrictions: z.string().optional(),

  agreedToTerms: z.literal(true, { error: "Aceite os termos para continuar." }),
  agreedToImageRights: z.literal(true, { error: "Aceite para continuar." }),
  agreedToNoRefund: z.literal(true, { error: "Aceite para continuar." }),
  marketingConsent: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

const STEPS = [
  { id: 1, title: "Dados Pessoais", fields: ["name", "email", "cpf", "birthDate", "phone", "gender"] as const },
  { id: 2, title: "Endereço & Responsáveis", fields: ["address", "zipCode", "guardianOneName", "guardianOnePhone", "guardianTwoName", "guardianTwoPhone"] as const },
  { id: 3, title: "Saúde & Alimentação", fields: ["medications", "allergies", "dietaryRestrictions"] as const },
  { id: 4, title: "Termos & Finalização", fields: ["agreedToTerms", "agreedToNoRefund", "agreedToImageRights", "marketingConsent"] as const },
];

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ 
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  async function nextStep() {
    const fieldsToValidate = STEPS.find(s => s.id === currentStep)?.fields;
    if (fieldsToValidate) {
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      }
    }
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

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
          zipCode: onlyDigits(values.zipCode),
          guardianOnePhone: values.guardianOnePhone ? onlyDigits(values.guardianOnePhone) : undefined,
          guardianTwoPhone: values.guardianTwoPhone ? onlyDigits(values.guardianTwoPhone) : undefined,
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

  const inputClass = "w-full h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-xs font-medium text-white placeholder:text-white/40 transition-all focus:border-[var(--gold)] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/30";
  const labelClass = "block text-[11px] font-bold tracking-wide text-white/90 mb-1.5";
  const errorClass = "mt-1 block text-[10px] font-semibold text-rose-400";

  return (
    <div className="w-full">
      {/* Indicador de Passos */}
      <div className="mb-8 flex flex-col items-center">
        <div className="text-center mb-4">
          <span className="inline-block rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-[9px] font-bold text-[var(--gold)] tracking-widest uppercase mb-2">
            Passo {currentStep} de {STEPS.length}
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            {STEPS.find(s => s.id === currentStep)?.title}
          </h3>
        </div>
        <div className="h-2 w-full max-w-sm bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--gold)] to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative min-h-[350px]">
        
        {/* ETAPA 1: Dados Pessoais */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Nome completo</label>
                <input {...register("name")} className={inputClass} placeholder="Jane Smith" />
                {errors.name && <span className={errorClass}>{errors.name.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" {...register("email")} className={inputClass} placeholder="jane@framer.com" />
                {errors.email && <span className={errorClass}>{errors.email.message}</span>}
              </div>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>CPF</label>
                <input {...register("cpf")} className={inputClass} placeholder="000.000.000-00" />
                {errors.cpf && <span className={errorClass}>{errors.cpf.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Data de nascimento</label>
                <input type="date" {...register("birthDate")} className={inputClass} />
                {errors.birthDate && <span className={errorClass}>{errors.birthDate.message}</span>}
              </div>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Telefone / WhatsApp</label>
                <input {...register("phone")} className={inputClass} placeholder="(00) 90000-0000" />
                {errors.phone && <span className={errorClass}>{errors.phone.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Sexo</label>
                <select {...register("gender")} className={`${inputClass} appearance-none`}>
                  <option value="" className="text-black">Selecione</option>
                  <option value="MASCULINO" className="text-black">Masculino</option>
                  <option value="FEMININO" className="text-black">Feminino</option>
                </select>
                {errors.gender && <span className={errorClass}>{errors.gender.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 2: Endereço & Responsáveis */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Endereço Completo</label>
                <input {...register("address")} className={inputClass} placeholder="Rua Exemplo, 123" />
                {errors.address && <span className={errorClass}>{errors.address.message}</span>}
              </div>
              <div>
                <label className={labelClass}>CEP</label>
                <input {...register("zipCode")} className={inputClass} placeholder="00000-000" />
                {errors.zipCode && <span className={errorClass}>{errors.zipCode.message}</span>}
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-xs text-white/50 mb-3 block">Apenas para menores de 18 anos:</span>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Nome do Responsável 1</label>
                  <input {...register("guardianOneName")} className={inputClass} placeholder="Nome do Pai/Mãe" />
                </div>
                <div>
                  <label className={labelClass}>Contato do Responsável 1</label>
                  <input {...register("guardianOnePhone")} className={inputClass} placeholder="(00) 90000-0000" />
                </div>
              </div>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Nome do Responsável 2</label>
                <input {...register("guardianTwoName")} className={inputClass} placeholder="Nome do Pai/Mãe (Opcional)" />
              </div>
              <div>
                <label className={labelClass}>Contato do Responsável 2</label>
                <input {...register("guardianTwoPhone")} className={inputClass} placeholder="(00) 90000-0000" />
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 3: Saúde */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Toma medicamentos? Se sim, quais?</label>
                <input {...register("medications")} className={inputClass} placeholder="Ex: Ritalina, Insulina..." />
              </div>
              <div>
                <label className={labelClass}>Tem alergias? Se sim, quais?</label>
                <input {...register("allergies")} className={inputClass} placeholder="Ex: Pelo de gato, Dipirona..." />
              </div>
            </div>
            <div>
              <label className={labelClass}>Tem restrições alimentares?</label>
              <input {...register("dietaryRestrictions")} className={inputClass} placeholder="Ex: Intolerante a lactose, Vegetariano..." />
            </div>
          </div>
        )}

        {/* ETAPA 4: Termos e Pagamento */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
              
              <label className="flex items-start gap-3 cursor-pointer text-xs text-white/80">
                <input type="checkbox" {...register("agreedToTerms")} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0" />
                <div>
                  <span className="font-semibold text-white">Regras e Termos</span>
                  <p className="text-[11px] text-white/50 mt-0.5">Li e concordo com os termos e manual de regras do acampamento.</p>
                  {errors.agreedToTerms && <span className="block text-rose-400 font-semibold mt-1">{errors.agreedToTerms.message}</span>}
                </div>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer text-xs text-white/80">
                <input type="checkbox" {...register("agreedToNoRefund")} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0" />
                <div>
                  <span className="font-semibold text-white">Política de Estorno</span>
                  <p className="text-[11px] text-white/50 mt-0.5">Li e concordo que não será possível o estorno do valor em caso de desistência.</p>
                  {errors.agreedToNoRefund && <span className="block text-rose-400 font-semibold mt-1">{errors.agreedToNoRefund.message}</span>}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-white/80">
                <input type="checkbox" {...register("agreedToImageRights")} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0" />
                <div>
                  <span className="font-semibold text-white">Direitos de Imagem</span>
                  <p className="text-[11px] text-white/50 mt-0.5">Li e concordo com os termos de direito de uso de imagem durante o evento.</p>
                  {errors.agreedToImageRights && <span className="block text-rose-400 font-semibold mt-1">{errors.agreedToImageRights.message}</span>}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs text-white/80 pt-2 border-t border-white/10">
                <input type="checkbox" {...register("marketingConsent")} className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/20 accent-[var(--gold)] shrink-0" />
                <div>
                  <span className="font-semibold text-white">Comunicação (Opcional)</span>
                  <p className="text-[11px] text-white/50 mt-0.5">Desejo receber avisos e novidades sobre o acampamento no WhatsApp ou E-mail.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {submitError && (
          <div role="alert" className="rounded-lg border border-rose-400/40 bg-rose-500/20 p-3 text-xs font-semibold text-rose-200">
            {submitError}
          </div>
        )}

        {/* Navegação entre Etapas */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="h-10 rounded-lg border-white/20 bg-transparent text-white hover:bg-white/10 cursor-pointer"
            >
              Voltar
            </Button>
          ) : (
            <div /> // Spacer
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="h-10 rounded-lg bg-white text-black font-bold hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              Próxima Etapa <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[var(--gold)] text-[#0e2043] font-extrabold shadow-lg transition-all hover:brightness-110 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Finalizando...
                </span>
              ) : (
                "Finalizar Inscrição"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
