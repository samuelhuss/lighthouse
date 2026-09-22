# Software Design Document (SDD)

## Plataforma de Inscrição e Pagamento — Acampamento

**Versão:** 1.0  
**Data:** 21/09/2026  
**Status:** Proposta  
**Responsável:** Samuel

---

# 1. Visão geral

O projeto consiste em uma plataforma web para divulgação, inscrição e gerenciamento de participantes de um acampamento.

A plataforma deverá permitir:

- apresentar informações do acampamento;
- realizar inscrições online;
- criar uma cobrança individual no Mercado Pago;
- redirecionar o participante para o pagamento;
- receber a confirmação do pagamento através de Webhook;
- atualizar automaticamente o status da inscrição;
- disponibilizar um painel administrativo;
- sincronizar os participantes com uma planilha;
- controlar quantidade de vagas;
- controlar lotes/preços;
- consultar histórico de pagamentos.

O sistema deverá tratar o Mercado Pago como **fonte externa de confirmação de pagamento**, enquanto o banco de dados da aplicação será a fonte principal dos dados de inscrição.

---

# 2. Objetivos

## 2.1 Objetivo principal

Criar uma experiência simples:

```text
Landing Page
      ↓
Inscrição
      ↓
Criação da cobrança
      ↓
Mercado Pago
      ↓
Pagamento
      ↓
Webhook
      ↓
Confirmação
      ↓
Inscrição = PAID
      ↓
Painel administrativo
      ↓
Google Sheets
```

---

# 3. Escopo

## 3.1 Dentro do escopo

### Participante

- Visualizar landing page;
- Visualizar informações do acampamento;
- Realizar inscrição;
- Receber link de pagamento;
- Efetuar pagamento no Mercado Pago;
- Consultar status da inscrição;
- Receber confirmação de pagamento.

### Administrador

- Login;
- Dashboard;
- Listagem de inscritos;
- Busca;
- Filtros por status;
- Visualização de inscrição;
- Visualização do pagamento;
- Controle de lotes;
- Controle de vagas;
- Exportação;
- Sincronização com Google Sheets.

### Backend

- API REST;
- Persistência das inscrições;
- Integração Mercado Pago;
- Criação de Preferences;
- Webhooks;
- Validação de assinatura;
- Idempotência;
- Reconciliação de pagamentos;
- Controle de vagas;
- Auditoria.

---

# 4. Arquitetura

## 4.1 Arquitetura proposta

```text
                         INTERNET
                            │
                            ▼
                    ┌───────────────┐
                    │   Next.js     │
                    │ Landing Page  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Backend API │
                    │    Next.js    │
                    └───────┬───────┘
                            │
             ┌──────────────┼───────────────┐
             │              │               │
             ▼              ▼               ▼
       ┌──────────┐  ┌──────────────┐  ┌────────────┐
       │PostgreSQL│  │ Mercado Pago │  │Google Sheet│
       └──────────┘  └──────┬───────┘  └────────────┘
                            │
                            │ Webhook
                            ▼
                    ┌───────────────┐
                    │ POST /webhook │
                    └───────────────┘
```

---

# 5. Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Backend

Inicialmente o backend poderá utilizar as Route Handlers/API Routes do próprio Next.js.

- Node.js
- TypeScript
- Mercado Pago SDK
- Zod
- PostgreSQL
- Prisma ou Drizzle ORM

## Infraestrutura

Opção inicial:

```text
Vercel
   │
   ├── Next.js
   │
   └── API
        │
        ▼
    Supabase
        │
        └── PostgreSQL
```

Alternativamente:

```text
AWS
 │
 ├── CloudFront
 ├── ECS/Lambda
 ├── RDS PostgreSQL
 ├── Secrets Manager
 └── CloudWatch
```

Para o tamanho esperado do projeto, a primeira opção reduz bastante a complexidade operacional.

---

# 6. Modelo de domínio

As principais entidades serão:

```text
Camp
 ├── Batches
 ├── Registrations
 │      └── Payment
 └── AdminUsers
```

---

# 7. Banco de dados

## 7.1 camps

Representa o acampamento.

```sql
CREATE TABLE camps (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    max_capacity INTEGER,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

---

# 8. Batches

Permite controlar os lotes de inscrição.

Exemplo:

```text
1º Lote
R$ 200
20 vagas

2º Lote
R$ 230
30 vagas

3º Lote
R$ 250
20 vagas
```

Tabela:

```sql
CREATE TABLE batches (
    id UUID PRIMARY KEY,
    camp_id UUID NOT NULL REFERENCES camps(id),

    name VARCHAR(100) NOT NULL,

    price_cents INTEGER NOT NULL,

    capacity INTEGER NOT NULL,

    starts_at TIMESTAMP,
    ends_at TIMESTAMP,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

O valor deverá ser armazenado em centavos.

Exemplo:

```text
R$ 230,00
↓
23000
```

Isso evita problemas de precisão com `float`.

---

# 9. Registrations

Representa uma inscrição.

```sql
CREATE TABLE registrations (
    id UUID PRIMARY KEY,

    camp_id UUID NOT NULL REFERENCES camps(id),
    batch_id UUID REFERENCES batches(id),

    registration_code VARCHAR(32) UNIQUE NOT NULL,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,

    cpf VARCHAR(14),

    birth_date DATE,

    status VARCHAR(30) NOT NULL,

    amount_cents INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    paid_at TIMESTAMP
);
```

---

# 10. Status da inscrição

Estados possíveis:

```text
PENDING_PAYMENT
PAYMENT_PROCESSING
PAID
PAYMENT_FAILED
CANCELLED
REFUNDED
EXPIRED
```

Fluxo:

```text
                 ┌──────────────┐
                 │    CREATED   │
                 └──────┬───────┘
                        │
                        ▼
              ┌───────────────────┐
              │ PENDING_PAYMENT   │
              └─────────┬─────────┘
                        │
                  pagamento
                        │
              ┌─────────▼─────────┐
              │       PAID        │
              └───────────────────┘

PENDING_PAYMENT
       │
       ├── pagamento recusado → PAYMENT_FAILED
       │
       ├── cancelamento → CANCELLED
       │
       └── expiração → EXPIRED
```

---

# 11. Payments

A inscrição e o pagamento devem ser entidades separadas.

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,

    registration_id UUID NOT NULL
        REFERENCES registrations(id),

    provider VARCHAR(50) NOT NULL,

    provider_payment_id VARCHAR(100),

    provider_preference_id VARCHAR(100),

    external_reference VARCHAR(100) NOT NULL,

    amount_cents INTEGER NOT NULL,

    status VARCHAR(50) NOT NULL,

    status_detail VARCHAR(100),

    payment_method VARCHAR(100),

    raw_response JSONB,

    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    paid_at TIMESTAMP
);
```

Índices:

```sql
CREATE UNIQUE INDEX idx_payment_provider_id
ON payments(provider, provider_payment_id);

CREATE INDEX idx_payment_external_reference
ON payments(external_reference);

CREATE INDEX idx_payment_registration
ON payments(registration_id);
```

---

# 12. Por que separar Registration e Payment?

Uma pessoa pode tentar pagar várias vezes.

Exemplo:

```text
Inscrição #A123

Pagamento #1
→ recusado

Pagamento #2
→ recusado

Pagamento #3
→ aprovado
```

Portanto:

```text
Registration
      │
      ├── Payment 1 → rejected
      ├── Payment 2 → rejected
      └── Payment 3 → approved
```

A inscrição continua sendo a mesma.

---

# 13. Mercado Pago

Será utilizado o **Checkout Pro**.

O Checkout Pro permite criar uma `preference` através da API e obter um `init_point`, que é a URL utilizada para levar o participante ao ambiente de pagamento do Mercado Pago.

A criação da preferência deverá ocorrer **somente no backend**.

O Access Token do Mercado Pago nunca deverá ser enviado ao frontend.

---

# 14. Fluxo de inscrição

## Passo 1 — usuário envia formulário

```http
POST /api/v1/registrations
```

Body:

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

# 15. Backend cria inscrição

O backend deverá:

1. validar os dados;
2. verificar se o acampamento está ativo;
3. identificar o lote atual;
4. verificar disponibilidade de vagas;
5. reservar a vaga;
6. criar a inscrição;
7. criar o pagamento;
8. criar a Preference no Mercado Pago;
9. salvar os IDs retornados;
10. retornar a URL de pagamento.

---

# 16. Controle de concorrência de vagas

Esse ponto é importante.

Não fazer:

```text
SELECT vagas
IF vagas > 0
INSERT
```

sem transação.

Duas pessoas podem acessar simultaneamente.

Exemplo:

```text
10 vagas restantes

Pessoa A → verifica → 10
Pessoa B → verifica → 10

A → reserva
B → reserva

Resultado:
9 vagas deveriam existir
mas o sistema pode contabilizar errado
```

Deverá ser utilizada uma transação com lock/controle atômico.

Uma abordagem:

```sql
UPDATE batches
SET reserved_count = reserved_count + 1
WHERE id = $1
  AND reserved_count < capacity;
```

Se:

```text
rows_affected = 1
```

a reserva foi realizada.

Se:

```text
rows_affected = 0
```

não há vaga.

---

# 17. Reserva de vaga

A vaga deverá possuir uma janela de reserva.

Exemplo:

```text
registration created
       ↓
PENDING_PAYMENT
       ↓
vaga reservada por 30 minutos
       ↓
pagamento
       ↓
PAID
```

Caso o pagamento não ocorra:

```text
PENDING_PAYMENT
       ↓
expires
       ↓
EXPIRED
       ↓
vaga liberada
```

O período deverá ser configurável.

---

# 18. Criação da Preference

O backend fará uma chamada:

```http
POST https://api.mercadopago.com/checkout/preferences
```

Com:

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

A API do Mercado Pago exige o Access Token no backend e a criação da Preference retorna um identificador e o `init_point`.

Payload conceitual:

```json
{
  "items": [
    {
      "title": "Acampamento 2026",
      "quantity": 1,
      "unit_price": 230
    }
  ],
  "payer": {
    "name": "João",
    "email": "joao@email.com"
  },
  "external_reference": "REG-A83F21",
  "back_urls": {
    "success": "https://camp.example.com/pagamento/sucesso",
    "failure": "https://camp.example.com/pagamento/erro",
    "pending": "https://camp.example.com/pagamento/pendente"
  }
}
```

A documentação do Mercado Pago permite utilizar `external_reference`, que será fundamental para relacionar a transação à inscrição. A Preference também permite configurar informações do comprador, itens e URLs de retorno.

---

# 19. External Reference

O campo:

```text
external_reference
```

deverá conter o identificador interno da inscrição.

Exemplo:

```text
REG-A83F21
```

Assim:

```text
Sistema
Registration:
REG-A83F21

       ↓

Mercado Pago
external_reference:
REG-A83F21
```

Isso facilita a reconciliação.

Nunca utilizar:

```text
nome
email
telefone
CPF
```

como identificador principal.

---

# 20. Response do endpoint de inscrição

O backend poderá retornar:

```json
{
  "registrationId": "a83f21",
  "registrationCode": "REG-A83F21",
  "status": "PENDING_PAYMENT",
  "paymentUrl": "https://www.mercadopago.com.br/checkout/v1/redirect..."
}
```

O frontend então redireciona:

```javascript
window.location.href = paymentUrl;
```

---

# 21. Endpoint

## POST /api/v1/registrations

### Request

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birthDate": "2000-01-01"
}
```

### Response 201

```json
{
  "id": "uuid",
  "code": "REG-A83F21",
  "status": "PENDING_PAYMENT",
  "paymentUrl": "https://..."
}
```

---

# 22. Idempotência

O endpoint de criação deverá suportar idempotência.

Header:

```http
Idempotency-Key: 8a9f2c...
```

Isso evita:

```text
usuário clica duas vezes
        ↓
2 requests
        ↓
2 inscrições
        ↓
2 cobranças
```

O backend deverá retornar a mesma inscrição quando receber a mesma chave de idempotência.

---

# 23. Webhook do Mercado Pago

Endpoint:

```http
POST /api/v1/webhooks/mercadopago
```

URL de produção:

```text
https://camp.example.com/api/v1/webhooks/mercadopago
```

O Mercado Pago recomenda Webhooks para receber atualizações e disponibiliza uma assinatura secreta para validar a autenticidade da notificação.

---

# 24. Configuração do Webhook

No painel de desenvolvedores do Mercado Pago:

```text
Suas integrações
      ↓
Aplicação
      ↓
Webhooks
      ↓
Configurar notificações
      ↓
URL HTTPS
```

Deverá ser habilitado o evento relacionado a pagamentos utilizado pela integração.

O Mercado Pago informa que, para Checkout Pro, o tópico `payments` é utilizado para manter o backend atualizado sobre alterações nos pagamentos.

---

# 25. Exemplo de Webhook

O Mercado Pago envia uma notificação contendo informações do recurso alterado.

Exemplo conceitual:

```json
{
  "action": "payment.updated",
  "api_version": "v1",
  "application_id": "123456",
  "date_created": "2026-09-21T18:00:00Z",
  "id": "123456789",
  "live_mode": true,
  "type": "payment",
  "user_id": 123456,
  "data": {
    "id": "123456789"
  }
}
```

O `data.id` deverá ser utilizado para buscar o pagamento diretamente na API do Mercado Pago.

---

# 26. Regra mais importante do Webhook

**Nunca confiar apenas no body do Webhook para marcar uma inscrição como paga.**

Fluxo correto:

```text
Webhook
   ↓
validar assinatura
   ↓
extrair payment_id
   ↓
GET /v1/payments/{payment_id}
   ↓
Mercado Pago
   ↓
verificar status real
   ↓
validar valor
   ↓
validar external_reference
   ↓
atualizar banco
```

A API do Mercado Pago disponibiliza `GET /v1/payments/{id}` para consultar o pagamento e confirmar seu estado.

---

# 27. Validação de segurança

O webhook deverá validar:

```text
x-signature
```

O Mercado Pago utiliza uma assinatura HMAC para validar a origem das notificações.

Fluxo:

```text
Webhook recebido
       ↓
ler x-signature
       ↓
extrair ts
       ↓
extrair v1
       ↓
construir manifest
       ↓
HMAC-SHA256
       ↓
comparar assinatura
       ↓
válido?
   │
   ├── NÃO → 401
   │
   └── SIM → processar
```

A chave secreta do Webhook deverá ficar em:

```text
MERCADOPAGO_WEBHOOK_SECRET
```

Nunca no frontend.

---

# 28. Idempotência do Webhook

O Mercado Pago pode enviar notificações repetidas.

Portanto:

```text
Webhook 1
Webhook 2
Webhook 3
```

não podem gerar três processamentos.

Criar tabela:

```sql
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY,

    provider VARCHAR(50) NOT NULL,

    event_id VARCHAR(255) NOT NULL,

    event_type VARCHAR(100),

    payload JSONB,

    processed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL,

    processed_at TIMESTAMP
);
```

Índice:

```sql
CREATE UNIQUE INDEX idx_webhook_event_unique
ON webhook_events(provider, event_id);
```

Se o evento já existir:

```text
return HTTP 200
```

sem executar novamente a lógica de negócio.

---

# 29. Processamento do pagamento

Depois da validação:

```text
payment_id
      ↓
GET Mercado Pago
      ↓
payment.status
      ↓
switch
```

Estados relevantes:

```text
approved
pending
rejected
cancelled
refunded
```

Mapeamento:

| Mercado Pago | Sistema |
|---|---|
| approved | PAID |
| pending | PENDING_PAYMENT |
| rejected | PAYMENT_FAILED |
| cancelled | CANCELLED |
| refunded | REFUNDED |

---

# 30. Validação do pagamento

Antes de marcar como `PAID`, validar:

### 1. Status

```text
payment.status === "approved"
```

### 2. Valor

```text
payment.transaction_amount
==
registration.amount
```

### 3. Referência

```text
payment.external_reference
==
registration.registration_code
```

### 4. Moeda

```text
payment.currency_id === "BRL"
```

### 5. Payment ID

Não pode estar associado a outra inscrição.

---

# 31. Transação de confirmação

A confirmação deverá ocorrer em uma transação:

```text
BEGIN

UPDATE payments
SET status = 'approved',
    paid_at = NOW()

UPDATE registrations
SET status = 'PAID',
    paid_at = NOW()

COMMIT
```

Se qualquer operação falhar:

```text
ROLLBACK
```

---

# 32. Webhook response

Depois de aceitar e registrar o evento:

```http
HTTP 200
```

ou:

```http
HTTP 201
```

O endpoint deverá ser rápido.

Não executar dentro do request:

```text
Google Sheets
email
processamento pesado
```

se isso puder atrasar a resposta.

---

# 33. Arquitetura assíncrona recomendada

Uma evolução seria:

```text
Mercado Pago
      ↓
Webhook
      ↓
API
      ↓
Salvar evento
      ↓
Queue
      ↓
Worker
      ├── atualizar pagamento
      ├── atualizar inscrição
      ├── Google Sheets
      └── enviar confirmação
```

Para a primeira versão, pode ser síncrono, mas a arquitetura deverá permitir essa evolução.

---

# 34. Endpoints públicos

## GET /api/v1/camp

Retorna informações do acampamento.

```json
{
  "name": "Acampamento 2026",
  "location": "...",
  "startDate": "...",
  "endDate": "...",
  "availableSpots": 17,
  "currentBatch": {
    "name": "2º Lote",
    "price": 230
  }
}
```

---

## POST /api/v1/registrations

Cria inscrição e pagamento.

```text
POST /api/v1/registrations
```

---

## GET /api/v1/registrations/{code}

Consulta uma inscrição.

```text
GET /api/v1/registrations/REG-A83F21
```

Response:

```json
{
  "code": "REG-A83F21",
  "status": "PAID",
  "name": "João Silva",
  "payment": {
    "status": "approved",
    "paidAt": "2026-09-21T18:30:00Z"
  }
}
```

---

## GET /api/v1/registrations/{code}/payment

Consulta status do pagamento.

```text
GET /api/v1/registrations/REG-A83F21/payment
```

---

# 35. Endpoint de Webhook

```text
POST /api/v1/webhooks/mercadopago
```

Esse endpoint não deverá exigir autenticação tradicional de usuário.

A autenticação será feita pela assinatura do Mercado Pago.

---

# 36. Endpoints administrativos

Todos exigem autenticação.

```text
GET    /api/v1/admin/registrations
GET    /api/v1/admin/registrations/{id}
PATCH  /api/v1/admin/registrations/{id}

GET    /api/v1/admin/payments
GET    /api/v1/admin/dashboard

GET    /api/v1/admin/batches
POST   /api/v1/admin/batches
PATCH  /api/v1/admin/batches/{id}

GET    /api/v1/admin/camp
PATCH  /api/v1/admin/camp
```

---

# 37. Dashboard

Endpoint:

```text
GET /api/v1/admin/dashboard
```

Response:

```json
{
  "registrations": {
    "total": 87,
    "paid": 72,
    "pending": 10,
    "cancelled": 5
  },

  "revenue": {
    "paidCents": 1656000,
    "pendingCents": 230000
  },

  "capacity": {
    "total": 100,
    "reserved": 75,
    "available": 25
  }
}
```

---

# 38. Listagem administrativa

```http
GET /api/v1/admin/registrations
```

Query parameters:

```text
?page=1
&limit=20
&status=PAID
&batchId=...
&search=joao
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 87
  }
}
```

---

# 39. Autenticação administrativa

O participante não precisa de conta.

Somente administradores terão autenticação.

Opções:

```text
Supabase Auth
```

ou:

```text
AWS Cognito
```

Para MVP:

```text
Supabase Auth
```

é suficiente.

Roles:

```text
ADMIN
STAFF
```

---

# 40. Google Sheets

A planilha deverá ser uma projeção dos dados do sistema.

Exemplo:

```text
ID
Nome
Email
WhatsApp
CPF
Lote
Valor
Status
Payment ID
Data inscrição
Data pagamento
```

---

# 41. Sincronização com Google Sheets

Não fazer:

```text
Webhook
   ↓
Google Sheets
```

como única persistência.

O correto:

```text
Webhook
   ↓
Database
   ↓
Google Sheets
```

Se o Google Sheets estiver indisponível:

```text
Database = correto

Sheets = temporariamente atrasado
```

O sistema poderá tentar novamente.

---

# 42. Estratégia de sincronização

Criar:

```sql
sheet_sync_status
```

ou utilizar uma fila.

Exemplo:

```text
Registration PAID
       ↓
database atualizado
       ↓
sync event
       ↓
Google Sheets
       ↓
success
```

Se falhar:

```text
retry 1
retry 2
retry 3
```

---

# 43. Reconciliação de pagamentos

Além do Webhook, deverá existir um mecanismo de reconciliação.

Motivo:

```text
Webhook pode falhar
```

Exemplo:

```text
Pagamento aprovado
       ↓
Webhook não chegou
       ↓
Sistema continua PENDING
```

Um job periódico deverá procurar:

```text
PENDING_PAYMENT
```

e consultar pagamentos recentes no Mercado Pago.

A API disponibiliza pesquisa de pagamentos por `external_reference`, status e data.

Fluxo:

```text
Cron
 ↓
buscar pending
 ↓
consultar Mercado Pago
 ↓
encontrou approved?
 ↓
atualizar
```

Intervalo sugerido:

```text
a cada 5 minutos
```

---

# 44. Expiração de inscrição

Job:

```text
POST /internal/jobs/expire-registrations
```

ou cron externo.

Busca:

```sql
WHERE status = 'PENDING_PAYMENT'
AND payment_expires_at < NOW()
```

Atualiza:

```text
PENDING_PAYMENT
       ↓
EXPIRED
```

E libera a vaga.

---

# 45. Segurança

## Nunca expor

```text
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
DATABASE_URL
GOOGLE_SERVICE_ACCOUNT
```

no frontend.

Todos deverão estar em:

```text
Environment Variables
```

ou:

```text
Secrets Manager
```

---

# 46. LGPD

Como o sistema armazenará dados pessoais, deverá aplicar minimização.

Dados:

```text
Nome
CPF
Email
Telefone
Data nascimento
```

deverão ser armazenados somente se necessários para o funcionamento do evento.

O painel deverá limitar acesso a dados sensíveis.

CPF não deverá aparecer completo na listagem:

```text
***.***.***-42
```

---

# 47. Logs

Não registrar:

```text
CPF completo
Access Token
Webhook Secret
dados sensíveis desnecessários
```

Pode registrar:

```text
registration_id
payment_id
event_id
status
timestamp
request_id
```

Exemplo:

```text
INFO payment_updated
registration=REG-A83F21
payment=123456789
status=approved
```

---

# 48. Auditoria

Criar:

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,

    actor_type VARCHAR(30),

    actor_id UUID,

    action VARCHAR(100),

    entity_type VARCHAR(100),

    entity_id UUID,

    metadata JSONB,

    created_at TIMESTAMP NOT NULL
);
```

Exemplos:

```text
ADMIN_CREATED_BATCH
ADMIN_UPDATED_BATCH
PAYMENT_APPROVED
REGISTRATION_CANCELLED
PAYMENT_REFUNDED
```

---

# 49. Tratamento de erros

Padrão:

```json
{
  "error": {
    "code": "REGISTRATION_CLOSED",
    "message": "As inscrições estão encerradas."
  }
}
```

Códigos:

```text
INVALID_REQUEST
REGISTRATION_CLOSED
NO_SLOTS_AVAILABLE
BATCH_EXPIRED
REGISTRATION_NOT_FOUND
PAYMENT_NOT_FOUND
PAYMENT_CREATION_FAILED
PAYMENT_ALREADY_PAID
UNAUTHORIZED
FORBIDDEN
INTERNAL_ERROR
```

---

# 50. Fluxo completo

## Inscrição

```text
USER
 │
 │ POST /registrations
 ▼
API
 │
 ├── valida dados
 │
 ├── verifica lote
 │
 ├── reserva vaga
 │
 ├── cria Registration
 │
 ├── cria Preference
 │
 └── salva Payment
 │
 ▼
return init_point
 │
 ▼
USER
 │
 ▼
MERCADO PAGO
 │
 │ pagamento
 ▼
MERCADO PAGO
 │
 │ webhook
 ▼
API
 │
 ├── valida x-signature
 │
 ├── registra evento
 │
 ├── GET /v1/payments/{id}
 │
 ├── valida status
 │
 ├── valida valor
 │
 ├── valida external_reference
 │
 └── atualiza banco
 │
 ▼
Registration = PAID
 │
 ├── Google Sheets
 │
 └── Dashboard
```

---

# 51. Fluxo de falha

```text
User
 ↓
Registration
 ↓
Preference
 ↓
Mercado Pago
 ↓
Pagamento rejeitado
 ↓
Webhook
 ↓
PAYMENT_FAILED
```

O usuário poderá tentar novamente.

Uma nova Preference poderá ser criada para a mesma Registration.

---

# 52. Fluxo de pagamento duplicado

Se por algum motivo dois pagamentos forem aprovados:

```text
Registration A

Payment 1 → approved
Payment 2 → approved
```

O sistema deverá detectar:

```text
registration.status == PAID
```

e não alterar novamente a inscrição.

O segundo pagamento deverá ser marcado para análise administrativa.

Nunca assumir automaticamente que pagamentos duplicados são válidos.

---

# 53. Fluxo de cancelamento

Administrador:

```text
Dashboard
 ↓
Registration
 ↓
Cancelar inscrição
```

Endpoint:

```http
POST /api/v1/admin/registrations/{id}/cancel
```

O sistema deverá:

```text
verificar status

PENDING
 ↓
CANCELLED
 ↓
liberar vaga
```

Se:

```text
PAID
```

o cancelamento deverá ser tratado como processo separado, pois pode envolver reembolso no Mercado Pago.

---

# 54. Reembolso

O reembolso não deverá ser tratado simplesmente como:

```text
status = CANCELLED
```

Deverá existir:

```text
REFUND_REQUESTED
REFUNDED
REFUND_FAILED
```

Isso permite futuramente integrar a API de reembolso do Mercado Pago.

---

# 55. Estados do sistema

```text
                    ┌───────────────┐
                    │ PENDING       │
                    │ PAYMENT       │
                    └───────┬───────┘
                            │
                 ┌──────────┼──────────┐
                 │          │          │
                 ▼          ▼          ▼
              PAID      REJECTED    EXPIRED
                 │
                 ▼
             REFUNDED
```

---

# 56. Observabilidade

Métricas:

```text
registrations_created
payments_created
payments_approved
payments_rejected
webhooks_received
webhooks_failed
webhooks_duplicated
google_sheet_sync_failed
```

Alertas:

```text
Webhook failure rate > X%
Payment creation failure > X%
Google Sheets sync backlog > X
```

---

# 57. Testes

## Unitários

Testar:

```text
lote atual
preço
disponibilidade
transição de status
validação de pagamento
idempotência
assinatura webhook
```

## Integration tests

Testar:

```text
POST registration
       ↓
database
       ↓
Mercado Pago mock
       ↓
payment
```

## Webhook tests

Testar:

```text
valid signature
invalid signature
duplicate event
unknown payment
wrong amount
wrong external_reference
approved
pending
rejected
```

---

# 58. Teste crítico

Este teste deverá obrigatoriamente existir:

```text
POST webhook
payment=123
status=approved

POST webhook
payment=123
status=approved

POST webhook
payment=123
status=approved
```

Resultado:

```text
1 Payment
1 Registration = PAID
1 paid_at
1 Google Sheets update
```

Nunca:

```text
3 registrations
3 sheet rows
```

---

# 59. Ambiente

## Development

```text
localhost:3000
```

Mercado Pago:

```text
Sandbox/Test
```

## Staging

```text
staging.camp.example.com
```

## Production

```text
camp.example.com
```

---

# 60. Variáveis de ambiente

```env
DATABASE_URL=

MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=

GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=

ADMIN_AUTH_SECRET=
```

---

# 61. Estrutura do projeto

```text
src/
│
├── app/
│   ├── page.tsx
│   │
│   ├── inscricao/
│   │   └── page.tsx
│   │
│   ├── pagamento/
│   │   ├── sucesso/
│   │   ├── pendente/
│   │   └── erro/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── inscricoes/
│   │   ├── pagamentos/
│   │   └── lotes/
│   │
│   └── api/
│       └── v1/
│           ├── camp/
│           ├── registrations/
│           ├── payments/
│           ├── admin/
│           └── webhooks/
│               └── mercadopago/
│
├── modules/
│   ├── registrations/
│   ├── payments/
│   ├── mercadopago/
│   ├── batches/
│   ├── sheets/
│   └── authentication/
│
├── lib/
│   ├── database.ts
│   ├── mercadopago.ts
│   ├── logger.ts
│   └── auth.ts
│
└── jobs/
    ├── reconcile-payments.ts
    └── expire-registrations.ts
```

---

# 62. Responsabilidades dos módulos

## RegistrationService

```text
createRegistration()
getRegistration()
cancelRegistration()
expireRegistration()
```

## PaymentService

```text
createPayment()
getPayment()
processWebhook()
reconcilePayment()
```

## MercadoPagoService

```text
createPreference()
getPayment()
searchPayments()
```

## BatchService

```text
getCurrentBatch()
reserveSlot()
releaseSlot()
```

## GoogleSheetsService

```text
createRow()
updateRow()
syncRegistration()
```

---

# 63. Princípios arquiteturais

O sistema deverá seguir:

### Database first

O banco da aplicação é a fonte de verdade.

### Mercado Pago como payment provider

Mercado Pago é responsável pela transação.

### Webhook como evento

Webhook dispara processamento.

### API do Mercado Pago como confirmação

O sistema consulta o pagamento antes de marcar como `PAID`.

### Idempotência

Todas as operações críticas deverão ser idempotentes.

### Async where possible

Integrações secundárias não devem bloquear o fluxo crítico.

---

# 64. Fluxo ideal para o usuário

```text
LANDING PAGE
      │
      ▼
"INSCREVA-SE"
      │
      ▼
FORMULÁRIO
      │
      ▼
"CONTINUAR"
      │
      ▼
RESERVA DA VAGA
      │
      ▼
CRIAÇÃO DO PAGAMENTO
      │
      ▼
MERCADO PAGO
      │
      ▼
PAGAMENTO
      │
      ▼
"Pagamento recebido"
      │
      ▼
INSCRIÇÃO CONFIRMADA
```

---

# 65. Fluxo ideal para o administrador

```text
LOGIN
 │
 ▼
DASHBOARD
 │
 ├── 87 inscritos
 ├── 72 pagos
 ├── 10 pendentes
 ├── 5 cancelados
 │
 ├── R$ 16.560 recebidos
 │
 └── 25 vagas disponíveis
```

Depois:

```text
INSCRITOS
 │
 ├── Todos
 ├── Pagos
 ├── Pendentes
 ├── Cancelados
 └── Buscar
```

---

# 66. Ordem de implementação

## Fase 1 — Base

- Next.js
- Banco
- Schema
- Migrations
- Authentication
- Camp

## Fase 2 — Inscrição

- Formulário
- Validation
- Registration API
- Controle de vagas
- Lotes

## Fase 3 — Mercado Pago

- Mercado Pago App
- Access Token
- Preference
- `external_reference`
- `init_point`
- Redirects

## Fase 4 — Webhook

- Endpoint
- Signature validation
- Payment lookup
- Idempotency
- Status transitions

## Fase 5 — Admin

- Dashboard
- Inscritos
- Pagamentos
- Lotes
- Vagas

## Fase 6 — Google Sheets

- Service Account
- Sync
- Retry
- Reconciliação

## Fase 7 — Jobs

- Expiração
- Reconciliação
- Limpeza
- Alertas

---

# 67. Critérios de aceite

O projeto será considerado funcional quando:

### Inscrição

- [ ] Usuário consegue realizar inscrição.
- [ ] Dados são persistidos.
- [ ] Vaga é reservada.
- [ ] Lote correto é aplicado.

### Pagamento

- [ ] Preference é criada.
- [ ] Usuário recebe `init_point`.
- [ ] Usuário consegue pagar.
- [ ] Payment ID é armazenado.

### Webhook

- [ ] Webhook é recebido.
- [ ] Assinatura é validada.
- [ ] Payment é consultado no Mercado Pago.
- [ ] Status é atualizado.
- [ ] Eventos duplicados não geram duplicidade.

### Administração

- [ ] Admin consegue visualizar inscrições.
- [ ] Admin consegue filtrar.
- [ ] Admin consegue visualizar pagamentos.
- [ ] Dashboard apresenta números corretos.

### Planilha

- [ ] Inscrição aparece na planilha.
- [ ] Pagamento aprovado atualiza a linha.
- [ ] Falha na planilha não perde a inscrição.

---

# 68. Decisão arquitetural principal

A regra central do sistema será:

```text
                 ┌────────────────────┐
                 │    POST /register  │
                 └─────────┬──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    └──────┬───────┘
                           │
                           ▼
                    Mercado Pago
                           │
                           ▼
                       Webhook
                           │
                           ▼
                    GET Payment
                           │
                    ┌──────┴──────┐
                    │             │
                 approved      not approved
                    │             │
                    ▼             ▼
                  PAID          PENDING/
                                FAILED
                    │
                    ▼
               Google Sheets
```

O **redirect do Mercado Pago não será utilizado como confirmação definitiva do pagamento**.

O participante pode retornar à página de sucesso mesmo antes de o backend ter processado a confirmação. A confirmação oficial deverá ocorrer pelo processamento do pagamento recebido através do Webhook e pela consulta à API do Mercado Pago.

---

# 69. Resultado esperado

Ao final, teremos três sistemas integrados:

```text
┌──────────────────────────────────────┐
│             PARTICIPANTE             │
│                                      │
│ Landing → Inscrição → Mercado Pago   │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│               BACKEND                │
│                                      │
│ Registration                         │
│ Payment                              │
│ Webhook                              │
│ Database                             │
│ Reconciliation                       │
└───────────────┬───────────┬──────────┘
                │           │
                ▼           ▼
       ┌──────────────┐  ┌──────────────┐
       │    ADMIN     │  │ Google Sheet │
       │   Dashboard  │  │              │
       └──────────────┘  └──────────────┘
```

A arquitetura é suficientemente simples para um acampamento, mas já possui os mecanismos necessários para evitar os principais problemas de uma plataforma de inscrição com pagamento: cobrança duplicada, pagamento sem confirmação, webhook duplicado, perda de vaga e divergência entre banco e planilha.