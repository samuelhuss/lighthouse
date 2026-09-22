import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registrationRepository } from "@/modules/registration/registration.repository";
import { batchService } from "@/modules/batch/batch.service";
import { logger } from "@/lib/logger";

export interface ExpireRegistrationsResult {
  scanned: number;
  expired: number;
}

export async function expireRegistrations(now = new Date()): Promise<ExpireRegistrationsResult> {
  const registrations = await registrationRepository.findExpiredPending(now);
  let expired = 0;

  for (const registration of registrations) {
    const didExpire = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.registration.updateMany({
        where: {
          id: registration.id,
          status: "PENDING_PAYMENT",
          paymentExpiresAt: { lt: now },
        },
        data: { status: "EXPIRED" },
      });

      if (updated.count !== 1) {
        return false;
      }

      if (registration.batchId) {
        await batchService.releaseSlot(tx, registration.batchId);
      }

      return true;
    });

    if (didExpire) {
      expired += 1;
      logger.info({ registrationCode: registration.registrationCode }, "registration_expired");
    }
  }

  return { scanned: registrations.length, expired };
}