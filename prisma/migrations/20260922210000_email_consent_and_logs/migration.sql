ALTER TABLE "registrations" ADD COLUMN "marketingConsentAt" TIMESTAMP(3);

CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT,
    "recipient" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "resendId" TEXT,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_logs_idempotencyKey_key" ON "email_logs"("idempotencyKey");
CREATE INDEX "email_logs_registrationId_idx" ON "email_logs"("registrationId");
CREATE INDEX "email_logs_recipient_idx" ON "email_logs"("recipient");
CREATE INDEX "email_logs_type_idx" ON "email_logs"("type");
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
