import { z } from "zod";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export const createRegistrationSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
  cpf: z.string().trim().min(11).max(14).optional(),
  birthDate: z.string().regex(isoDatePattern, "birthDate deve estar no formato YYYY-MM-DD").optional(),
  batchId: z.string().uuid().optional(),
  privacyConsent: z.literal(true, {
    message: "É necessário aceitar a política de privacidade.",
  }),
});

export type CreateRegistrationBody = z.infer<typeof createRegistrationSchema>;

export const adminUpdateRegistrationSchema = z.object({
  status: z
    .enum([
      "PENDING_PAYMENT",
      "PAYMENT_PROCESSING",
      "PAID",
      "PAYMENT_FAILED",
      "CANCELLED",
      "EXPIRED",
      "REFUNDED",
    ])
    .optional(),
});

export type AdminUpdateRegistrationBody = z.infer<typeof adminUpdateRegistrationSchema>;

export const listRegistrationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).optional(),
  status: z
    .enum([
      "PENDING_PAYMENT",
      "PAYMENT_PROCESSING",
      "PAID",
      "PAYMENT_FAILED",
      "CANCELLED",
      "EXPIRED",
      "REFUNDED",
    ])
    .optional(),
  batchId: z.string().uuid().optional(),
  search: z.string().trim().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(["createdAt", "name", "status", "amountCents", "paidAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type ListRegistrationsQuery = z.infer<typeof listRegistrationsQuerySchema>;
