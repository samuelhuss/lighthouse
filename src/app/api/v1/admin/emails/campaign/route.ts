import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, getRequestId, parseJsonBody } from "@/lib/http";
import { emailService } from "@/modules/email/email.service";
import { renderCampaignEmail } from "@/modules/email/email.service";

const campaignSchema = z.object({
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(10000),
  confirmation: z.literal("ENVIAR"),
});

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  try {
    await requireAdmin(request);
    const url = new URL(request.url);
    const subject = url.searchParams.get("subject")?.trim() || "O acampamento está chegando";
    const message = url.searchParams.get("message")?.trim() || "Aqui aparecerá uma prévia da mensagem da campanha.";
    const audience = await emailService.getCampaignAudience();
    return NextResponse.json({ from: process.env.EMAIL_FROM || "Remetente não configurado", audience: { total: audience.length, recipients: audience.slice(0, 20).map(({ name, email }) => ({ name, email })) }, previewHtml: renderCampaignEmail({ subject, message, name: audience[0]?.name || "Participante" }) }, { status: 200, headers: { "x-request-id": requestId, "cache-control": "no-store" } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  try {
    await requireAdmin(request);
    if (!emailService.isConfigured()) {
      return NextResponse.json({ error: { code: "EMAIL_NOT_CONFIGURED", message: "Configure RESEND_API_KEY e EMAIL_FROM antes de enviar campanhas." } }, { status: 503 });
    }
    const body = await parseJsonBody(request, campaignSchema);
    const result = await emailService.sendCampaign({ subject: body.subject, message: body.message });
    return NextResponse.json(result, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
