/**
 * Monetary values are always persisted as integer cents to avoid floating
 * point precision issues. These helpers convert to/from the decimal amount
 * (BRL) expected by the Mercado Pago API.
 */

export function centsToAmount(cents: number): number {
  return Math.round(cents) / 100;
}

export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function formatCentsAsBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centsToAmount(cents));
}
