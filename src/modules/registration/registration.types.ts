import type { Registration } from "@prisma/client";

export interface RegistrationResult {
  registration: {
    id: string;
    code: string;
    status: Registration["status"];
  };
  payment: {
    status: string;
    paymentUrl: string;
  };
}

export interface PublicRegistrationView {
  code: string;
  name: string;
  status: Registration["status"];
  amountCents: number;
  paidAt: Date | null;
}
