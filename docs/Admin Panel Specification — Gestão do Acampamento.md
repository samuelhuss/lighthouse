# Admin Panel Specification

## Plataforma de Inscrição e Pagamento — Acampamento

**Versão:** 1.0  
**Data:** 21/09/2026  
**Relacionamento:** Complementa `01-SDD.md`, `02-TECHNICAL-IMPLEMENTATION.md` e `03-FRONTEND-SPEC.md`  
**Status:** Ready for Implementation

---

# 1. Objetivo

O Admin Panel será utilizado pela organização para acompanhar e administrar:

- inscrições;
- pagamentos;
- lotes;
- capacidade;
- participantes;
- receita;
- status de pagamento;
- sincronização com Google Sheets.

O painel não deverá permitir alterações que contornem as regras financeiras ou de capacidade sem uma ação administrativa explícita e auditada.

---

# 2. Estrutura

```text
/admin
│
├── /login
│
├── /                    Dashboard
│
├── /inscricoes
│
├── /inscricoes/[id]
│
├── /pagamentos
│
├── /lotes
│
└── /configuracoes
```

---

# 3. Layout

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ LOGO                                  Admin   [Avatar]  │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│ Dashboard    │                                          │
│ Inscrições   │              CONTENT                     │
│ Pagamentos   │                                          │
│ Lotes        │                                          │
│ Config.      │                                          │
│              │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

Mobile:

```text
HEADER
   ↓
CONTENT
   ↓
BOTTOM/NAV MENU
```

---

# 4. Autenticação

O acesso deverá exigir autenticação.

Fluxo:

```text
/admin
   ↓
authenticated?
   │
   ├── NÃO → /admin/login
   │
   └── SIM → dashboard
```

---

# 5. Autorização

Roles iniciais:

```text
ADMIN
```

Futura possibilidade:

```text
ADMIN
OPERATOR
FINANCE
VIEWER
```

O backend deverá validar autorização.

Não confiar somente no frontend.

---

# 6. Dashboard

Rota:

```text
/admin
```

Mostrar:

```text
┌────────────────────────────────────────────────────┐
│ INSCRIÇÕES                                         │
│                                                    │
│ 87                 72              10              │
│ Total              Pagas           Pendentes       │
│                                                    │
├────────────────────────────────────────────────────┤
│ CAPACIDADE                                         │
│                                                    │
│ ███████████████░░░░░░ 72 / 100                    │
│                                                    │
├────────────────────────────────────────────────────┤
│ RECEITA                                            │
│                                                    │
│ R$ 16.560,00                                       │
│                                                    │
├────────────────────────────────────────────────────┤
│ ÚLTIMAS INSCRIÇÕES                                 │
│                                                    │
│ João Silva       PAID       R$ 230                │
│ Maria Souza      PAID       R$ 230                │
│ Pedro Santos     PENDING    R$ 230                │
└────────────────────────────────────────────────────┘
```

---

# 7. KPIs

Cards:

```text
Total de inscritos
Pagamentos confirmados
Pagamentos pendentes
Vagas disponíveis
Receita confirmada
```

Opcional:

```text
Inscrições hoje
Pagamentos hoje
Ticket médio
```

---

# 8. Dashboard — Dados

Endpoint:

```http
GET /api/v1/admin/dashboard
```

O frontend não deverá calcular receita diretamente a partir de todas as inscrições.

O backend deverá retornar os agregados.

---

# 9. Lista de inscrições

Rota:

```text
/admin/inscricoes
```

Tabela:

```text
┌──────────┬───────────────┬────────────┬──────────┬───────────┐
│ Código   │ Participante  │ Lote       │ Status   │ Valor     │
├──────────┼───────────────┼────────────┼──────────┼───────────┤
│ REG001   │ João Silva    │ 1º Lote    │ PAID     │ R$ 230    │
│ REG002   │ Maria Souza   │ 1º Lote    │ PAID     │ R$ 230    │
│ REG003   │ Pedro Santos  │ 2º Lote    │ PENDING  │ R$ 270    │
└──────────┴───────────────┴────────────┴──────────┴───────────┘
```

---

# 10. Filtros

Filtros:

```text
Status
Lote
Data
Nome
E-mail
Código
```

Status:

```text
Todos
Pendente
Pago
Falhou
Cancelado
Expirado
Reembolsado
```

---

# 11. Busca

Campo:

```text
Buscar participante...
```

Buscar por:

```text
nome
email
registrationCode
```

Não fazer busca somente no frontend.

Utilizar:

```http
GET /api/v1/admin/registrations?search=joao
```

---

# 12. Paginação

Default:

```text
20 registros
```

Opções:

```text
20
50
100
```

Backend:

```text
page
limit
```

---

# 13. Ordenação

Default:

```text
mais recentes primeiro
```

Possíveis:

```text
createdAt
name
status
amount
paidAt
```

---

# 14. Detalhes da inscrição

Rota:

```text
/admin/inscricoes/[id]
```

Layout:

```text
┌──────────────────────────────────────────┐
│ REG-A83F21                 PAID           │
├──────────────────────────────────────────┤
│ PARTICIPANTE                             │
│                                          │
│ João Silva                               │
│ joao@email.com                            │
│ (11) 99999-9999                           │
│ CPF: ***.***.***-**                       │
│                                          │
├──────────────────────────────────────────┤
│ INSCRIÇÃO                                │
│                                          │
│ 1º Lote                                  │
│ R$ 230,00                                │
│ 21/09/2026                               │
│                                          │
├──────────────────────────────────────────┤
│ PAGAMENTO                                │
│                                          │
│ Status: APPROVED                         │
│ Payment ID: 123456789                    │
│                                          │
└──────────────────────────────────────────┘
```

---

# 15. Dados sensíveis

CPF deverá ser mascarado na listagem:

```text
***.***.***-12
```

No detalhe, mostrar somente para usuários autorizados.

Não colocar CPF em:

- URL;
- logs;
- analytics;
- query string.

---

# 16. Status visual

Utilizar badges.

Exemplo:

```text
PAID
PENDING
FAILED
CANCELLED
EXPIRED
REFUNDED
```

As cores devem possuir significado consistente, mas não devem ser a única forma de identificar o status.

---

# 17. Pagamentos

Rota:

```text
/admin/pagamentos
```

Tabela:

```text
Payment ID
Registration
Status
Valor
Método
Criado em
Pago em
```

Filtros:

```text
status
data
registration
payment method
```

---

# 18. Detalhe do pagamento

Mostrar:

```text
Provider
Payment ID
Preference ID
External Reference
Valor
Status
Status Detail
Payment Method
Created At
Paid At
```

Não mostrar:

```text
Access Token
Webhook Secret
credenciais
```

---

# 19. Relação inscrição ↔ pagamento

Na tela da inscrição:

```text
REG-A83F21

Inscrição
     │
     ▼
Payment
     │
     ├── Preference ID
     ├── Payment ID
     ├── Status
     └── Valor
```

Se houver mais de uma tentativa de pagamento, mostrar histórico.

---

# 20. Histórico de pagamentos

Exemplo:

```text
Tentativa 1
REJECTED
21/09 18:10
R$ 230

Tentativa 2
APPROVED
21/09 18:15
R$ 230
```

O sistema não deverá apagar tentativas anteriores.

---

# 21. Lotes

Rota:

```text
/admin/lotes
```

Tabela:

```text
┌────────────┬──────────┬───────────┬───────────┬──────────┐
│ Lote       │ Preço    │ Capacidade│ Ocupadas  │ Status   │
├────────────┼──────────┼───────────┼───────────┼──────────┤
│ 1º Lote    │ R$ 230   │ 50        │ 50        │ ESGOTADO │
│ 2º Lote    │ R$ 270   │ 50        │ 22        │ ATIVO    │
└────────────┴──────────┴───────────┴───────────┴──────────┘
```

---

# 22. Criar lote

Form:

```text
Nome
Preço
Capacidade
Início
Fim
Ativo
```

Exemplo:

```json
{
  "name": "2º Lote",
  "priceCents": 27000,
  "capacity": 50,
  "startsAt": "2026-10-01T00:00:00Z",
  "endsAt": "2026-10-20T23:59:59Z",
  "active": true
}
```

---

# 23. Alteração de lote

Administradores poderão:

```text
alterar nome
alterar preço
alterar período
ativar/desativar
```

Alterar capacidade para um valor inferior ao número de vagas já ocupadas deverá ser bloqueado.

Exemplo:

```text
capacidade = 50
ocupadas = 43
```

Não permitir:

```text
nova capacidade = 30
```

---

# 24. Ações administrativas

Ações permitidas:

```text
visualizar inscrição
cancelar inscrição
alterar dados administrativos
visualizar pagamento
```

Ações financeiras críticas deverão ser tratadas com cuidado.

---

# 25. Cancelamento

Ao cancelar uma inscrição:

```text
PAID
```

não simplesmente alterar para:

```text
CANCELLED
```

sem registrar motivo.

Registrar:

```text
actor
timestamp
reason
previous status
new status
```

Criar:

```text
AuditLog
```

---

# 26. Alteração manual de pagamento

O painel não deverá possuir um botão genérico:

```text
[ MARCAR COMO PAGO ]
```

sem confirmação e auditoria.

Se houver necessidade operacional, criar fluxo específico:

```text
[ Registrar pagamento manual ]
```

Solicitar:

```text
motivo
método
valor
observação
```

Registrar tudo em `AuditLog`.

---

# 27. Auditoria

Registrar:

```text
LOGIN
REGISTRATION_CANCELLED
REGISTRATION_UPDATED
BATCH_CREATED
BATCH_UPDATED
BATCH_DISABLED
MANUAL_PAYMENT
```

Exemplo:

```json
{
  "actorType": "ADMIN",
  "actorId": "user-id",
  "action": "REGISTRATION_CANCELLED",
  "entityType": "REGISTRATION",
  "entityId": "registration-id",
  "metadata": {
    "reason": "Solicitação do participante"
  }
}
```

---

# 28. Exportação

Adicionar:

```text
[ EXPORTAR ]
```

Formatos:

```text
CSV
```

Opcionalmente:

```text
XLSX
```

Filtros aplicados deverão ser respeitados.

Exemplo:

```text
Status = PAID
Lote = 2º
```

exporta somente os registros filtrados.

---

# 29. Google Sheets

O Admin Panel não precisa editar diretamente a planilha.

A fonte oficial continua sendo:

```text
PostgreSQL
```

O painel poderá mostrar:

```text
Última sincronização
Sincronização OK
Sincronização pendente
Erro de sincronização
```

---

# 30. Indicador de sincronização

Exemplo:

```text
Google Sheets

✓ Sincronizado
Última sincronização: 21/09/2026 18:32
```

ou:

```text
⚠ Sincronização pendente
Último erro: timeout
```

---

# 31. Atualização automática

Dashboard poderá atualizar automaticamente a cada:

```text
30 segundos
```

ou através de:

```text
refresh manual
```

Não realizar polling agressivo.

---

# 32. Empty states

Sem inscrições:

```text
Nenhuma inscrição encontrada.
```

Sem pagamentos:

```text
Nenhum pagamento encontrado.
```

Sem lotes:

```text
Nenhum lote cadastrado.
```

---

# 33. Error states

Exemplo:

```text
Não conseguimos carregar as inscrições.

[ Tentar novamente ]
```

Não mostrar stack trace.

---

# 34. Loading states

Tabela:

```text
skeleton rows
```

Dashboard:

```text
skeleton cards
```

Botões:

```text
Salvando...
Cancelando...
Exportando...
```

---

# 35. Confirmações

Ações destrutivas ou relevantes deverão pedir confirmação.

Exemplo:

```text
Cancelar inscrição?

Essa ação irá liberar a vaga.

[ Voltar ] [ Cancelar inscrição ]
```

---

# 36. Dashboard financeiro

Mostrar somente valores confirmados em:

```text
receita
```

Definição:

```text
sum(
  payments.status = APPROVED
)
```

Pagamentos:

```text
PENDING
```

não entram na receita confirmada.

---

# 37. Métricas

Dashboard:

```text
Total de inscrições
Total pagas
Total pendentes
Total expiradas
Taxa de conversão
Receita confirmada
Ticket médio
```

A taxa de conversão deverá possuir definição clara.

Exemplo:

```text
PAID / inscrições criadas
```

---

# 38. Segurança

Rotas:

```text
/api/v1/admin/*
```

sempre protegidas no backend.

O frontend não deverá ser considerado mecanismo de segurança.

Exemplo incorreto:

```ts
if (user.role === "ADMIN") {
  renderAdmin();
}
```

sem proteção equivalente na API.

---

# 39. Session

O frontend deverá utilizar sessão autenticada.

Toda chamada administrativa deverá incluir a sessão/token necessário.

O backend valida:

```text
session
user
role
permission
```

---

# 40. Responsividade

O painel deverá funcionar em:

```text
desktop
tablet
mobile
```

Mas a experiência principal será otimizada para desktop.

---

# 41. Componentes

Estrutura:

```text
components/admin/
├── Sidebar.tsx
├── Header.tsx
├── StatCard.tsx
├── RegistrationTable.tsx
├── RegistrationFilters.tsx
├── RegistrationStatusBadge.tsx
├── PaymentTable.tsx
├── PaymentStatusBadge.tsx
├── BatchTable.tsx
├── BatchForm.tsx
├── RegistrationDetails.tsx
├── PaymentDetails.tsx
├── AuditTimeline.tsx
└── ConfirmDialog.tsx
```

---

# 42. APIs utilizadas

Dashboard:

```http
GET /api/v1/admin/dashboard
```

Inscrições:

```http
GET /api/v1/admin/registrations
GET /api/v1/admin/registrations/{id}
PATCH /api/v1/admin/registrations/{id}
```

Pagamentos:

```http
GET /api/v1/admin/payments
```

Lotes:

```http
GET /api/v1/admin/batches
POST /api/v1/admin/batches
PATCH /api/v1/admin/batches/{id}
```

---

# 43. Regra para alteração de status

O frontend não deverá enviar:

```json
{
  "status": "PAID"
}
```

e esperar que isso seja aceito.

O backend deverá possuir operações de domínio explícitas.

Exemplo:

```http
POST /api/v1/admin/registrations/{id}/cancel
```

ou:

```http
POST /api/v1/admin/payments/{id}/manual-confirmation
```

quando realmente necessário.

---

# 44. Dashboard inicial

A primeira versão deverá conter somente:

```text
Dashboard
Inscrições
Pagamentos
Lotes
```

Evitar criar funcionalidades administrativas que não tenham necessidade real.

---

# 45. Definition of Done

Admin:

- [ ] autenticação;
- [ ] autorização;
- [ ] dashboard;
- [ ] lista de inscrições;
- [ ] filtros;
- [ ] busca;
- [ ] paginação;
- [ ] detalhe da inscrição;
- [ ] pagamentos;
- [ ] detalhe do pagamento;
- [ ] lotes;
- [ ] criação de lote;
- [ ] edição de lote;
- [ ] auditoria;
- [ ] exportação CSV;
- [ ] estados de loading;
- [ ] estados de erro;
- [ ] empty states;
- [ ] responsividade;
- [ ] proteção de API.

---

# 46. Fluxo operacional

O administrador deverá conseguir realizar:

```text
LOGIN
  ↓
DASHBOARD
  ↓
ver inscrições
  ↓
filtrar PAID
  ↓
abrir participante
  ↓
ver pagamento
  ↓
ver Payment ID
  ↓
ver status
```

E:

```text
DASHBOARD
  ↓
LOTES
  ↓
ver ocupação
  ↓
criar/editar lote
```

---

# 47. Princípio principal

O Admin Panel é uma interface de operação.

Ele não substitui as regras do backend.

```text
Admin UI
   ↓
Admin API
   ↓
Domain Services
   ↓
PostgreSQL
```

Nunca:

```text
Admin UI
   ↓
UPDATE direto no banco
```

---

# 48. Visão final

```text
                         ┌─────────────────┐
                         │   ADMIN LOGIN   │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    DASHBOARD    │
                         └────────┬────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
      │ INSCRIÇÕES   │    │ PAGAMENTOS   │    │    LOTES     │
      └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                         ┌─────────────────┐
                         │   ADMIN API     │
                         └────────┬────────┘
                                  ▼
                         ┌─────────────────┐
                         │   DOMAIN        │
                         │   SERVICES      │
                         └────────┬────────┘
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         └─────────────────┘
```

O Admin Panel deverá sempre refletir o estado real do PostgreSQL e dos pagamentos confirmados pelo backend.

---

# 49. Contrato de listagens administrativas

As listagens de inscrições e pagamentos devem usar paginação no servidor. A interface não deve carregar todos os registros para filtrar ou paginar no navegador.

Parâmetros:

```text
limit  = quantidade por página (20 por padrão; máximo 100)
offset = deslocamento a partir do primeiro registro (0 por padrão)
search = busca por nome, e-mail, código ou referência
status = filtro de status
```

Exemplo:

```http
GET /api/v1/admin/registrations?limit=20&offset=40&search=joao
GET /api/v1/admin/payments?limit=20&offset=40&status=APPROVED
```

A resposta deve conter `items` e `pagination`:

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "limit": 20,
    "offset": 40,
    "total": 87
  }
}
```

Ao alterar busca, status ou tamanho da página, o frontend deve voltar para a primeira página. A navegação visual deve usar os componentes `Table` e `Pagination` de `src/components/ui`, mantendo a lógica de dados na API.

# 50. Dialogs e formulários administrativos

Criação e edição de lotes devem ocorrer em `Dialog`, usando o mesmo formulário e a mesma validação da API. O fechamento deve cancelar a edição sem alterar dados; o salvamento deve fechar o dialog somente após resposta bem-sucedida.

Componentes base obrigatórios no painel:

```text
Button, Input, Label, Select, Checkbox, Badge, Card, Table, Pagination, Dialog, Skeleton
```

# 51. Status de pagamentos

A tabela de pagamentos deve exibir dois estados independentes:

```text
Status do pagamento: PENDING, APPROVED, REJECTED, CANCELLED ou REFUNDED
Status da inscrição: PENDING_PAYMENT, PAID, EXPIRED, CANCELLED ou outro status persistido
```

Uma inscrição expirada não transforma automaticamente o pagamento em `EXPIRED`, pois `EXPIRED` pertence ao domínio da inscrição. A interface deve mostrar ambos os badges para evitar interpretar um pagamento pendente como aprovado ou uma inscrição expirada como pagamento expirado.