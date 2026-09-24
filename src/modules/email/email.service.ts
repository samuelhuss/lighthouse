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
  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#ffffff;color:#111827;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden">${escapeHtml(input.preview)}</div>
  <main style="max-width:540px;margin:0 auto;padding:40px 20px;">
    
    <!-- Header -->
    <header style="padding-bottom:32px;border-bottom:1px solid #f3f4f6;">
      <span style="font-size:18px;font-weight:800;color:#0e2043;letter-spacing:-0.5px;">
        LIGHTHOUSE '27
      </span>
    </header>

    <!-- Main Content -->
    <section style="padding:40px 0;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#e8af2e;margin-bottom:20px;">
        ${escapeHtml(input.subject)}
      </div>
      <div style="font-size:16px;line-height:1.6;color:#4b5563;">
        ${input.content}
      </div>
    </section>

    <!-- Footer -->
    <footer style="padding-top:32px;border-top:1px solid #f3f4f6;font-size:13px;line-height:1.6;color:#9ca3af;">
      © 2027 Lighthouse.<br/>
      <span style="font-size:11px;color:#d1d5db;">Mensagem enviada referente à sua inscrição.</span>
    </footer>

  </main>
</body>
</html>`;
}

export function renderCampaignEmail(input: { subject: string; message: string; name: string }): string {
  return renderEmailLayout({
    subject: input.subject,
    preview: input.message,
    content: `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;font-weight:800;color:#0e2043;">Olá, ${escapeHtml(input.name)}!</h1>${paragraphHtml(input.message)}<p style="margin-top:24px;font-size:12px;color:rgba(22,34,63,0.5);">Você recebeu esta mensagem porque autorizou comunicações sobre o Lighthouse.</p>`,
  });
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
      html: renderEmailLayout({ subject: "Pagamento confirmado", preview: "Sua inscrição está confirmada.", content: `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#223164">Pagamento confirmado</h1><p>Olá, ${escapeHtml(input.name)}. Recebemos seu pagamento de ${(input.amountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}.</p><p>Sua inscrição <strong>${escapeHtml(input.registrationCode)}</strong> está confirmada.</p><p>Para ver seu QR Code de acesso (Ingresso Oficial), clique no link abaixo:</p><p><a href="${getEnv().NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pagamento/sucesso?code=${escapeHtml(input.registrationCode)}" style="display:inline-block;border-radius:8px;background:#e8af2e;padding:12px 18px;color:#0e2043;font-weight:700;text-decoration:none;margin-top:8px;">Ver Meu Ingresso Oficial</a></p>` }),
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
