import pino from "pino";

// Fields that must never reach logs (PII and secrets).
const REDACT_PATHS = [
  "cpf",
  "*.cpf",
  "accessToken",
  "*.accessToken",
  "authorization",
  "*.authorization",
  "webhookSecret",
  "*.webhookSecret",
  "MERCADOPAGO_ACCESS_TOKEN",
  "MERCADOPAGO_WEBHOOK_SECRET",
  "password",
  "*.password",
];

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: REDACT_PATHS,
    censor: "[REDACTED]",
  },
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});

export function withRequestId(requestId: string) {
  return logger.child({ requestId });
}
