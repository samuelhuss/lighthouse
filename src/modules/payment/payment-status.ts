import type { PaymentStatus, RegistrationStatus } from "@prisma/client";

export function mapMercadoPagoPaymentStatus(status: string): PaymentStatus {
  if (status === "approved") return "APPROVED";
  if (status === "rejected") return "REJECTED";
  if (status === "cancelled") return "CANCELLED";
  if (status === "refunded") return "REFUNDED";
  return "PENDING";
}

export function mapRegistrationStatusFromPayment(status: PaymentStatus): RegistrationStatus | null {
  if (status === "APPROVED") return "PAID";
  if (status === "REJECTED") return "PAYMENT_FAILED";
  if (status === "CANCELLED") return "CANCELLED";
  if (status === "REFUNDED") return "REFUNDED";
  return null;
}