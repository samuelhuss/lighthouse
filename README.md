# Lighthouse

Plataforma de inscrição e pagamento para acampamento, com backend em Next.js, Prisma e integrações com Mercado Pago, Google Sheets e Supabase.

## Stack

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Mercado Pago Checkout Pro
- Supabase Auth
- Google Sheets API

## Setup inicial

1. Copie `.env.example` para `.env`.
2. Ajuste as variáveis de banco, Mercado Pago e Supabase.
3. Para banco local via Docker, suba o PostgreSQL:

```bash
docker compose up -d postgres
```

4. Gere o Prisma:

```bash
npx prisma generate
```

5. Rode as migrations:

```bash
npx prisma migrate dev --name init
```

6. Crie dados locais de teste:

```bash
npm run db:seed
```

7. Inicie o app:

```bash
npm run dev
```

## Emails com Resend

Configure `RESEND_API_KEY` e `EMAIL_FROM` no ambiente para ativar os emails transacionais. `EMAIL_REPLY_TO` é opcional.

- A criação da inscrição envia o link de pagamento.
- O pagamento aprovado envia a confirmação da vaga.
- A tela `/admin/emails` permite campanhas somente para inscritos que marcaram o consentimento de novidades.

Sem `RESEND_API_KEY`, os fluxos de inscrição e pagamento continuam funcionando, mas os emails ficam desativados. Antes de enviar em produção, valide o domínio remetente no Resend.

## Testes automatizados

```bash
npm test
npm run lint
npm run build
```

## Endpoints principais

- `GET /api/v1/camp`
- `POST /api/v1/registrations`
- `GET /api/v1/registrations/{code}`
- `GET /api/v1/registrations/{code}/payment`
- `POST /api/v1/webhooks/mercadopago`
- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/registrations`
- `GET /api/v1/admin/registrations/{id}`
- `PATCH /api/v1/admin/registrations/{id}`
- `GET /api/v1/admin/batches`
- `POST /api/v1/admin/batches`
- `PATCH /api/v1/admin/batches/{id}`
- `GET /api/v1/admin/payments`
- `GET /api/v1/admin/camp`
- `PATCH /api/v1/admin/camp`
- `POST /api/internal/jobs/expire-registrations`
- `POST /api/internal/jobs/reconcile-payments`

## Teste manual do fluxo backend

Com o app rodando em `http://localhost:3000`, confirme o camp/lote ativo:

```powershell
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/camp"
```

Crie uma inscrição. A resposta retorna a URL real do Mercado Pago em `payment.paymentUrl`:

```powershell
$body = @{
	name = "Joao Silva"
	email = "joao.teste@example.com"
	phone = "11999999999"
	cpf = "12345678900"
	birthDate = "2000-01-01"
	privacyConsent = $true
} | ConvertTo-Json

$registration = Invoke-RestMethod `
	-Method POST `
	-Uri "http://localhost:3000/api/v1/registrations" `
	-Headers @{ "Idempotency-Key" = [guid]::NewGuid().ToString() } `
	-ContentType "application/json" `
	-Body $body

$registration
$registration.payment.paymentUrl
```

Abra o valor de `payment.paymentUrl` no navegador para pagar no Checkout Pro sandbox. Depois consulte a inscrição:

```powershell
$code = $registration.registration.code
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/registrations/$code"
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/registrations/$code/payment"
```

Para receber webhooks do Mercado Pago localmente, exponha o dev server com uma URL HTTPS usando uma ferramenta como ngrok ou Cloudflare Tunnel. A URL a cadastrar no Mercado Pago será:

```text
https://<sua-url-publica>/api/v1/webhooks/mercadopago
```

Configure também:

```env
NEXT_PUBLIC_APP_URL="https://<sua-url-publica>"
```

Os jobs internos exigem `Authorization: Bearer <INTERNAL_JOBS_SECRET>`:

```powershell
$headers = @{ Authorization = "Bearer $env:INTERNAL_JOBS_SECRET" }
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/internal/jobs/expire-registrations" -Headers $headers
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/internal/jobs/reconcile-payments" -Headers $headers
```

Para executar os jobs diretamente, em um processo com acesso ao banco e às variáveis de ambiente:

```powershell
npm run jobs:expire
npm run jobs:reconcile
npm run jobs:run
```

No painel administrativo, o dashboard possui ações protegidas para executar os dois jobs sob demanda. Em produção, um scheduler externo pode chamar as rotas internas a cada 5 minutos. O scheduler deve enviar o header `Authorization` com `INTERNAL_JOBS_SECRET`; nunca exponha esse segredo no frontend.

Rotas administrativas exigem um access token válido do Supabase com role `ADMIN` ou `STAFF` em `app_metadata.roles`:

```powershell
$adminHeaders = @{ Authorization = "Bearer <SUPABASE_ACCESS_TOKEN>" }
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/v1/admin/dashboard" -Headers $adminHeaders
```

## Regras de negócio implementadas

- controle de vagas atômico por transação
- valor de inscrição salvo em centavos
- criação de cobrança via Mercado Pago
- webhook com validação e idempotência
- status de inscrição e pagamento em banco próprio
- rota administrativa com autenticação do Supabase
- jobs internos de expiração e reconciliação
- testes unitários com Vitest

## Próximos passos

1. ampliar cobertura de testes de webhook, concorrência e integração
2. implementar frontend landing page + formulário
3. sincronizar dados com Google Sheets
4. criar painel admin completo
