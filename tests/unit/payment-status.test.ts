import { describe, expect, it } from "vitest";
import { mapMercadoPagoPaymentStatus, mapRegistrationStatusFromPayment } from "@/modules/payment/payment-status";

describe("payment status mapping", () => {
  it("maps Mercado Pago statuses to internal payment statuses", () => {
    expect(mapMercadoPagoPaymentStatus("approved")).toBe("APPROVED");
    expect(mapMercadoPagoPaymentStatus("rejected")).toBe("REJECTED");
    expect(mapMercadoPagoPaymentStatus("cancelled")).toBe("CANCELLED");
    expect(mapMercadoPagoPaymentStatus("refunded")).toBe("REFUNDED");
    expect(mapMercadoPagoPaymentStatus("in_process")).toBe("PENDING");
    expect(mapMercadoPagoPaymentStatus("pending")).toBe("PENDING");
  });

  it("maps final payment statuses to registration statuses", () => {
    expect(mapRegistrationStatusFromPayment("APPROVED")).toBe("PAID");
    expect(mapRegistrationStatusFromPayment("REJECTED")).toBe("PAYMENT_FAILED");
    expect(mapRegistrationStatusFromPayment("CANCELLED")).toBe("CANCELLED");
    expect(mapRegistrationStatusFromPayment("REFUNDED")).toBe("REFUNDED");
    expect(mapRegistrationStatusFromPayment("PENDING")).toBeNull();
  });
});