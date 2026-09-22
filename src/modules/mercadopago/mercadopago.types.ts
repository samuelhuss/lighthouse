export interface CreatePreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  currencyId?: string;
}

export interface CreatePreferenceInput {
  externalReference: string;
  items: CreatePreferenceItem[];
  payer: {
    name: string;
    email: string;
  };
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
}

export interface CreatePreferenceResult {
  preferenceId: string;
  initPoint: string;
}

export interface MercadoPagoPayment {
  id: number;
  status: "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded" | string;
  statusDetail: string | null;
  transactionAmount: number;
  currencyId: string;
  externalReference: string | null;
  paymentMethodId: string | null;
  raw: unknown;
}

export interface SearchPaymentsInput {
  externalReference?: string;
  sort?: string;
  criteria?: "desc" | "asc";
}
