import { Resend } from "resend";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function paragraphHtml(value: string): string {
  return value.split(/\r?\n\s*\r?\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, "<br />")}</p>`).join("");
}

export function renderEmailLayout(input: { subject: string; preview: string; content: string }): string {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body style="margin:0;background:#faf6ec;color:#16223f;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(input.preview)}</div><main style="max-width:600px;margin:0 auto;padding:32px 16px"><div style="overflow:hidden;border:1px solid #f6e7bd;border-radius:16px;background:#fffdf6;box-shadow:0 16px 48px rgba(14,32,67,.12)"><header style="padding:28px 32px;background:#0e2043;color:#fff"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="padding-right:10px"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:#e8af2e"></span></td><td style="font-size:20px;font-weight:700;letter-spacing:-.3px;color:#fff">Lighthouse</td></tr></table></header><section style="padding:32px;color:#16223f"><div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#3462ac">${escapeHtml(input.subject)}</div><div style="margin-top:20px;font-size:16px;line-height:1.7;color:#4c5a80">${input.content}</div></section><footer style="border-top:1px solid #f6e7bd;padding:20px 32px;font-size:12px;line-height:1.5;color:#4c5a80">Você recebeu este email por causa da sua inscrição no Lighthouse.</footer></div></main></body></html>`;
}

export function renderCampaignEmail(input: { subject: string; message: string; name: string }): string {
  return renderEmailLayout({ subject: input.subject, preview: input.message, content: `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#223164">Olá, ${escapeHtml(input.name)}!</h1>${paragraphHtml(input.message)}<p style="margin-top:28px;font-size:13px;color:#4c5a80">Você recebeu esta mensagem porque autorizou comunicações sobre o Lighthouse.</p>` });
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
      html: renderEmailLayout({ subject: "Sua inscrição foi criada", preview: "Finalize o pagamento para garantir sua vaga.", content: `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#223164">Olá, ${escapeHtml(input.name)}!</h1><p>Sua inscrição foi criada com o código <strong>${escapeHtml(input.registrationCode)}</strong>.</p><p>Finalize o pagamento para garantir sua vaga:</p><p><a href="${escapeHtml(input.paymentUrl)}" style="display:inline-block;border-radius:8px;background:#e8af2e;padding:12px 18px;color:#0e2043;font-weight:700;text-decoration:none">Continuar para o pagamento</a></p>${input.paymentExpiresAt ? `<p>O pagamento fica disponível até ${input.paymentExpiresAt.toLocaleString("pt-BR")}.</p>` : ""}` }),
    });
  },

  async sendPaymentApproved(input: { paymentId: string; registrationId: string; name: string; email: string; registrationCode: string; amountCents: number }) {
    return send({
      recipient: input.email,
      registrationId: input.registrationId,
      type: "PAYMENT_APPROVED",
      idempotencyKey: `payment-approved:${input.paymentId}`,
      subject: "Pagamento confirmado",
      html: renderEmailLayout({ subject: "Pagamento confirmado", preview: "Sua inscrição está confirmada.", content: `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#223164">Pagamento confirmado</h1><p>Olá, ${escapeHtml(input.name)}. Recebemos seu pagamento de ${(input.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.</p><p>Sua inscrição <strong>${escapeHtml(input.registrationCode)}</strong> está confirmada.</p>` }),
    });
  },

  async sendCampaign(input: { subject: string; message: string }) {
    const recipients = await this.getCampaignAudience();
    const campaignKey = createHash("sha256").update(`${input.subject}\0${input.message}`).digest("hex").slice(0, 24);
    let sent = 0;
    let failed = 0;
    for (const recipient of recipients) {
      const result = await send({ recipient: recipient.email, registrationId: recipient.id, type: "CAMPAIGN", idempotencyKey: `campaign:${campaignKey}:${recipient.email}`, subject: input.subject, html: renderCampaignEmail({ subject: input.subject, message: input.message, name: recipient.name }) });
      if (result.sent) sent += 1; else if (!result.skipped) failed += 1;
    }
    return { audience: recipients.length, sent, failed, configured: configured() };
  },

  async getCampaignAudience() {
    const registrations = await prisma.registration.findMany({ where: { marketingConsentAt: { not: null } }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true } });
    const uniqueRecipients = new Map<string, (typeof registrations)[number]>();
    for (const registration of registrations) {
      const email = registration.email.trim().toLowerCase();
      if (email && !uniqueRecipients.has(email)) uniqueRecipients.set(email, registration);
    }
    return [...uniqueRecipients.entries()].map(([email, registration]) => ({ ...registration, email }));
  },
};
