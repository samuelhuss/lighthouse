# Technical Implementation Specification

## Plataforma de Inscrição e Pagamento — Acampamento

**Versão:** 1.0  
**Data:** 21/09/2026  
**Relacionamento:** Complementa `SDD.md`  
**Status:** Ready for Implementation

---

# 1. Objetivo

Este documento transforma as decisões arquiteturais definidas no SDD em especificações de implementação.

O documento define:

- estrutura do projeto;
- banco de dados;
- entidades;
- migrations;
- contratos REST;
- validações;
- integração com Mercado Pago;
- criação de Preferences;
- Webhooks;
- idempotência;
- controle de vagas;
- expiração de reservas;
- reconciliação;
- Google Sheets;
- autenticação administrativa;
- tratamento de erros;
- testes;
- variáveis de ambiente.

---

# 2. Stack

## Aplicação

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
```

## Backend

```text
Next.js Route Handlers
TypeScript
Zod
```

## Persistência

```text
PostgreSQL
Prisma ORM
```

## Pagamento

```text
Mercado Pago Checkout Pro
Mercado Pago Preferences API
Mercado Pago Payments API
Mercado Pago Webhooks
```

## Administração

```text
Supabase Auth
```

## Integrações

```text
Google Sheets API
```

---

# 3. Estrutura do projeto

```text
camp/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── inscricao/
│   │   │   └── page.tsx
│   │   └── pagamento/
│   │       ├── sucesso/
│   │       │   └── page.tsx
│   │       ├── pendente/
│   │       │   └── page.tsx
│   │       └── erro/
│   │           └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── inscricoes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── pagamentos/
│   │   │   └── page.tsx
│   │   └── lotes/
│   │       └── page.tsx
│   │
│   └── api/
│       └── v1/
│           ├── camp/
│           │   └── route.ts
│           │
│           ├── registrations/
│           │   ├── route.ts
│           │   └── [code]/
│           │       ├── route.ts
│           │       └── payment/
│           │           └── route.ts
│           │
│           ├── admin/
│           │   ├── dashboard/
│           │   │   └── route.ts
│           │   ├── registrations/
│           │   │   ├── route.ts
│           │   │   └── [id]/
│           │   │       └── route.ts
│           │   └── batches/
│           │       ├── route.ts
│           │       └── [id]/
│           │           └── route.ts
│           │
│           └── webhooks/
│               └── mercadopago/
│                   └── route.ts
│
├── src/
│   ├── modules/
│   │   ├── registration/
│   │   │   ├── registration.service.ts
│   │   │   ├── registration.repository.ts
│   │   │   ├── registration.schema.ts
│   │   │   └── registration.types.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.service.ts
│   │   │   ├── payment.repository.ts
│   │   │   ├── payment.types.ts
│   │   │   └── payment-status.ts
│   │   │
│   │   ├── mercadopago/
│   │   │   ├── mercadopago.client.ts
│   │   │   ├── mercadopago.service.ts
│   │   │   ├── mercadopago.webhook.ts
│   │   │   └── mercadopago.types.ts
│   │   │
│   │   ├── batch/
│   │   │   ├── batch.service.ts
│   │   │   └── batch.repository.ts
│   │   │
│   │   ├── sheet/
│   │   │   ├── google-sheets.service.ts
│   │   │   └── google-sheets.client.ts
│   │   │
│   │   └── admin/
│   │       └── admin.service.ts
│   │
│   ├── jobs/
│   │   ├── expire-registrations.ts
│   │   └── reconcile-payments.ts
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── auth.ts
│   │
│   └── utils/
│       ├── idempotency.ts
│       ├── registration-code.ts
│       └── money.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

# 4. Configuração do Prisma

## 4.1 schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum RegistrationStatus {
  PENDING_PAYMENT
  PAYMENT_PROCESSING
  PAID
  PAYMENT_FAILED
  CANCELLED
  EXPIRED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
  REFUNDED
}

enum PaymentProvider {
  MERCADO_PAGO
}

enum WebhookProvider {
  MERCADO_PAGO
}

model Camp {
  id            String         @id @default(uuid())
  name          String
  description   String?
  location      String?
  startDate     DateTime?
  endDate       DateTime?
  maxCapacity   Int
  active        Boolean        @default(true)

  batches       Batch[]
  registrations Registration[]

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Batch {
  id              String         @id @default(uuid())
  campId          String

  name            String
  priceCents      Int
  capacity        Int
  reservedCount   Int            @default(0)

  startsAt        DateTime?
  endsAt          DateTime?
  active          Boolean        @default(true)

  camp            Camp           @relation(fields: [campId], references: [id])
  registrations   Registration[]

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([campId])
}

model Registration {
  id                  String             @id @default(uuid())
  campId              String
  batchId             String?

  registrationCode    String             @unique

  name                String
  email               String
  phone               String
  cpf                 String?
  birthDate           DateTime?

  status              RegistrationStatus

  amountCents         Int

  paymentExpiresAt    DateTime?
  paidAt              DateTime?

  camp                Camp               @relation(fields: [campId], references: [id])
  batch               Batch?             @relation(fields: [batchId], references: [id])

  payments            Payment[]

  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  @@index([campId])
  @@index([batchId])
  @@index([status])
  @@index([email])
}

model Payment {
  id                    String          @id @default(uuid())

  registrationId        String

  provider              PaymentProvider

  providerPaymentId     String?
  providerPreferenceId  String?

  externalReference     String

  amountCents           Int

  status                PaymentStatus

  statusDetail          String?
  paymentMethod         String?

  rawResponse           Json?

  paidAt                DateTime?

  registration          Registration    @relation(
    fields: [registrationId],
    references: [id]
  )

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  @@unique([provider, providerPaymentId])
  @@index([registrationId])
  @@index([externalReference])
}

model WebhookEvent {
  id            String           @id @default(uuid())

  provider      WebhookProvider
  eventId       String
  eventType     String?

  payload       Json

  processed     Boolean          @default(false)
  processedAt   DateTime?

  createdAt     DateTime         @default(now())

  @@unique([provider, eventId])
}

model AuditLog {
  id          String    @id @default(uuid())

  actorType   String
  actorId     String?

  action      String

  entityType  String
  entityId    String?

  metadata    Json?

  createdAt   DateTime  @default(now())

  @@index([entityType, entityId])
}
```

---

# 5. Enums de domínio

## RegistrationStatus

```ts
export enum RegistrationStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAYMENT_PROCESSING = "PAYMENT_PROCESSING",
  PAID = "PAID",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  REFUNDED = "REFUNDED",
}
```

## PaymentStatus

```ts
export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}
```

---

# 6. Variáveis de ambiente

`.env.example`:

```env
DATABASE_URL="postgresql://..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"

MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_WEBHOOK_SECRET=""

GOOGLE_SERVICE_ACCOUNT_EMAIL=""
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=""
GOOGLE_SHEET_ID=""

SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

REGISTRATION_PAYMENT_EXPIRATION_MINUTES="30"
```

---

# 7. Cliente Mercado Pago

Criar:

```text
src/modules/mercadopago/mercadopago.client.ts
```

Responsabilidade:

- configurar SDK;
- encapsular Access Token;
- expor operações utilizadas pelo domínio.

Exemplo conceitual:

```ts
export class MercadoPagoClient {
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createPreference(payload: unknown) {
    // chamada Mercado Pago
  }

  async getPayment(paymentId: string) {
    // GET payment
  }

  async searchPayments(params: unknown) {
    // pesquisa pagamentos
  }
}
```

O Access Token deverá existir somente no backend.

---

# 8. Registration Schema

Utilizar Zod.

```ts
import { z } from "zod";

export const createRegistrationSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(255),

  email: z
    .string()
    .email(),

  phone: z
    .string()
    .min(10)
    .max(20),

  cpf: z
    .string()
    .optional(),

  birthDate: z
    .string()
    .date()
    .optional(),
});
```

O schema deverá ser utilizado no backend.

O frontend poderá utilizar o mesmo schema para UX, mas a validação definitiva deverá sempre ocorrer no backend.

---

# 9. Endpoint — Criar inscrição

```http
POST /api/v1/registrations
```

## Headers

```http
Content-Type: application/json
Idempotency-Key: <uuid>
```

## Request

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birthDate": "2000-01-01"
}
```

---

# 10. Fluxo interno

```text
POST /registrations
        │
        ▼
validate body
        │
        ▼
validate idempotency
        │
        ▼
get active camp
        │
        ▼
get current batch
        │
        ▼
BEGIN TRANSACTION
        │
        ▼
reserve slot
        │
        ▼
create Registration
        │
        ▼
COMMIT
        │
        ▼
create Mercado Pago Preference
        │
        ▼
create Payment
        │
        ▼
return paymentUrl
```

---

# 11. Reserva atômica

A reserva deverá ocorrer dentro de uma transação.

Pseudo-código:

```ts
await prisma.$transaction(async (tx) => {
  const updated = await tx.$executeRaw`
    UPDATE "Batch"
    SET "reservedCount" = "reservedCount" + 1
    WHERE "id" = ${batch.id}
      AND "reservedCount" < "capacity"
  `;

  if (updated !== 1) {
    throw new NoSlotsAvailableError();
  }

  await tx.registration.create({
    data: {
      ...
    },
  });
});
```

Nunca realizar:

```ts
const batch = await prisma.batch.findUnique();

if (batch.reservedCount < batch.capacity) {
  await prisma.registration.create(...);
}
```

sem proteção transacional.

---

# 12. Criação da Preference

Depois da criação da inscrição:

```ts
const preference = await mercadoPago.createPreference({
  items: [
    {
      id: registration.registrationCode,
      title: camp.name,
      quantity: 1,
      unit_price: registration.amountCents / 100,
      currency_id: "BRL",
    },
  ],

  payer: {
    name: registration.name,
    email: registration.email,
  },

  external_reference: registration.registrationCode,

  back_urls: {
    success:
      `${APP_URL}/pagamento/sucesso`,
    failure:
      `${APP_URL}/pagamento/erro`,
    pending:
      `${APP_URL}/pagamento/pendente`,
  },

  auto_return: "approved",
});
```

O sistema deverá salvar:

```text
preference.id
preference.init_point
```

A URL retornada pelo Mercado Pago será entregue ao frontend.

---

# 13. Importante sobre `init_point`

O backend deverá retornar:

```json
{
  "registrationId": "...",
  "registrationCode": "REG-A83F21",
  "paymentUrl": "https://..."
}
```

O frontend deverá redirecionar o participante para:

```ts
window.location.assign(paymentUrl);
```

O frontend nunca deverá montar manualmente a URL do Mercado Pago.

---

# 14. Criação do Payment

Depois de criar a Preference:

```ts
await prisma.payment.create({
  data: {
    registrationId: registration.id,

    provider: "MERCADO_PAGO",

    providerPreferenceId: preference.id,

    externalReference: registration.registrationCode,

    amountCents: registration.amountCents,

    status: "PENDING",
  },
});
```

O `providerPaymentId` ficará inicialmente vazio.

Ele será preenchido quando o pagamento real for criado pelo Mercado Pago.

---

# 15. Response

```http
HTTP 201 Created
```

```json
{
  "registration": {
    "id": "uuid",
    "code": "REG-A83F21",
    "status": "PENDING_PAYMENT"
  },
  "payment": {
    "status": "PENDING",
    "paymentUrl": "https://..."
  }
}
```

---

# 16. Endpoint — Consultar inscrição

```http
GET /api/v1/registrations/{code}
```

Exemplo:

```http
GET /api/v1/registrations/REG-A83F21
```

Response:

```json
{
  "code": "REG-A83F21",
  "name": "João Silva",
  "status": "PAID",
  "amountCents": 23000,
  "paidAt": "2026-09-21T18:32:00Z"
}
```

Não retornar dados administrativos ou dados sensíveis desnecessários.

---

# 17. Endpoint — Status do pagamento

```http
GET /api/v1/registrations/{code}/payment
```

Response:

```json
{
  "status": "APPROVED",
  "paidAt": "2026-09-21T18:32:00Z"
}
```

O endpoint deverá consultar primeiro o banco.

Se houver um caso de `PENDING_PAYMENT`, o frontend poderá apresentar:

```text
Aguardando confirmação do pagamento...
```

---

# 18. Mercado Pago — Webhook

Endpoint:

```http
POST /api/v1/webhooks/mercadopago
```

Esse endpoint deverá ser público.

A proteção será feita através da assinatura enviada pelo Mercado Pago.

---

# 19. Webhook — fluxo

```text
Mercado Pago
      │
      ▼
POST /webhooks/mercadopago
      │
      ▼
Validate signature
      │
      ├── invalid → 401
      │
      ▼
Extract event
      │
      ▼
Check duplicate
      │
      ├── duplicate → 200
      │
      ▼
Persist event
      │
      ▼
Extract payment ID
      │
      ▼
GET Mercado Pago payment
      │
      ▼
Validate payment
      │
      ▼
Update database
      │
      ▼
Sync Google Sheets
      │
      ▼
200
```

---

# 20. Validação da assinatura

O Webhook deverá ler:

```http
x-signature
x-request-id
```

O formato da assinatura deverá ser interpretado conforme a documentação vigente do Mercado Pago.

A aplicação deverá:

1. extrair timestamp;
2. extrair assinatura;
3. construir o manifest;
4. calcular HMAC-SHA256;
5. comparar usando comparação segura;
6. rejeitar assinatura inválida.

Pseudo-código:

```ts
const expectedSignature = createHmac(
  "sha256",
  process.env.MERCADOPAGO_WEBHOOK_SECRET
)
  .update(manifest)
  .digest("hex");

if (!timingSafeEqual(
  Buffer.from(expectedSignature),
  Buffer.from(signature)
)) {
  throw new InvalidWebhookSignatureError();
}
```

A implementação final deverá seguir exatamente o formato de assinatura especificado pelo Mercado Pago para o tipo de Webhook configurado.

---

# 21. Idempotência do Webhook

O identificador do evento deverá ser persistido.

Antes de processar:

```ts
const existing = await prisma.webhookEvent.findUnique({
  where: {
    provider_eventId: {
      provider: "MERCADO_PAGO",
      eventId,
    },
  },
});

if (existing) {
  return Response.json({ ok: true });
}
```

Depois:

```ts
await prisma.webhookEvent.create({
  data: {
    provider: "MERCADO_PAGO",
    eventId,
    eventType,
    payload,
  },
});
```

A constraint:

```prisma
@@unique([provider, eventId])
```

é obrigatória.

---

# 22. Buscar Payment no Mercado Pago

O Webhook não deverá decidir sozinho que o pagamento foi aprovado.

Recebido:

```json
{
  "type": "payment",
  "data": {
    "id": "123456789"
  }
}
```

Executar:

```text
GET /v1/payments/123456789
```

Depois obter:

```json
{
  "id": 123456789,
  "status": "approved",
  "transaction_amount": 230,
  "currency_id": "BRL",
  "external_reference": "REG-A83F21"
}
```

---

# 23. Validações obrigatórias

Antes de `PAID`:

```ts
payment.status === "approved"
```

```ts
payment.currency_id === "BRL"
```

```ts
payment.transaction_amount * 100
    === registration.amountCents
```

```ts
payment.external_reference
    === registration.registrationCode
```

E:

```ts
payment.id
```

não poderá estar associado a outra inscrição.

---

# 24. Processamento de pagamento aprovado

```ts
await prisma.$transaction(async (tx) => {

  const payment = await tx.payment.update({
    where: {
      id: paymentRecord.id,
    },

    data: {
      providerPaymentId:
        mercadoPagoPayment.id.toString(),

      status: "APPROVED",

      statusDetail:
        mercadoPagoPayment.status_detail,

      paidAt: new Date(),
    },
  });

  await tx.registration.update({
    where: {
      id: payment.registrationId,
    },

    data: {
      status: "PAID",
      paidAt: new Date(),
    },
  });

});
```

---

# 25. Regra de transição

Não permitir:

```text
PAID → PENDING_PAYMENT
```

por um Webhook atrasado.

Exemplo:

```text
18:00 approved
18:01 PAID
18:02 webhook antigo pending
```

O evento de `pending` não poderá sobrescrever `PAID`.

Regra:

```ts
if (registration.status === "PAID") {
  return;
}
```

Exceto para transições explicitamente suportadas, como reembolso.

---

# 26. Payment state machine

```text
PENDING
  │
  ├── approved ───────► APPROVED
  │
  ├── rejected ───────► REJECTED
  │
  └── cancelled ──────► CANCELLED

APPROVED
  │
  └── refund ──────────► REFUNDED
```

---

# 27. Endpoint administrativo — Dashboard

```http
GET /api/v1/admin/dashboard
```

Response:

```json
{
  "registrations": {
    "total": 87,
    "paid": 72,
    "pending": 10,
    "failed": 2,
    "cancelled": 3
  },

  "capacity": {
    "total": 100,
    "reserved": 75,
    "available": 25
  },

  "revenue": {
    "paidCents": 1656000,
    "pendingCents": 230000
  }
}
```

---

# 28. Endpoint administrativo — Inscrições

```http
GET /api/v1/admin/registrations
```

Query:

```text
?page=1
&limit=20
&status=PAID
&batchId=<uuid>
&search=joao
```

---

# 29. Endpoint administrativo — Inscrição

```http
GET /api/v1/admin/registrations/{id}
```

Retorna informações completas necessárias ao administrador.

Dados sensíveis deverão ser exibidos somente para usuários autorizados.

---

# 30. Endpoint administrativo — Lotes

Criar:

```http
GET  /api/v1/admin/batches
POST /api/v1/admin/batches
```

Atualizar:

```http
PATCH /api/v1/admin/batches/{id}
```

Exemplo:

```json
{
  "name": "2º Lote",
  "priceCents": 23000,
  "capacity": 30,
  "startsAt": "2026-10-01T00:00:00Z",
  "endsAt": "2026-10-20T23:59:59Z"
}
```

---

# 31. Current Batch

O backend deverá determinar o lote atual.

Critérios:

```text
active = true
startsAt <= now
endsAt >= now
```

Se existir mais de um, deverá existir uma regra determinística.

Recomendação:

```text
maior startsAt
```

entre os lotes atualmente válidos.

---

# 32. Reserva de vaga

Ao criar inscrição:

```text
reservedCount++
```

Ao expirar:

```text
reservedCount--
```

Ao cancelar uma inscrição pendente:

```text
reservedCount--
```

Ao pagar:

```text
reservedCount permanece
```

A vaga só é liberada se a inscrição deixar de ocupar a capacidade.

---

# 33. Expiração

Campo:

```prisma
paymentExpiresAt DateTime?
```

No momento da criação:

```ts
paymentExpiresAt =
  addMinutes(
    new Date(),
    Number(
      process.env
        .REGISTRATION_PAYMENT_EXPIRATION_MINUTES
    )
  );
```

Default:

```text
30 minutos
```

---

# 34. Job de expiração

Executar periodicamente:

```text
expire-registrations
```

Query:

```text
status = PENDING_PAYMENT
paymentExpiresAt < NOW()
```

Para cada registro:

```text
PENDING_PAYMENT
       ↓
EXPIRED
       ↓
release slot
```

---

# 35. Reconciliação

Job:

```text
reconcile-payments
```

Executar a cada:

```text
5 minutos
```

Buscar:

```text
PENDING_PAYMENT
PAYMENT_PROCESSING
```

com criação recente.

Para cada:

```text
buscar Payment no Mercado Pago
```

Se:

```text
approved
```

executar o mesmo service utilizado pelo Webhook.

Isso é importante:

```text
Webhook
   └── PaymentService.process()

Reconciliation
   └── PaymentService.process()
```

A lógica de negócio não deve ser duplicada.

---

# 36. PaymentService

Interface:

```ts
interface PaymentService {
  createPayment(
    registrationId: string
  ): Promise<Payment>;

  processPaymentUpdate(
    paymentId: string
  ): Promise<void>;

  reconcilePayment(
    paymentId: string
  ): Promise<void>;
}
```

---

# 37. MercadoPagoService

Interface:

```ts
interface MercadoPagoService {
  createPreference(
    input: CreatePreferenceInput
  ): Promise<CreatePreferenceResult>;

  getPayment(
    paymentId: string
  ): Promise<MercadoPagoPayment>;

  searchPayments(
    params: SearchPaymentsInput
  ): Promise<MercadoPagoPayment[]>;
}
```

---

# 38. RegistrationService

Interface:

```ts
interface RegistrationService {

  createRegistration(
    input: CreateRegistrationInput,
    idempotencyKey: string
  ): Promise<RegistrationResult>;

  getRegistration(
    code: string
  ): Promise<Registration>;

  cancelRegistration(
    id: string
  ): Promise<void>;

  expireRegistration(
    id: string
  ): Promise<void>;
}
```

---

# 39. Google Sheets

O Google Sheets será uma projeção dos dados.

Não será usado como banco transacional.

Fluxo:

```text
PostgreSQL
    │
    ▼
Registration/Payment
    │
    ▼
GoogleSheetsService
    │
    ▼
Google Sheets
```

---

# 40. Estrutura da planilha

Colunas:

```text
A  Registration ID
B  Código
C  Nome
D  E-mail
E  WhatsApp
F  CPF
G  Data nascimento
H  Lote
I  Valor
J  Status
K  Payment ID
L  Status pagamento
M  Data inscrição
N  Data pagamento
```

---

# 41. Identificação da linha

Nunca localizar uma linha pelo nome.

Utilizar:

```text
registrationCode
```

Exemplo:

```text
REG-A83F21
```

Esse código deverá ser único.

---

# 42. Sync

Interface:

```ts
interface GoogleSheetsService {
  upsertRegistration(
    registration: Registration
  ): Promise<void>;
}
```

Comportamento:

```text
Registration existe?
       │
       ├── NÃO → append
       │
       └── SIM → update
```

---

# 43. Falha no Google Sheets

Se:

```text
PostgreSQL = sucesso
Google Sheets = erro
```

não fazer rollback do pagamento.

O pagamento já foi confirmado.

Criar mecanismo de retry.

Possibilidades:

```text
retry 1 → 1 min
retry 2 → 5 min
retry 3 → 15 min
retry 4 → 1 hora
```

---

# 44. Idempotency-Key

O frontend deverá gerar:

```ts
crypto.randomUUID()
```

Exemplo:

```http
Idempotency-Key: 7c0f4a1d-...
```

O backend deverá armazenar o resultado associado à chave.

Pode ser criada uma tabela:

```prisma
model IdempotencyKey {
  id          String   @id @default(uuid())
  key         String
  endpoint    String
  response    Json?
  statusCode  Int?
  createdAt   DateTime @default(now())

  @@unique([key, endpoint])
}
```

---

# 45. Regra de idempotência

Primeira requisição:

```text
Idempotency-Key = ABC
       ↓
cria registration
       ↓
201
```

Segunda requisição:

```text
Idempotency-Key = ABC
       ↓
encontra resultado
       ↓
retorna mesmo resultado
```

Não criar nova cobrança.

---

# 46. Tratamento de erros

Criar classes:

```ts
class AppError extends Error {
  code: string;
  statusCode: number;
}
```

Exemplos:

```ts
NoSlotsAvailableError
RegistrationClosedError
BatchExpiredError
PaymentNotFoundError
InvalidWebhookSignatureError
PaymentAmountMismatchError
DuplicatePaymentError
```

---

# 47. Formato de erro

Sempre:

```json
{
  "error": {
    "code": "NO_SLOTS_AVAILABLE",
    "message": "Não há vagas disponíveis."
  }
}
```

Não retornar stack trace para o frontend.

---

# 48. Segurança do Admin

Todas as rotas:

```text
/api/v1/admin/*
```

deverão validar:

```text
authenticated
+
authorized
```

Exemplo:

```ts
const user = await requireUser();

if (!user.roles.includes("ADMIN")) {
  throw new ForbiddenError();
}
```

---

# 49. LGPD

O frontend deverá possuir:

```text
Política de privacidade
```

No formulário:

```text
[ ] Li e concordo com a política de privacidade.
```

O backend deverá armazenar o consentimento quando aplicável:

```text
privacyConsentAt
```

Dados pessoais não deverão ser escritos em logs.

---

# 50. Observabilidade

Todos os requests deverão possuir:

```text
requestId
```

Exemplo:

```text
requestId=7e1b...
```

Logs:

```text
INFO registration_created
INFO preference_created
INFO webhook_received
INFO payment_approved
INFO sheet_sync
ERROR payment_reconciliation
```

---

# 51. Logging

Exemplo:

```ts
logger.info("payment_approved", {
  registrationId,
  paymentId,
  requestId,
});
```

Nunca:

```ts
logger.info({
  cpf,
  accessToken,
  webhookSecret,
});
```

---

# 52. Testes unitários

Obrigatórios:

```text
getCurrentBatch
reserveSlot
releaseSlot
createRegistration
createPreference
validatePayment
processApprovedPayment
processRejectedPayment
expireRegistration
```

---

# 53. Testes de Webhook

Casos:

```text
✓ assinatura válida
✓ assinatura inválida
✓ evento duplicado
✓ payment inexistente
✓ registration inexistente
✓ valor correto
✓ valor incorreto
✓ external_reference correta
✓ external_reference incorreta
✓ approved
✓ pending
✓ rejected
✓ cancelled
```

---

# 54. Teste de concorrência

Executar várias inscrições simultaneamente.

Exemplo:

```text
capacity = 10

100 requests simultâneas
```

Resultado esperado:

```text
10 registrations reservadas
90 NO_SLOTS_AVAILABLE
```

Nunca:

```text
11+ registrations
```

---

# 55. Teste de pagamento duplicado

Simular:

```text
Webhook payment A
Webhook payment A
Webhook payment A
```

Resultado:

```text
1 payment
1 registration PAID
1 sheet update lógico
```

---

# 56. Teste de webhook atrasado

Sequência:

```text
approved
pending
approved
```

Resultado final:

```text
PAID
```

O `pending` não poderá fazer downgrade.

---

# 57. Teste de reconciliação

Cenário:

```text
payment approved
webhook perdido
```

O job deverá:

```text
buscar payment
↓
approved
↓
PAID
```

---

# 58. Teste de expiração

Cenário:

```text
10 vagas
1 registration pending
```

Após expiração:

```text
9 registrations reserved
```

A vaga deverá voltar a ficar disponível.

---

# 59. Segurança de pagamentos

Nunca considerar:

```text
back_urls.success
```

como confirmação de pagamento.

Nunca considerar:

```text
frontend → status=paid
```

como confirmação.

Nunca aceitar:

```text
amount
```

do frontend como valor definitivo.

O valor deverá ser calculado pelo backend:

```text
current batch
       ↓
priceCents
```

---

# 60. Regra de preço

O frontend poderá enviar:

```json
{
  "batchId": "..."
}
```

ou nenhum lote.

Mas o backend deverá determinar o lote atual.

Nunca:

```json
{
  "amount": 1
}
```

ser utilizado diretamente.

---

# 61. Fluxo definitivo de criação

```text
USER
 │
 │ formulário
 ▼
POST /registrations
 │
 ├── Zod
 ├── current batch
 ├── price
 ├── capacity
 └── idempotency
 │
 ▼
DATABASE TRANSACTION
 │
 ├── reserve slot
 └── create registration
 │
 ▼
MERCADO PAGO
 │
 └── create preference
 │
 ▼
DATABASE
 │
 └── create payment
 │
 ▼
CLIENT
 │
 └── redirect init_point
```

---

# 62. Fluxo definitivo de confirmação

```text
MERCADO PAGO
 │
 ▼
WEBHOOK
 │
 ├── validate signature
 ├── validate event
 ├── idempotency
 │
 ▼
GET PAYMENT
 │
 ▼
validate:
 ├── status
 ├── amount
 ├── currency
 └── external_reference
 │
 ▼
DATABASE TRANSACTION
 │
 ├── Payment → APPROVED
 └── Registration → PAID
 │
 ▼
ASYNC SYNC
 │
 └── Google Sheets
```

---

# 63. Definition of Done

Uma feature será considerada pronta quando:

- [ ] código implementado;
- [ ] TypeScript sem erros;
- [ ] lint sem erros;
- [ ] testes unitários;
- [ ] testes de integração;
- [ ] tratamento de erros;
- [ ] logs;
- [ ] idempotência;
- [ ] documentação;
- [ ] migration criada;
- [ ] variáveis de ambiente documentadas.

---

# 64. Checklist de produção

## Mercado Pago

- [ ] Aplicação criada
- [ ] Access Token configurado
- [ ] Webhook Secret configurado
- [ ] URL HTTPS configurada
- [ ] Eventos configurados
- [ ] Testes realizados
- [ ] Credenciais de produção configuradas

## Banco

- [ ] PostgreSQL criado
- [ ] migrations aplicadas
- [ ] backup configurado
- [ ] índices verificados

## Aplicação

- [ ] domínio configurado
- [ ] HTTPS
- [ ] environment variables
- [ ] logs
- [ ] monitoring

## Google

- [ ] Google Cloud Project
- [ ] Google Sheets API
- [ ] Service Account
- [ ] planilha compartilhada com Service Account
- [ ] Sheet ID configurado

## Admin

- [ ] autenticação
- [ ] autorização
- [ ] primeiro administrador
- [ ] proteção das rotas

---

# 65. Decisões que não devem ser alteradas sem revisão

As seguintes decisões são consideradas arquiteturalmente importantes:

1. PostgreSQL é a fonte de verdade.
2. Google Sheets não é banco.
3. Mercado Pago não é fonte de verdade da inscrição.
4. Webhook não é confirmação isolada.
5. O pagamento deve ser consultado na API do Mercado Pago.
6. `external_reference` deve relacionar pagamento e inscrição.
7. Webhooks devem ser idempotentes.
8. Criação de inscrição deve suportar idempotência.
9. Reserva de vagas deve ser atômica.
10. Valor deve ser calculado no backend.
11. `back_urls` não confirmam pagamento.
12. Access Token nunca vai para o frontend.

---

# 66. Resumo da implementação

O sistema terá quatro fluxos principais.

## Fluxo A — Cadastro

```text
Frontend
 ↓
POST /registrations
 ↓
Backend
 ↓
PostgreSQL
```

## Fluxo B — Pagamento

```text
Backend
 ↓
Mercado Pago Preference
 ↓
init_point
 ↓
Frontend
 ↓
Mercado Pago
```

## Fluxo C — Confirmação

```text
Mercado Pago
 ↓
Webhook
 ↓
Backend
 ↓
GET Payment
 ↓
PostgreSQL
 ↓
PAID
```

## Fluxo D — Administração

```text
PostgreSQL
 ↓
Admin API
 ↓
Dashboard
```

E a planilha funciona como:

```text
PostgreSQL
 ↓
Google Sheets
```

---

# 67. Estrutura final

```text
                    ┌───────────────────┐
                    │    LANDING PAGE   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    REGISTRATION   │
                    │       API         │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    PostgreSQL     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   Mercado Pago    │
                    │    Preference     │
                    └─────────┬─────────┘
                              │
                              ▼
                           PAYMENT
                              │
                              ▼
                    ┌───────────────────┐
                    │      WEBHOOK      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ PaymentService    │
                    │                   │
                    │ validate          │
                    │ idempotency       │
                    │ reconciliation    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    PostgreSQL     │
                    │                   │
                    │ Registration PAID│
                    └─────────┬─────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
             ┌──────────────┐    ┌──────────────┐
             │ Admin Panel  │    │ Google Sheet │
             └──────────────┘    └──────────────┘
```

# 68. Referência de implementação

A implementação deverá seguir o seguinte princípio:

> **O usuário inicia a inscrição, o backend controla a vaga e o preço, o Mercado Pago processa o pagamento, o Webhook informa a mudança, o backend confirma o pagamento diretamente na API do Mercado Pago e somente então a inscrição é marcada como paga.**

Esse fluxo deverá ser mantido independentemente da implementação específica do frontend.