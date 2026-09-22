import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorResponse, getRequestId } from "@/lib/http";
import { MercadoPagoClient } from "@/modules/mercadopago/mercadopago.client";
import { InvalidWebhookSignatureError, PaymentNotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { paymentService } from "@/modules/payment/payment.service";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const log = logger.child({ requestId });

  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody || "{}");

    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");
    const client = new MercadoPagoClient();

    client.validateWebhookSignature(xSignature, xRequestId, rawBody);

    const eventId = String(body?.data?.id ?? body?.id ?? "unknown");
    const eventType = body?.type ?? "unknown";

    const existing = await prisma.webhookEvent.findUnique({
      where: { provider_eventId: { provider: "MERCADO_PAGO", eventId } },
    });
    if (existing) {
      return NextResponse.json({ ok: true }, { status: 200, headers: { "x-request-id": requestId } });
    }

    const entry = await prisma.webhookEvent.create({
      data: {
        provider: "MERCADO_PAGO",
        eventId,
        eventType,
        payload: body as Prisma.InputJsonValue,
        processed: false,
      },
    });

    const paymentId = String(body?.data?.id ?? "");
    if (!paymentId) {
      throw new PaymentNotFoundError();
    }

    const mpPayment = await client.getPayment(paymentId);
    await paymentService.processMercadoPagoPayment(mpPayment);

    await prisma.webhookEvent.update({
      where: { id: entry.id },
      data: { processed: true, processedAt: new Date() },
    });

    log.info({ paymentId, status: mpPayment.status }, "payment_processed");

    return NextResponse.json({ ok: true }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return errorResponse(error, requestId);
    }
    return errorResponse(error, requestId);
  }
}
