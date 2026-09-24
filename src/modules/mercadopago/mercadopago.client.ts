import { MercadoPagoConfig, Preference, Payment, WebhookSignatureValidator } from "mercadopago";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import type { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";
import { getEnv } from "@/lib/env";
import { InvalidWebhookSignatureError } from "@/lib/errors";
import type { CreatePreferenceInput, CreatePreferenceResult, MercadoPagoPayment, SearchPaymentsInput } from "@/modules/mercadopago/mercadopago.types";

export class MercadoPagoClient {
  private readonly preferenceClient: Preference;
  private readonly paymentClient: Payment;
  private readonly isSandbox: boolean;

  constructor(accessToken: string = getEnv().MERCADOPAGO_ACCESS_TOKEN) {
    const config = new MercadoPagoConfig({ accessToken });
    this.preferenceClient = new Preference(config);
    this.paymentClient = new Payment(config);
    this.isSandbox = accessToken.startsWith("TEST-");
  }

  async createPreference(input: CreatePreferenceInput): Promise<CreatePreferenceResult> {
    const shouldAutoReturn = input.backUrls.success.startsWith("https://");
    const appBaseUrl = getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
    const payload = {
      items: input.items.map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: item.currencyId ?? "BRL",
      })),
      payer: {
        name: input.payer.name,
        email: input.payer.email,
      },
      external_reference: input.externalReference,
      back_urls: input.backUrls,
      notification_url: `${appBaseUrl}/api/v1/webhooks/mercadopago`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: input.expiresAt.toISOString(),
      payment_methods: {
        installments: 5,
      },
      ...(shouldAutoReturn ? { auto_return: "approved" } : {}),
    };

    const response = (await this.preferenceClient.create({ body: payload })) as PreferenceResponse;
    const initPoint = this.isSandbox
      ? response.sandbox_init_point ?? response.init_point
      : response.init_point ?? response.sandbox_init_point;

    if (!response.id || !initPoint) {
      throw new Error("Mercado Pago preference creation failed");
    }

    return {
      preferenceId: response.id,
      initPoint,
    };
  }

  async getPayment(paymentId: string): Promise<MercadoPagoPayment> {
    const response = (await this.paymentClient.get({ id: Number(paymentId) })) as PaymentResponse;

    return {
      id: Number(response.id ?? paymentId),
      status: String(response.status ?? "pending"),
      statusDetail: response.status_detail ?? null,
      transactionAmount: Number(response.transaction_amount ?? 0),
      currencyId: String(response.currency_id ?? "BRL"),
      externalReference: response.external_reference ?? null,
      paymentMethodId: response.payment_method_id ?? null,
      raw: response,
    };
  }

  async searchPayments(params: SearchPaymentsInput): Promise<MercadoPagoPayment[]> {
    const results = await this.paymentClient.search({
      options: {
        ...(params.externalReference ? { external_reference: params.externalReference } : {}),
      },
    });

    return ((results.results ?? []) as PaymentResponse[]).map((payment) => ({
      id: Number(payment.id ?? 0),
      status: String(payment.status ?? "pending"),
      statusDetail: payment.status_detail ?? null,
      transactionAmount: Number(payment.transaction_amount ?? 0),
      currencyId: String(payment.currency_id ?? "BRL"),
      externalReference: payment.external_reference ?? null,
      paymentMethodId: payment.payment_method_id ?? null,
      raw: payment,
    }));
  }

  validateWebhookSignature(xSignature: string | null | undefined, requestId: string | null | undefined, rawBody: string): void {
    const secret = getEnv().MERCADOPAGO_WEBHOOK_SECRET;

    try {
      WebhookSignatureValidator.validate({
        xSignature,
        xRequestId: requestId,
        dataId: null,
        secret,
        toleranceSeconds: 300,
      });
    } catch {
      throw new InvalidWebhookSignatureError();
    }

    // The SDK validates the HMAC but not the raw body. We keep the request
    // body in memory for downstream processing, and the route handler will
    // validate the parsed JSON before updating the database.
    void rawBody;
  }
}
