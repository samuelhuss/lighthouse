import { beforeEach, describe, expect, it, vi } from "vitest";

const createPreferenceMock = vi.fn();

process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/lighthouse";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.MERCADOPAGO_ACCESS_TOKEN = "TEST-ACCESS-TOKEN";
process.env.MERCADOPAGO_WEBHOOK_SECRET = "test-secret";
process.env.INTERNAL_JOBS_SECRET = "test-internal-secret";

vi.mock("mercadopago", () => {
  class MercadoPagoConfigMock {
    constructor(_: unknown) {}
  }

  class PreferenceMock {
    create = createPreferenceMock;
  }

  class PaymentMock {}

  return {
    MercadoPagoConfig: MercadoPagoConfigMock,
    Preference: PreferenceMock,
    Payment: PaymentMock,
    WebhookSignatureValidator: {
      validate: vi.fn(),
    },
  };
});

import { MercadoPagoClient } from "@/modules/mercadopago/mercadopago.client";

describe("MercadoPagoClient", () => {
  beforeEach(() => {
    createPreferenceMock.mockReset();
    createPreferenceMock.mockResolvedValue({
      id: "pref_123",
      init_point: "https://example.com/checkout",
    });
  });

  it("sends the webhook notification URL when creating the preference", async () => {
    const client = new MercadoPagoClient("TEST-ACCESS-TOKEN");

    await client.createPreference({
      externalReference: "REG-123",
      items: [{
        id: "REG-123",
        title: "Camp",
        quantity: 1,
        unitPrice: 29.9,
      }],
      payer: {
        name: "Ana",
        email: "ana@example.com",
      },
      backUrls: {
        success: "https://example.com/pagamento/sucesso?code=REG-123",
        failure: "https://example.com/pagamento/erro?code=REG-123",
        pending: "https://example.com/pagamento/pendente?code=REG-123",
      },
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    });

    expect(createPreferenceMock).toHaveBeenCalledWith({
      body: expect.objectContaining({
        notification_url: "http://localhost:3000/api/v1/webhooks/mercadopago",
      }),
    });
  });
});
