# Frontend Specification

## Plataforma de Inscrição e Pagamento — Acampamento

**Versão:** 1.0
**Data:** 21/09/2026
**Relacionamento:** Complementa `01-SDD.md` e `02-TECHNICAL-IMPLEMENTATION.md`
**Status:** Ready for Implementation

---

# 1. Objetivo

Este documento define a experiência pública do participante:

* Landing Page;
* apresentação do acampamento;
* informações de data e local;
* lotes e preços;
* formulário de inscrição;
* criação da inscrição;
* redirecionamento para Mercado Pago;
* acompanhamento do pagamento;
* páginas de sucesso, pendente e erro.

O frontend não deverá possuir regras críticas de negócio.

A regra oficial de:

* preço;
* lote;
* disponibilidade;
* status de pagamento;
* confirmação de inscrição;

sempre pertence ao backend.

---

# 2. Stack

```text
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
Framer Motion
React Hook Form
Zod
```

---

# 3. Estrutura

```text
app/
├── (public)/
│   ├── page.tsx
│   │
│   ├── inscricao/
│   │   └── page.tsx
│   │
│   └── pagamento/
│       ├── sucesso/
│       │   └── page.tsx
│       ├── pendente/
│       │   └── page.tsx
│       └── erro/
│           └── page.tsx
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Program.tsx
│   │   ├── Location.tsx
│   │   ├── Pricing.tsx
│   │   ├── Included.tsx
│   │   ├── FAQ.tsx
│   │   └── CTA.tsx
│   │
│   ├── registration/
│   │   ├── RegistrationForm.tsx
│   │   ├── RegistrationSummary.tsx
│   │   └── RegistrationSuccess.tsx
│   │
│   └── ui/
│
├── hooks/
│   ├── useRegistration.ts
│   └── useCamp.ts
│
└── lib/
    ├── api.ts
    ├── formatters.ts
    └── validation.ts
```

---

# 4. Experiência geral

Fluxo:

```text
LANDING
   │
   ▼
INSCRIÇÃO
   │
   ▼
FORMULÁRIO
   │
   ▼
CONFIRMAR
   │
   ▼
BACKEND
   │
   ├── vaga disponível
   ├── lote válido
   └── inscrição criada
   │
   ▼
MERCADO PAGO
   │
   ▼
PAGAMENTO
   │
   ├── sucesso
   ├── pendente
   └── erro
```

---

# 5. Landing Page

A landing page deve funcionar como página única.

Estrutura:

```text
┌───────────────────────────────────────┐
│ NAVBAR                                │
├───────────────────────────────────────┤
│                                       │
│ HERO                                  │
│                                       │
│ ACAMPAMENTO 2026                      │
│ Uma experiência para...               │
│                                       │
│ [ QUERO ME INSCREVER ]                │
│                                       │
├───────────────────────────────────────┤
│ SOBRE O ACAMPAMENTO                   │
├───────────────────────────────────────┤
│ EXPERIÊNCIA / PROGRAMAÇÃO             │
├───────────────────────────────────────┤
│ LOCAL                                 │
├───────────────────────────────────────┤
│ O QUE ESTÁ INCLUSO                    │
├───────────────────────────────────────┤
│ LOTES / PREÇOS                        │
├───────────────────────────────────────┤
│ FAQ                                   │
├───────────────────────────────────────┤
│ CTA FINAL                             │
├───────────────────────────────────────┤
│ FOOTER                                │
└───────────────────────────────────────┘
```

---

# 6. Navbar

Desktop:

```text
LOGO

Sobre
Experiência
Local
Valores
FAQ

[ INSCREVA-SE ]
```

Mobile:

```text
LOGO                         ☰
```

Menu mobile deverá ser acessível e fechar após navegação.

---

# 7. Hero

O Hero é a principal área da página.

Deve conter:

```text
ACAMPAMENTO 2026

[Título principal]

[Descrição curta]

DATA
LOCAL

[ QUERO ME INSCREVER ]
```

O botão principal deverá navegar para:

```text
/inscricao
```

ou realizar scroll para a seção de inscrição, dependendo da decisão final de UX.

---

# 8. Direção visual

A implementação deverá utilizar:

```text
design minimalista
tipografia forte
grandes espaços
fotografia como elemento principal
animações sutis
bordas discretas
alto contraste
```

Evitar:

```text
gradientes excessivos
muitos cards
animações exageradas
sombras pesadas
informação visual excessiva
```

A página deverá transmitir:

```text
experiência
natureza
comunidade
simplicidade
qualidade
```

---

# 9. Animações

Utilizar Framer Motion somente onde agregar valor.

Exemplos:

```text
Hero → fade/slide inicial
Seções → reveal on scroll
Cards → hover discreto
CTA → microinteraction
```

Não utilizar animações que prejudiquem:

* performance;
* acessibilidade;
* leitura;
* navegação mobile.

---

# 10. Seção Sobre

Conteúdo:

```text
O que é o acampamento?

Descrição da experiência.

Para quem é?

O que torna essa experiência diferente?
```

A seção deverá ser visualmente mais editorial do que um conjunto de cards.

---

# 11. Programação

Exibir os principais momentos.

Exemplo:

```text
SEXTA

18:00  Check-in
20:00  Jantar
21:30  Abertura


SÁBADO

07:30  Café
09:00  Atividades
12:30  Almoço
15:00  Atividades
19:00  Jantar


DOMINGO

08:00  Café
10:00  Encerramento
```

Os horários deverão ser configuráveis no código/conteúdo, não hardcoded dentro de múltiplos componentes.

---

# 12. Local

Mostrar:

* nome do local;
* cidade;
* descrição;
* mapa ou link externo;
* informações relevantes de acesso.

CTA:

```text
[ VER LOCALIZAÇÃO ]
```

O mapa não deve necessariamente carregar imediatamente.

Preferir:

```text
imagem/preview
      ↓
usuário interage
      ↓
mapa
```

para reduzir custo e melhorar performance.

---

# 13. O que está incluso

Exibir itens como:

```text
✓ Hospedagem
✓ Alimentação
✓ Atividades
✓ Estrutura
✓ Experiências
```

O conteúdo real será definido pelo organizador.

---

# 14. Pricing

A seção de preços deverá buscar os dados do backend.

Endpoint:

```http
GET /api/v1/camp
```

Response esperado:

```json
{
  "camp": {
    "name": "Acampamento 2026"
  },
  "currentBatch": {
    "name": "1º Lote",
    "priceCents": 23000,
    "capacity": 100,
    "reservedCount": 72,
    "available": 28
  }
}
```

O frontend deverá calcular:

```text
priceCents / 100
```

somente para apresentação.

---

# 15. Estado de disponibilidade

Se:

```text
available > 0
```

mostrar:

```text
INSCRIÇÕES ABERTAS
```

Se:

```text
available = 0
```

mostrar:

```text
LOTE ESGOTADO
```

O frontend nunca deverá assumir disponibilidade como definitiva.

Mesmo que mostre:

```text
28 vagas
```

o backend deverá validar novamente durante a inscrição.

---

# 16. Formulário

Rota:

```text
/inscricao
```

Campos:

```text
Nome completo
E-mail
WhatsApp
CPF
Data de nascimento
```

Se outros dados forem necessários, adicionar somente quando houver justificativa.

---

# 17. UX do formulário

O formulário deverá ser dividido visualmente em:

```text
SEUS DADOS
   ↓
CONFIRMAÇÃO
   ↓
PAGAMENTO
```

Não necessariamente como três páginas.

Pode ser uma única página com resumo lateral no desktop.

---

# 18. Validação

Utilizar React Hook Form + Zod.

Exemplo:

```ts
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  cpf: z.string().optional(),
  birthDate: z.string().optional(),
});
```

Mensagens deverão ser amigáveis.

Exemplo:

```text
Digite seu nome completo.
```

em vez de:

```text
String must contain at least 3 character(s)
```

---

# 19. Máscaras

Aplicar máscaras apenas visualmente.

Exemplo:

```text
CPF
000.000.000-00

WhatsApp
(00) 00000-0000
```

O backend deverá receber os valores normalizados.

Exemplo:

```text
11999999999
```

e:

```text
12345678900
```

---

# 20. Botão de inscrição

Estado normal:

```text
[ CONTINUAR PARA PAGAMENTO ]
```

Durante envio:

```text
[ CRIANDO INSCRIÇÃO... ]
```

Não permitir múltiplos submits.

---

# 21. Idempotency-Key

Antes de enviar:

```ts
const idempotencyKey = crypto.randomUUID();
```

Enviar:

```http
Idempotency-Key: <uuid>
```

Se o usuário clicar duas vezes, o backend deverá proteger contra duplicidade.

---

# 22. Submit

```ts
const response = await fetch(
  "/api/v1/registrations",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },

    body: JSON.stringify(data),
  }
);
```

---

# 23. Sucesso na criação

Response:

```json
{
  "registration": {
    "id": "...",
    "code": "REG-A83F21",
    "status": "PENDING_PAYMENT"
  },
  "payment": {
    "paymentUrl": "https://..."
  }
}
```

Então:

```ts
window.location.href = payment.paymentUrl;
```

---

# 24. Erros

## Sem vagas

```text
Não há mais vagas disponíveis neste lote.
```

CTA:

```text
[ ATUALIZAR ]
```

---

## Lote encerrado

```text
Este lote acabou de ser encerrado.
```

O usuário poderá tentar novamente.

---

## Erro temporário

```text
Não conseguimos concluir sua inscrição agora.

Seus dados não foram cobrados.

Tente novamente em alguns instantes.
```

---

# 25. Página de sucesso

Rota:

```text
/pagamento/sucesso
```

Não assumir automaticamente que o pagamento foi confirmado.

A página deverá consultar:

```text
GET /api/v1/registrations/{code}
```

Quando possível, utilizar o identificador recebido no retorno do Mercado Pago ou armazenado durante o fluxo.

---

# 26. Estado visual de sucesso

Se:

```text
status = PAID
```

mostrar:

```text
✓ INSCRIÇÃO CONFIRMADA

Sua inscrição foi confirmada.

Código:
REG-A83F21

[ VOLTAR PARA O SITE ]
```

---

# 27. Pagamento pendente

Rota:

```text
/pagamento/pendente
```

Mostrar:

```text
Pagamento em processamento

Estamos aguardando a confirmação do pagamento.

Código:
REG-A83F21
```

Adicionar:

```text
[ VERIFICAR STATUS ]
```

O botão consulta novamente a API.

---

# 28. Pagamento recusado

Rota:

```text
/pagamento/erro
```

Mostrar:

```text
Não conseguimos confirmar o pagamento.

Sua inscrição ainda não foi confirmada.
```

CTA:

```text
[ TENTAR PAGAMENTO NOVAMENTE ]
```

Se existir uma Preference válida, utilizar a mesma ou criar uma nova conforme regra do backend.

---

# 29. Não confiar no retorno do Mercado Pago

Mesmo na página:

```text
/pagamento/sucesso
```

o frontend deverá consultar o backend.

Fluxo:

```text
Mercado Pago
     ↓
redirect
     ↓
Frontend
     ↓
Backend
     ↓
PostgreSQL
     ↓
status
```

Nunca:

```text
redirect = PAID
```

---

# 30. Loading states

Toda operação assíncrona deverá possuir estado visual.

Exemplos:

```text
Carregando informações...
Criando inscrição...
Redirecionando para pagamento...
Consultando pagamento...
```

Evitar telas totalmente vazias.

---

# 31. Responsividade

Breakpoints mínimos:

```text
mobile
tablet
desktop
large desktop
```

A experiência deverá ser pensada primeiro para mobile.

---

# 32. Acessibilidade

Obrigatório:

* labels nos inputs;
* foco visível;
* navegação por teclado;
* contraste adequado;
* `aria-label` quando necessário;
* mensagens de erro associadas aos campos;
* botões semanticamente corretos;
* não depender somente de cor para indicar status.

---

# 33. SEO

Configurar:

```text
title
description
Open Graph
Twitter/X metadata
favicon
canonical
```

Exemplo:

```text
Acampamento 2026 — Uma experiência para...
```

Criar:

```text
sitemap.xml
robots.txt
```

---

# 34. Performance

Prioridades:

```text
LCP
CLS
INP
```

Utilizar:

* `next/image`;
* imagens responsivas;
* lazy loading;
* fontes otimizadas;
* componentes server-side quando possível;
* evitar JavaScript desnecessário.

---

# 35. Analytics

Eventos recomendados:

```text
landing_view
registration_started
registration_form_completed
registration_created
payment_redirected
payment_success
payment_pending
payment_failed
```

Nunca enviar CPF ou dados sensíveis para analytics.

---

# 36. Conteúdo configurável

Informações como:

```text
nome
data
local
descrição
programação
FAQ
```

deverão ficar separadas dos componentes visuais.

Exemplo:

```text
src/content/camp.ts
```

```ts
export const campContent = {
  name: "...",
  description: "...",
  location: "...",
  faq: [...],
  program: [...],
};
```

Dados financeiros e disponibilidade continuam vindo do backend.

---

# 37. Definition of Done

Frontend:

* [ ] landing responsiva;
* [ ] formulário funcional;
* [ ] validação;
* [ ] integração com API;
* [ ] idempotency key;
* [ ] redirect Mercado Pago;
* [ ] página de sucesso;
* [ ] página de pendente;
* [ ] página de erro;
* [ ] loading states;
* [ ] error states;
* [ ] acessibilidade;
* [ ] SEO;
* [ ] performance;
* [ ] mobile testado;
* [ ] desktop testado.

---

# 38. Fluxo final

```text
LANDING
   ↓
INSCRIÇÃO
   ↓
FORMULÁRIO
   ↓
POST /registrations
   ↓
201
   ↓
paymentUrl
   ↓
MERCADO PAGO
   ↓
PAGAMENTO
   ↓
redirect
   ↓
STATUS
   ↓
PAID / PENDING / FAILED
```
