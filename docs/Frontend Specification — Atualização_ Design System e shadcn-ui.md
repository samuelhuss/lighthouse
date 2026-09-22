# 39. Design System e shadcn/ui

O frontend deverá utilizar **shadcn/ui como biblioteca principal de componentes de interface**.

A prioridade é utilizar os componentes oficiais/disponíveis do shadcn/ui sempre que houver um componente equivalente.

Não criar componentes básicos do zero quando o shadcn/ui já fornecer a mesma funcionalidade.

---

# 40. Princípio de utilização

A hierarquia de implementação deverá ser:

```text
shadcn/ui
    ↓
customização via Tailwind
    ↓
componente específico da aplicação
```

Exemplo:

```text
Button
    ↓
shadcn/ui Button
    ↓
customização de tamanho/variant
    ↓
RegistrationButton
```

Evitar:

```text
button HTML
    ↓
CSS próprio
    ↓
ButtonCustom
```

quando o componente do shadcn/ui já atender à necessidade.

---

# 41. Componentes base

Utilizar shadcn/ui para componentes como:

```text
Button
Input
Textarea
Label
Select
Checkbox
RadioGroup
Switch
Badge
Card
Dialog
AlertDialog
DropdownMenu
Sheet
Tabs
Table
Pagination
Skeleton
Separator
Tooltip
Popover
Calendar
Form
Toast / Sonner
Command
Breadcrumb
Accordion
Avatar
```

A lista poderá crescer conforme a necessidade do projeto.

---

# 42. Botões

Todos os botões da aplicação deverão utilizar:

```text
shadcn/ui Button
```

Exemplo:

```tsx
import { Button } from "@/components/ui/button";

<Button>
  Inscreva-se
</Button>
```

Variantes deverão ser utilizadas de maneira consistente:

```text
default
secondary
outline
ghost
destructive
link
```

Exemplo:

```tsx
<Button variant="outline">
  Ver detalhes
</Button>
```

Não criar uma implementação paralela de botão.

---

# 43. Formulários

Utilizar:

```text
Form
FormField
FormItem
FormLabel
FormControl
FormMessage
Input
Select
Checkbox
```

Integrados com:

```text
React Hook Form
+
Zod
```

Exemplo conceitual:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome completo</FormLabel>

          <FormControl>
            <Input {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

# 44. Tabelas

Todas as tabelas administrativas deverão utilizar os componentes de tabela do shadcn/ui.

Estrutura:

```text
Table
├── TableHeader
├── TableBody
├── TableRow
├── TableHead
└── TableCell
```

Exemplo:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Participante</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Valor</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {registrations.map((registration) => (
      <TableRow key={registration.id}>
        <TableCell>
          {registration.name}
        </TableCell>

        <TableCell>
          <RegistrationStatusBadge
            status={registration.status}
          />
        </TableCell>

        <TableCell>
          {formatCurrency(
            registration.amountCents
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

# 45. Tabelas com funcionalidades avançadas

Para tabelas administrativas que necessitem de:

- ordenação;
- filtros;
- paginação;
- seleção de linhas;
- colunas configuráveis;
- busca;

utilizar:

```text
shadcn/ui
+
TanStack Table
```

O shadcn/ui será responsável pela camada visual.

O TanStack Table será responsável pela lógica da tabela.

Arquitetura:

```text
TanStack Table
      ↓
data / sorting / filtering / pagination
      ↓
shadcn/ui Table
      ↓
UI
```

---

# 46. Status

Utilizar:

```text
Badge
```

para status.

Exemplo:

```tsx
<Badge variant="default">
  Pago
</Badge>
```

Criar um componente específico para padronizar os status:

```text
RegistrationStatusBadge
PaymentStatusBadge
BatchStatusBadge
```

Exemplo:

```tsx
<RegistrationStatusBadge
  status="PAID"
/>
```

Esse componente deverá centralizar:

- texto;
- variante;
- ícone;
- tratamento visual.

---

# 47. Cards

Utilizar:

```text
Card
CardHeader
CardTitle
CardDescription
CardContent
CardFooter
```

Principalmente no Dashboard.

Exemplo:

```text
┌─────────────────────────┐
│ INSCRIÇÕES              │
│                         │
│ 87                      │
│ +12 esta semana         │
└─────────────────────────┘
```

Implementado utilizando:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Inscrições</CardTitle>
  </CardHeader>

  <CardContent>
    <span className="text-3xl font-bold">
      87
    </span>
  </CardContent>
</Card>
```

---

# 48. Modal / Dialog

Utilizar:

```text
Dialog
```

para ações como:

- visualizar informações rápidas;
- editar dados;
- confirmação de operações;
- criação de lote.

Para ações destrutivas utilizar:

```text
AlertDialog
```

Exemplo:

```text
Cancelar inscrição?

Essa ação irá liberar a vaga.

[Voltar] [Cancelar inscrição]
```

---

# 49. Drawer / Sheet

Em mobile, preferir:

```text
Sheet
```

para:

- filtros;
- menu;
- detalhes rápidos;
- ações secundárias.

Exemplo:

```text
┌──────────────────────┐
│ FILTROS              │
│                      │
│ Status               │
│ [ Pago          ▼ ]  │
│                      │
│ Lote                 │
│ [ 1º Lote       ▼ ]  │
│                      │
│ [ Aplicar filtros ]  │
└──────────────────────┘
```

---

# 50. Dropdowns

Utilizar:

```text
DropdownMenu
```

para ações relacionadas a registros.

Exemplo:

```text
REG-A83F21          ⋮
                    ├── Ver inscrição
                    ├── Ver pagamento
                    ├── Copiar código
                    └── Cancelar
```

---

# 51. Select

Utilizar:

```text
Select
```

para seleção de:

- lote;
- status;
- filtros;
- configurações.

Não criar dropdown customizado sem necessidade.

---

# 52. Feedback

Para mensagens temporárias utilizar:

```text
Sonner
```

Exemplos:

```text
✓ Inscrição atualizada.

✓ Lote criado.

✓ Dados copiados.

⚠ Não foi possível atualizar.
```

Mensagens de erro importantes e persistentes deverão utilizar:

```text
Alert
```

ou mensagens diretamente no componente.

---

# 53. Loading

Utilizar:

```text
Skeleton
```

para carregamento de conteúdo.

Exemplo:

```tsx
<Skeleton className="h-10 w-[120px]" />
```

Evitar utilizar somente:

```text
Carregando...
```

em grandes áreas da aplicação.

---

# 67. Loading e animações

Estados de carregamento devem preservar a geometria do conteúdo final. Usar `Skeleton` para cards, tabelas e listas; evitar blocos genéricos que causem salto de layout.

Animações devem ser curtas e funcionais:

- entrada escalonada para grupos de cards e linhas;
- shimmer discreto durante carregamento;
- transições de opacidade ao atualizar dados;
- spinner somente em ações que bloqueiam o botão.

Toda animação deve respeitar `prefers-reduced-motion: reduce`. A ausência de movimento não pode remover informação, foco ou feedback de estado.
---

# 54. Tooltip

Utilizar:

```text
Tooltip
```

para explicar ações que utilizam somente ícones.

Exemplo:

```text
[ ⟳ ]
```

Tooltip:

```text
Atualizar dados
```

Isso é especialmente importante no Admin Panel.

---

# 55. Accordion

Utilizar:

```text
Accordion
```

na FAQ da Landing Page.

Exemplo:

```text
┌─────────────────────────────────────────┐
│ O que está incluso?                   + │
├─────────────────────────────────────────┤
│ Como funciona o pagamento?            + │
├─────────────────────────────────────────┤
│ Posso cancelar minha inscrição?       + │
└─────────────────────────────────────────┘
```

---

# 56. Tabs

Utilizar:

```text
Tabs
```

quando houver diferentes categorias de informação.

Exemplo na inscrição:

```text
┌─────────────────────────────────────┐
│ Dados       Pagamento      Histórico│
├─────────────────────────────────────┤
│                                     │
│ conteúdo                            │
│                                     │
└─────────────────────────────────────┘
```

---

# 57. Ícones

Utilizar uma biblioteca consistente, preferencialmente:

```text
Lucide React
```

Exemplos:

```text
Search
Download
Check
X
ChevronDown
Calendar
MapPin
CreditCard
Users
DollarSign
```

Não utilizar emojis como ícones da interface administrativa.

---

# 58. Design tokens

Cores, radius e tipografia deverão ser centralizados no sistema do shadcn/ui/Tailwind.

Evitar espalhar valores arbitrários:

```tsx
className="bg-[#123456]"
```

quando uma variável/token do design system puder ser utilizada.

Preferir:

```tsx
className="bg-primary"
```

ou:

```tsx
className="text-muted-foreground"
```

---

# 59. Customização

O shadcn/ui não deverá limitar o design visual do projeto.

Os componentes poderão ser customizados através de:

```text
Tailwind
CSS variables
variants
className
component composition
```

Exemplo:

```tsx
<Button
  size="lg"
  className="rounded-full px-8"
>
  Quero me inscrever
</Button>
```

A regra é:

> reutilizar a implementação do shadcn/ui e customizar sua aparência, em vez de recriar o componente.

---

# 60. Componentes da aplicação

Componentes específicos do negócio deverão ficar separados dos componentes base.

Estrutura:

```text
components/
│
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   └── ...
│
├── landing/
│   ├── Hero.tsx
│   ├── Pricing.tsx
│   └── FAQ.tsx
│
├── registration/
│   ├── RegistrationForm.tsx
│   └── RegistrationSummary.tsx
│
└── admin/
    ├── RegistrationTable.tsx
    ├── PaymentTable.tsx
    └── StatCard.tsx
```

---

# 61. Regra para novos componentes

Antes de criar um componente visual:

```text
1. Existe no shadcn/ui?
        │
        ├── SIM → utilizar
        │
        └── NÃO
             ↓
2. É uma composição de componentes existentes?
        │
        ├── SIM → criar composição
        │
        └── NÃO
             ↓
3. Criar componente específico
```

Exemplo:

```text
RegistrationStatusBadge
```

não existe no shadcn/ui.

Então:

```text
Badge
  ↓
RegistrationStatusBadge
```

é correto.

---

# 62. Regra contra duplicação

Não criar:

```text
CustomButton
MyButton
PrimaryButton
AdminButton
BaseButton
```

se todos forem apenas variações do:

```text
shadcn/ui Button
```

Criar abstrações somente quando houver comportamento ou regra de negócio real.

---

# 63. Admin Panel — componentes obrigatórios

O Admin Panel deverá utilizar:

```text
Button
Input
Select
Badge
Table
Card
Dialog
AlertDialog
DropdownMenu
Sheet
Tabs
Skeleton
Tooltip
Sonner
Pagination
```

quando aplicável.

---

# 64. Landing Page — componentes obrigatórios

A Landing Page deverá utilizar:

```text
Button
Accordion
Card
Badge
Separator
Dialog
Sheet
```

quando aplicável.

A landing não deverá parecer um "dashboard".

Os componentes deverão ser utilizados como infraestrutura visual e adaptados ao design da página.

---

# 65. Regra geral

O projeto deverá seguir:

```text
shadcn/ui
      +
Tailwind
      +
Framer Motion
      +
componentes próprios de domínio
```

e não:

```text
Tailwind
+
centenas de componentes CSS criados manualmente
```

O objetivo é manter uma interface consistente, acessível, responsiva e fácil de evoluir.

---

# 66. Definition of Done — UI

Uma tela será considerada pronta quando:

- [ ] utiliza componentes shadcn/ui quando aplicável;
- [ ] não possui componentes básicos duplicados;
- [ ] funciona em mobile;
- [ ] possui estados de loading;
- [ ] possui estados de erro;
- [ ] possui empty state;
- [ ] possui foco acessível;
- [ ] possui feedback de ações;
- [ ] utiliza tokens do design system;
- [ ] não possui estilos duplicados desnecessários;
- [ ] componentes de domínio estão separados dos componentes `ui`.