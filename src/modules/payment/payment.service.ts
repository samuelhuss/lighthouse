import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DuplicatePaymentError, PaymentAmountMismatchError, PaymentNotFoundError } from "@/lib/errors";
import { batchService } from "@/modules/batch/batch.service";
import type { MercadoPagoPayment } from "@/modules/mercadopago/mercadopago.types";
import { mapMercadoPagoPaymentStatus, mapRegistrationStatusFromPayment } from "@/modules/payment/payment-status";

export const paymentService = {
  async processMercadoPagoPayment(mpPayment: MercadoPagoPayment): Promise<void> {
    if (!mpPayment.externalReference) {
      throw new PaymentNotFoundError("Pagamento sem external_reference.");
    }

    const paymentRecord = await prisma.payment.findFirst({
      where: {
        provider: "MERCADO_PAGO",
        externalReference: mpPayment.externalReference,
      },
      include: { registration: true },
      orderBy: { createdAt: "desc" },
    });

    if (!paymentRecord) {
      throw new PaymentNotFoundError();
    }

    const duplicatePayment = await prisma.payment.findFirst({
      where: {
        provider: "MERCADO_PAGO",
        providerPaymentId: String(mpPayment.id),
        NOT: { id: paymentRecord.id },
      },
    });

    if (duplicatePayment) {
      throw new DuplicatePaymentError();
    }

    if (mpPayment.currencyId !== "BRL") {
      throw new PaymentAmountMismatchError("Moeda do pagamento não é BRL.");
    }

    const expectedAmount = paymentRecord.amountCents / 100;
    if (Number(mpPayment.transactionAmount) !== expectedAmount) {
      throw new PaymentAmountMismatchError();
    }

    if (mpPayment.externalReference !== paymentRecord.registration.registrationCode) {
      throw new PaymentAmountMismatchError("external_reference não bate com a inscrição.");
    }

    const paymentStatus = mapMercadoPagoPaymentStatus(mpPayment.status);
    const nextRegistrationStatus = mapRegistrationStatusFromPayment(paymentStatus);

    if (paymentRecord.registration.status === "PAID" && nextRegistrationStatus !== "REFUNDED") {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          providerPaymentId: String(mpPayment.id),
          status: paymentStatus,
          statusDetail: mpPayment.statusDetail,
          rawResponse: mpPayment.raw as Prisma.InputJsonValue,
        },
      });
      return;
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          providerPaymentId: String(mpPayment.id),
          status: paymentStatus,
          statusDetail: mpPayment.statusDetail,
          paymentMethod: mpPayment.paymentMethodId ?? paymentRecord.paymentMethod,
          paidAt: paymentStatus === "APPROVED" ? new Date() : paymentRecord.paidAt,
          rawResponse: mpPayment.raw as Prisma.InputJsonValue,
        },
      });

      if (nextRegistrationStatus) {
        await tx.registration.update({
          where: { id: paymentRecord.registrationId },
          data: {
            status: nextRegistrationStatus,
            paidAt: paymentStatus === "APPROVED" ? new Date() : paymentRecord.registration.paidAt,
          },
        });
      }

      if (
        paymentRecord.registration.batchId &&
        paymentRecord.registration.status === "PENDING_PAYMENT" &&
        (paymentStatus === "REJECTED" || paymentStatus === "CANCELLED")
      ) {
        await batchService.releaseSlot(tx, paymentRecord.registration.batchId);
      }
    });
  },
};