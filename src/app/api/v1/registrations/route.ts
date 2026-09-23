import { NextResponse } from "next/server";
import { createRegistrationSchema } from "@/modules/registration/registration.schema";
import { parseJsonBody, errorResponse, getRequestId } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { campService } from "@/modules/camp/camp.service";
import { batchService } from "@/modules/batch/batch.service";
import { generateRegistrationCode } from "@/utils/registration-code";
import { getEnv } from "@/lib/env";
import { findIdempotentResponse, saveIdempotentResponse } from "@/utils/idempotency";
import { MercadoPagoClient } from "@/modules/mercadopago/mercadopago.client";
import { NoSlotsAvailableError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const log = logger.child({ requestId });

  try {
    const body = await parseJsonBody(request, createRegistrationSchema);
    const idempotencyKeyHeader = request.headers.get("idempotency-key");
    const key = idempotencyKeyHeader ?? `${requestId}`;
    const endpoint = "/api/v1/registrations";

    if (idempotencyKeyHeader) {
      const cached = await findIdempotentResponse(key, endpoint);
      if (cached?.response) {
        return NextResponse.json(cached.response, {
          status: Number(cached.statusCode ?? 200),
          headers: { "x-request-id": requestId },
        });
      }
    }

    const camp = await campService.getActiveCamp();
    const batch = await batchService.getCurrentBatch(camp.id);

    const registrationCode = generateRegistrationCode();
    const paymentExpirationMinutes = getEnv().REGISTRATION_PAYMENT_EXPIRATION_MINUTES;

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const reserved = await batchService.reserveSlot(tx, batch.id);
      void reserved;

      const registration = await tx.registration.create({
        data: {
          campId: camp.id,
          batchId: batch.id,
          registrationCode,
          name: body.name,
          email: body.email,
          phone: body.phone,
          cpf: body.cpf ?? null,
          birthDate: body.birthDate ? new Date(`${body.birthDate}T00:00:00Z`) : null,
          status: "PENDING_PAYMENT",
          amountCents: batch.priceCents,
          paymentExpiresAt: new Date(Date.now() + paymentExpirationMinutes * 60 * 1000),
          privacyConsentAt: new Date(),
          marketingConsentAt: body.marketingConsent ? new Date() : null,
        },
      });

      const client = new MercadoPagoClient();
      const preference = await client.createPreference({
        externalReference: registration.registrationCode,
        items: [{
          id: registration.registrationCode,
          title: camp.name,
          quantity: 1,
          unitPrice: batch.priceCents / 100,
          currencyId: "BRL",
        }],
        payer: { name: registration.name, email: registration.email },
        backUrls: {
          success: `${getEnv().NEXT_PUBLIC_APP_URL}/pagamento/sucesso?code=${encodeURIComponent(registrationCode)}`,
          failure: `${getEnv().NEXT_PUBLIC_APP_URL}/pagamento/erro?code=${encodeURIComponent(registrationCode)}`,
          pending: `${getEnv().NEXT_PUBLIC_APP_URL}/pagamento/pendente?code=${encodeURIComponent(registrationCode)}`,
        },
      });

      const payment = await tx.payment.create({
        data: {
          registrationId: registration.id,
          provider: "MERCADO_PAGO",
          providerPreferenceId: preference.preferenceId,
          checkoutUrl: preference.initPoint,
          externalReference: registration.registrationCode,
          amountCents: registration.amountCents,
          status: "PENDING",
          paymentMethod: "checkout_pro",
        },
      });

      return {
        registration: {
          id: registration.id,
          code: registration.registrationCode,
          status: registration.status,
          paymentExpiresAt: registration.paymentExpiresAt,
        },
        payment: {
          id: payment.id,
          status: payment.status,
          paymentUrl: preference.initPoint,
        },
      };
    });

    const response = {
      registration: result.registration,
      payment: {
        status: result.payment.status,
        paymentUrl: result.payment.paymentUrl,
      },
    };

    await saveIdempotentResponse(key, endpoint, 201, response);

    log.info({ registrationCode: result.registration.code }, "registration_created");

    try {
      const { emailService } = await import("@/modules/email/email.service");
      await emailService.sendRegistrationCreated({
        registrationId: result.registration.id,
        name: body.name,
        email: body.email,
        registrationCode: result.registration.code,
        paymentUrl: result.payment.paymentUrl,
        paymentExpiresAt: result.registration.paymentExpiresAt,
      });
    } catch (emailError) {
      log.error({ err: emailError }, "registration_email_failed");
    }

    return NextResponse.json(response, {
      status: 201,
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    if (error instanceof NoSlotsAvailableError) {
      log.warn({ requestId }, "no_slots_available");
    }
    return errorResponse(error, requestId);
  }
}
