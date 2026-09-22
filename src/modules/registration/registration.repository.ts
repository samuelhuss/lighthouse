import { Prisma, Registration, RegistrationStatus, type Registration as RegistrationModel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Client = Prisma.TransactionClient | typeof prisma;

export const registrationRepository = {
  async create(client: Client, data: Prisma.RegistrationCreateInput): Promise<RegistrationModel> {
    return client.registration.create({ data });
  },

  async findByCode(code: string): Promise<RegistrationModel | null> {
    return prisma.registration.findUnique({ where: { registrationCode: code } });
  },

  async findById(id: string, client: Client = prisma): Promise<RegistrationModel | null> {
    return client.registration.findUnique({ where: { id } });
  },

  async findByIdWithPayments(id: string) {
    return prisma.registration.findUnique({
      where: { id },
      include: { payments: true, batch: true, camp: true },
    });
  },

  async updateStatus(
    client: Client,
    id: string,
    status: RegistrationStatus,
    extra: Prisma.RegistrationUpdateInput = {}
  ): Promise<Registration> {
    return client.registration.update({
      where: { id },
      data: { status, ...extra },
    });
  },

  async findExpiredPending(now: Date = new Date()): Promise<RegistrationModel[]> {
    return prisma.registration.findMany({
      where: {
        status: RegistrationStatus.PENDING_PAYMENT,
        paymentExpiresAt: { lt: now },
      },
    });
  },

  async findPendingForReconciliation(sinceHours = 48): Promise<RegistrationModel[]> {
    const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
    return prisma.registration.findMany({
      where: {
        status: { in: [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.PAYMENT_PROCESSING] },
        createdAt: { gte: since },
      },
      include: { payments: true },
    });
  },

  async list(params: {
    limit: number;
    offset: number;
    status?: RegistrationStatus;
    batchId?: string;
    search?: string;
  }) {
    const where: Prisma.RegistrationWhereInput = {
      ...(params.status ? { status: params.status } : {}),
      ...(params.batchId ? { batchId: params.batchId } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { email: { contains: params.search, mode: "insensitive" } },
              { registrationCode: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: params.offset,
        take: params.limit,
      }),
      prisma.registration.count({ where }),
    ]);

    return { items, total };
  },
};
