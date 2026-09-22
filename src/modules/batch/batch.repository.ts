import { Prisma, type Batch } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Client = Prisma.TransactionClient | typeof prisma;

export const batchRepository = {
  async findCurrent(client: Client, campId: string): Promise<Batch | null> {
    const now = new Date();
    return client.batch.findFirst({
      where: {
        campId,
        active: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { startsAt: "desc" },
    });
  },

  async findById(client: Client, id: string): Promise<Batch | null> {
    return client.batch.findUnique({ where: { id } });
  },

  async listByCamp(client: Client, campId: string): Promise<Batch[]> {
    return client.batch.findMany({
      where: { campId },
      orderBy: { createdAt: "asc" },
    });
  },

  async create(client: Client, data: Prisma.BatchCreateInput): Promise<Batch> {
    return client.batch.create({ data });
  },

  async update(client: Client, id: string, data: Prisma.BatchUpdateInput): Promise<Batch> {
    return client.batch.update({ where: { id }, data });
  },

  /**
   * Atomically increments reservedCount only if there is still room, so
   * concurrent requests can never over-reserve a batch's capacity.
   * Returns the number of affected rows (1 = reserved, 0 = no slots left).
   */
  async tryReserveSlot(client: Client, batchId: string): Promise<number> {
    return client.$executeRaw`
      UPDATE "batches"
      SET "reservedCount" = "reservedCount" + 1,
          "updatedAt" = NOW()
      WHERE "id" = ${batchId}
        AND "reservedCount" < "capacity"
    `;
  },

  async releaseSlot(client: Client, batchId: string): Promise<number> {
    return client.$executeRaw`
      UPDATE "batches"
      SET "reservedCount" = GREATEST("reservedCount" - 1, 0),
          "updatedAt" = NOW()
      WHERE "id" = ${batchId}
    `;
  },
};
