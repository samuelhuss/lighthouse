import { Prisma, type Camp } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegistrationClosedError } from "@/lib/errors";

export const campRepository = {
  async findActive(): Promise<Camp | null> {
    return prisma.camp.findFirst({ where: { active: true }, orderBy: { createdAt: "desc" } });
  },

  async findById(id: string): Promise<Camp | null> {
    return prisma.camp.findUnique({ where: { id } });
  },

  async update(id: string, data: Prisma.CampUpdateInput): Promise<Camp> {
    return prisma.camp.update({ where: { id }, data });
  },
};

export const campService = {
  async getActiveCamp(): Promise<Camp> {
    const camp = await campRepository.findActive();
    if (!camp) {
      throw new RegistrationClosedError();
    }
    return camp;
  },

  async getPublicInfo() {
    const camp = await this.getActiveCamp();

    const currentBatch = await prisma.batch.findFirst({
      where: {
        campId: camp.id,
        active: true,
        startsAt: { lte: new Date() },
        endsAt: { gte: new Date() },
      },
      orderBy: { startsAt: "desc" },
    });

    const reservedTotal = await prisma.batch.aggregate({
      where: { campId: camp.id },
      _sum: { reservedCount: true },
    });

    const availableSpots = Math.max(
      camp.maxCapacity - (reservedTotal._sum.reservedCount ?? 0),
      0
    );

    return {
      name: camp.name,
      description: camp.description,
      location: camp.location,
      startDate: camp.startDate,
      endDate: camp.endDate,
      availableSpots,
      currentBatch: currentBatch
        ? {
            id: currentBatch.id,
            name: currentBatch.name,
            priceCents: currentBatch.priceCents,
          }
        : null,
    };
  },

  async update(id: string, data: Prisma.CampUpdateInput) {
    return campRepository.update(id, data);
  },
};
