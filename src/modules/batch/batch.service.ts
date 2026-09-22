import { Prisma, type Batch } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BatchExpiredError, NoSlotsAvailableError, ValidationError } from "@/lib/errors";
import { batchRepository } from "@/modules/batch/batch.repository";

type Client = Prisma.TransactionClient | typeof prisma;

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
    startsAt?: Date;
    endsAt?: Date;
  }): Promise<Batch> {
    if (input.priceCents <= 0) {
      throw new ValidationError("priceCents deve ser maior que zero.");
    }
    if (input.capacity <= 0) {
      throw new ValidationError("capacity deve ser maior que zero.");
    }

    return batchRepository.create(prisma, {
      camp: { connect: { id: input.campId } },
      name: input.name,
      priceCents: input.priceCents,
      capacity: input.capacity,
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
      startsAt: Date;
      endsAt: Date;
      active: boolean;
    }>
  ): Promise<Batch> {
    return batchRepository.update(prisma, id, input);
  },
};
