import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { MercadoPagoClient } from "@/modules/mercadopago/mercadopago.client";
import { paymentService } from "@/modules/payment/payment.service";

export interface ReconcilePaymentsResult {
  scanned: number;
  processed: number;
}

export async function reconcilePayments(client = new MercadoPagoClient()): Promise<ReconcilePaymentsResult> {
  const registrations = await prisma.registration.findMany({
    where: {
      status: { in: ["PENDING_PAYMENT", "PAYMENT_PROCESSING"] },
      payments: { some: { provider: "MERCADO_PAGO" } },
    },
    include: { payments: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  let processed = 0;

  for (const registration of registrations) {
    const payments = await client.searchPayments({ externalReference: registration.registrationCode });

    for (const payment of payments) {
      await paymentService.processMercadoPagoPayment(payment);
      processed += 1;
      logger.info({ registrationCode: registration.registrationCode, paymentId: payment.id }, "payment_reconciled");
    }
  }

  return { scanned: registrations.length, processed };
}