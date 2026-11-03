import { Prisma, type Batch } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BatchExpiredError, NoSlotsAvailableError, ValidationError } from "@/lib/errors";
import { batchRepository } from "@/modules/batch/batch.repository";

type Client = Prisma.TransactionClient | typeof prisma;

const MIN_INSTALLMENTS = 1;
const MAX_INSTALLMENTS = 12;

function assertValidInstallments(value: number) {
  if (!Number.isInteger(value) || value < MIN_INSTALLMENTS || value > MAX_INSTALLMENTS) {
    throw new ValidationError(`maxInstallments deve estar entre ${MIN_INSTALLMENTS} e ${MAX_INSTALLMENTS}.`);
  }
}

export const batchService = {
  /**
   * Determines the batch currently open for registrations. If more than one
   * qualifies, the one with the latest `startsAt` wins (deterministic rule).
   */
  async getCurrentBatch(campId: string, client: Client = prisma): Promise<Batch> {
    const batch = await batchRepository.findCurrent(client, campId);
    if (!batch) {
      throw new BatchExpiredError();
    }
    return batch;
  },

  async reserveSlot(client: Client, batchId: string): Promise<void> {
    const affected = await batchRepository.tryReserveSlot(client, batchId);
    if (affected !== 1) {
      throw new NoSlotsAvailableError();
    }
  },

  async releaseSlot(client: Client, batchId: string): Promise<void> {
    await batchRepository.releaseSlot(client, batchId);
  },

  async list(campId: string): Promise<Batch[]> {
    return batchRepository.listByCamp(prisma, campId);
  },

  async create(input: {
    campId: string;
    name: string;
    priceCents: number;
    capacity: number;
    maxInstallments?: number;
    startsAt?: Date;
    endsAt?: Date;
  }): Promise<Batch> {
    if (input.priceCents <= 0) {
      throw new ValidationError("priceCents deve ser maior que zero.");
    }
    if (input.capacity <= 0) {
      throw new ValidationError("capacity deve ser maior que zero.");
    }
    if (input.maxInstallments !== undefined) {
      assertValidInstallments(input.maxInstallments);
    }

    return batchRepository.create(prisma, {
      camp: { connect: { id: input.campId } },
      name: input.name,
      priceCents: input.priceCents,
      capacity: input.capacity,
      maxInstallments: input.maxInstallments,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    });
  },

  async update(
    id: string,
    input: Partial<{
      name: string;
      priceCents: number;
      capacity: number;
      maxInstallments: number;
      startsAt: Date;
      endsAt: Date;
      active: boolean;
    }>
  ): Promise<Batch> {
    if (input.maxInstallments !== undefined) {
      assertValidInstallments(input.maxInstallments);
    }

    return batchRepository.update(prisma, id, input);
  },
};
