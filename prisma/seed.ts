import "dotenv/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * dayMs);
}

async function upsertBatch(input: {
  campId: string;
  name: string;
  priceCents: number;
  capacity: number;
  reservedCount: number;
  startsAt: Date;
  endsAt: Date;
  active: boolean;
}) {
  const existing = await prisma.batch.findFirst({
    where: { campId: input.campId, name: input.name },
  });

  if (existing) {
    return prisma.batch.update({
      where: { id: existing.id },
      data: {
        priceCents: input.priceCents,
        capacity: input.capacity,
        reservedCount: input.reservedCount,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        active: input.active,
      },
    });
  }

  return prisma.batch.create({ data: input });
}

async function upsertSeedRegistration(input: {
  campId: string;
  batchId: string;
  registrationCode: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: Date;
  status: "PENDING_PAYMENT" | "PAYMENT_PROCESSING" | "PAID" | "PAYMENT_FAILED" | "CANCELLED" | "EXPIRED" | "REFUNDED";
  amountCents: number;
  paymentExpiresAt: Date | null;
  paidAt: Date | null;
  payment: {
    providerPreferenceId: string;
    providerPaymentId: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REFUNDED";
    statusDetail: string | null;
    paymentMethod: string | null;
    paidAt: Date | null;
    rawResponse: Prisma.InputJsonValue;
  };
}) {
  const registration = await prisma.registration.upsert({
    where: { registrationCode: input.registrationCode },
    update: {
      campId: input.campId,
      batchId: input.batchId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      cpf: input.cpf,
      birthDate: input.birthDate,
      status: input.status,
      amountCents: input.amountCents,
      paymentExpiresAt: input.paymentExpiresAt,
      paidAt: input.paidAt,
      privacyConsentAt: addDays(now, -2),
    },
    create: {
      campId: input.campId,
      batchId: input.batchId,
      registrationCode: input.registrationCode,
      name: input.name,
      email: input.email,
      phone: input.phone,
      cpf: input.cpf,
      birthDate: input.birthDate,
      status: input.status,
      amountCents: input.amountCents,
      paymentExpiresAt: input.paymentExpiresAt,
      paidAt: input.paidAt,
      privacyConsentAt: addDays(now, -2),
    },
  });

  await prisma.payment.deleteMany({ where: { registrationId: registration.id } });
  await prisma.payment.create({
    data: {
      registrationId: registration.id,
      provider: "MERCADO_PAGO",
      providerPreferenceId: input.payment.providerPreferenceId,
      providerPaymentId: input.payment.providerPaymentId,
      externalReference: input.registrationCode,
      amountCents: input.amountCents,
      status: input.payment.status,
      statusDetail: input.payment.statusDetail,
      paymentMethod: input.payment.paymentMethod,
      paidAt: input.payment.paidAt,
      rawResponse: input.payment.rawResponse,
    },
  });

  return registration;
}

async function main() {
  const camp = await prisma.camp.upsert({
    where: { id: "00000000-0000-4000-8000-000000000001" },
    update: {
      name: "Acampamento Lighthouse 2026",
      description: "Acampamento com inscricoes, pagamento online e painel administrativo.",
      location: "Sao Paulo, SP",
      startDate: new Date("2026-11-20T12:00:00.000Z"),
      endDate: new Date("2026-11-22T18:00:00.000Z"),
      maxCapacity: 120,
      active: true,
    },
    create: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Acampamento Lighthouse 2026",
      description: "Acampamento com inscricoes, pagamento online e painel administrativo.",
      location: "Sao Paulo, SP",
      startDate: new Date("2026-11-20T12:00:00.000Z"),
      endDate: new Date("2026-11-22T18:00:00.000Z"),
      maxCapacity: 120,
      active: true,
    },
  });

  const earlyBatch = await upsertBatch({
    campId: camp.id,
    name: "1o Lote",
    priceCents: 23000,
    capacity: 60,
    reservedCount: 3,
    startsAt: addDays(now, -7),
    endsAt: addDays(now, 14),
    active: true,
  });

  await upsertBatch({
    campId: camp.id,
    name: "2o Lote",
    priceCents: 26000,
    capacity: 40,
    reservedCount: 0,
    startsAt: addDays(now, 15),
    endsAt: addDays(now, 30),
    active: true,
  });

  await upsertBatch({
    campId: camp.id,
    name: "Lote encerrado",
    priceCents: 20000,
    capacity: 20,
    reservedCount: 0,
    startsAt: addDays(now, -30),
    endsAt: addDays(now, -8),
    active: false,
  });

  const seedRegistrations = await Promise.all([
    upsertSeedRegistration({
      campId: camp.id,
      batchId: earlyBatch.id,
      registrationCode: "REG-SEED01",
      name: "Ana Pago",
      email: "ana.pago@example.com",
      phone: "11988887777",
      cpf: "11122233344",
      birthDate: new Date("2001-03-10T00:00:00.000Z"),
      status: "PAID",
      amountCents: earlyBatch.priceCents,
      paymentExpiresAt: addDays(now, 1),
      paidAt: addDays(now, -1),
      payment: {
        providerPreferenceId: "seed-pref-paid-001",
        providerPaymentId: "seed-payment-approved-001",
        status: "APPROVED",
        statusDetail: "accredited",
        paymentMethod: "credit_card",
        paidAt: addDays(now, -1),
        rawResponse: {
          id: "seed-payment-approved-001",
          status: "approved",
          external_reference: "REG-SEED01",
          transaction_amount: earlyBatch.priceCents / 100,
          currency_id: "BRL",
        },
      },
    }),
    upsertSeedRegistration({
      campId: camp.id,
      batchId: earlyBatch.id,
      registrationCode: "REG-SEED02",
      name: "Bruno Pendente",
      email: "bruno.pendente@example.com",
      phone: "11977776666",
      cpf: "22233344455",
      birthDate: new Date("1999-07-22T00:00:00.000Z"),
      status: "PENDING_PAYMENT",
      amountCents: earlyBatch.priceCents,
      paymentExpiresAt: addDays(now, 1),
      paidAt: null,
      payment: {
        providerPreferenceId: "seed-pref-pending-002",
        providerPaymentId: null,
        status: "PENDING",
        statusDetail: null,
        paymentMethod: "checkout_pro",
        paidAt: null,
        rawResponse: {
          status: "pending",
          external_reference: "REG-SEED02",
          transaction_amount: earlyBatch.priceCents / 100,
          currency_id: "BRL",
        },
      },
    }),
    upsertSeedRegistration({
      campId: camp.id,
      batchId: earlyBatch.id,
      registrationCode: "REG-SEED03",
      name: "Carla Processando",
      email: "carla.processando@example.com",
      phone: "11966665555",
      cpf: "33344455566",
      birthDate: new Date("2000-11-05T00:00:00.000Z"),
      status: "PAYMENT_PROCESSING",
      amountCents: earlyBatch.priceCents,
      paymentExpiresAt: addDays(now, 1),
      paidAt: null,
      payment: {
        providerPreferenceId: "seed-pref-processing-003",
        providerPaymentId: "seed-payment-processing-003",
        status: "PENDING",
        statusDetail: "pending_contingency",
        paymentMethod: "pix",
        paidAt: null,
        rawResponse: {
          id: "seed-payment-processing-003",
          status: "in_process",
          external_reference: "REG-SEED03",
          transaction_amount: earlyBatch.priceCents / 100,
          currency_id: "BRL",
        },
      },
    }),
    upsertSeedRegistration({
      campId: camp.id,
      batchId: earlyBatch.id,
      registrationCode: "REG-SEED04",
      name: "Diego Recusado",
      email: "diego.recusado@example.com",
      phone: "11955554444",
      cpf: "44455566677",
      birthDate: new Date("1998-01-18T00:00:00.000Z"),
      status: "PAYMENT_FAILED",
      amountCents: earlyBatch.priceCents,
      paymentExpiresAt: addDays(now, -1),
      paidAt: null,
      payment: {
        providerPreferenceId: "seed-pref-rejected-004",
        providerPaymentId: "seed-payment-rejected-004",
        status: "REJECTED",
        statusDetail: "cc_rejected_other_reason",
        paymentMethod: "credit_card",
        paidAt: null,
        rawResponse: {
          id: "seed-payment-rejected-004",
          status: "rejected",
          external_reference: "REG-SEED04",
          transaction_amount: earlyBatch.priceCents / 100,
          currency_id: "BRL",
        },
      },
    }),
    upsertSeedRegistration({
      campId: camp.id,
      batchId: earlyBatch.id,
      registrationCode: "REG-SEED05",
      name: "Elisa Expirada",
      email: "elisa.expirada@example.com",
      phone: "11944443333",
      cpf: "55566677788",
      birthDate: new Date("2002-09-14T00:00:00.000Z"),
      status: "EXPIRED",
      amountCents: earlyBatch.priceCents,
      paymentExpiresAt: addDays(now, -1),
      paidAt: null,
      payment: {
        providerPreferenceId: "seed-pref-expired-005",
        providerPaymentId: null,
        status: "PENDING",
        statusDetail: null,
        paymentMethod: "checkout_pro",
        paidAt: null,
        rawResponse: {
          status: "pending",
          external_reference: "REG-SEED05",
          transaction_amount: earlyBatch.priceCents / 100,
          currency_id: "BRL",
        },
      },
    }),
  ]);

  await prisma.webhookEvent.upsert({
    where: {
      provider_eventId: {
        provider: "MERCADO_PAGO",
        eventId: "seed-webhook-payment-approved-001",
      },
    },
    update: {
      eventType: "payment",
      payload: {
        type: "payment",
        data: { id: "seed-payment-approved-001" },
      },
      processed: true,
      processedAt: addDays(now, -1),
    },
    create: {
      provider: "MERCADO_PAGO",
      eventId: "seed-webhook-payment-approved-001",
      eventType: "payment",
      payload: {
        type: "payment",
        data: { id: "seed-payment-approved-001" },
      },
      processed: true,
      processedAt: addDays(now, -1),
    },
  });

  await prisma.idempotencyKey.upsert({
    where: {
      key_endpoint: {
        key: "seed-idempotency-registration",
        endpoint: "/api/v1/registrations",
      },
    },
    update: {
      statusCode: 201,
      response: {
        registration: {
          code: "REG-SEED02",
          status: "PENDING_PAYMENT",
        },
        payment: {
          status: "PENDING",
          paymentUrl: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=seed-pref-pending-002",
        },
      },
    },
    create: {
      key: "seed-idempotency-registration",
      endpoint: "/api/v1/registrations",
      statusCode: 201,
      response: {
        registration: {
          code: "REG-SEED02",
          status: "PENDING_PAYMENT",
        },
        payment: {
          status: "PENDING",
          paymentUrl: "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=seed-pref-pending-002",
        },
      },
    },
  });

  await prisma.auditLog.deleteMany({
    where: {
      actorType: "SYSTEM",
      action: { in: ["SEED_CREATED_DATA", "PAYMENT_APPROVED", "REGISTRATION_EXPIRED"] },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorType: "SYSTEM",
        action: "SEED_CREATED_DATA",
        entityType: "Camp",
        entityId: camp.id,
        metadata: { batches: 3, registrations: seedRegistrations.length },
      },
      {
        actorType: "SYSTEM",
        action: "PAYMENT_APPROVED",
        entityType: "Registration",
        entityId: seedRegistrations[0].id,
        metadata: { registrationCode: "REG-SEED01", paymentId: "seed-payment-approved-001" },
      },
      {
        actorType: "SYSTEM",
        action: "REGISTRATION_EXPIRED",
        entityType: "Registration",
        entityId: seedRegistrations[4].id,
        metadata: { registrationCode: "REG-SEED05" },
      },
    ],
  });

  console.log(
    JSON.stringify(
      {
        camp: camp.name,
        batches: 3,
        registrations: seedRegistrations.map((registration) => registration.registrationCode),
      },
      null,
      2
    )
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });