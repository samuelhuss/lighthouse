import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function paragraphHtml(value: string): string {
  return value.split(/\r?\n\s*\r?\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, "<br />")}</p>`).join("");
}

function configured() {
  const env = getEnv();
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

async function send(input: { recipient: string; type: string; idempotencyKey: string; subject: string; html: string; registrationId?: string }) {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    logger.warn({ type: input.type }, "email_not_configured");
    return { sent: false, skipped: true };
  }

  const existing = await prisma.emailLog.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing?.status === "SENT") return { sent: true, skipped: true, resendId: existing.resendId };

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: input.recipient,
      subject: input.subject,
      html: input.html,
      ...(env.EMAIL_REPLY_TO ? { replyTo: env.EMAIL_REPLY_TO } : {}),
    });
    if (result.error) throw new Error(result.error.message);

    await prisma.emailLog.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: { status: "SENT", resendId: result.data?.id ?? null, errorMessage: null },
      create: { recipient: input.recipient, type: input.type, idempotencyKey: input.idempotencyKey, resendId: result.data?.id ?? null, status: "SENT", registrationId: input.registrationId },
    });
    return { sent: true, skipped: false, resendId: result.data?.id };
  } catch (error) {
    await prisma.emailLog.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: { status: "FAILED", errorMessage: error instanceof Error ? error.message : "Unknown email error" },
      create: { recipient: input.recipient, type: input.type, idempotencyKey: input.idempotencyKey, status: "FAILED", errorMessage: error instanceof Error ? error.message : "Unknown email error", registrationId: input.registrationId },
    });
    logger.error({ err: error, type: input.type, recipient: input.recipient }, "email_send_failed");
    return { sent: false, skipped: false };
  }
}

export const emailService = {
  isConfigured: configured,

  async sendRegistrationCreated(input: { registrationId: string; name: string; email: string; registrationCode: string; paymentUrl: string; paymentExpiresAt: Date | null }) {
    return send({
      recipient: input.email,
      registrationId: input.registrationId,
      type: "REGISTRATION_CREATED",
      idempotencyKey: `registration-created:${input.registrationId}`,
      subject: "Sua inscrição foi criada",
      html: `<h1>Olá, ${escapeHtml(input.name)}!</h1><p>Sua inscrição foi criada com o código <strong>${escapeHtml(input.registrationCode)}</strong>.</p><p>Finalize o pagamento para garantir sua vaga:</p><p><a href="${escapeHtml(input.paymentUrl)}">Continuar para o pagamento</a></p>${input.paymentExpiresAt ? `<p>O pagamento fica disponível até ${input.paymentExpiresAt.toLocaleString("pt-BR")}.</p>` : ""}`,
    });
  },

  async sendPaymentApproved(input: { paymentId: string; registrationId: string; name: string; email: string; registrationCode: string; amountCents: number }) {
    return send({
      recipient: input.email,
      registrationId: input.registrationId,
      type: "PAYMENT_APPROVED",
      idempotencyKey: `payment-approved:${input.paymentId}`,
      subject: "Pagamento confirmado",
      html: `<h1>Pagamento confirmado</h1><p>Olá, ${escapeHtml(input.name)}. Recebemos seu pagamento de ${(input.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.</p><p>Sua inscrição <strong>${escapeHtml(input.registrationCode)}</strong> está confirmada.</p>`,
    });
  },

  async sendCampaign(input: { subject: string; message: string }) {
    const recipients = await prisma.registration.findMany({ where: { marketingConsentAt: { not: null } }, select: { id: true, name: true, email: true } });
    let sent = 0;
    let failed = 0;
    for (const recipient of recipients) {
      const result = await send({ recipient: recipient.email, registrationId: recipient.id, type: "CAMPAIGN", idempotencyKey: `campaign:${input.subject}:${recipient.id}`, subject: input.subject, html: `<h1>${escapeHtml(input.subject)}</h1><p>Olá, ${escapeHtml(recipient.name)}!</p>${paragraphHtml(input.message)}<p>Você recebeu esta mensagem porque autorizou comunicações sobre o acampamento.</p>` });
      if (result.sent) sent += 1; else if (!result.skipped) failed += 1;
    }
    return { audience: recipients.length, sent, failed, configured: configured() };
  },
};
