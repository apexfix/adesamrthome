import type { Product } from "@/types";

// Catalogue amounts are positive integer minor units, never decimal major units.
// Zero is not an advertised free offer in this catalogue: request a quote instead.
export function formatMinorPrice(value: unknown, minorUnit: number = 2, grouped = false): string | null {
  if (!Number.isInteger(minorUnit) || minorUnit < 0 || minorUnit > 6 ||
      typeof value !== "string" || !/^\d+$/.test(value) || value.length > 16 ||
      !Number.isSafeInteger(Number(value)) || Number(value) <= 0) return null;

  const digits = String(Number(value)).padStart(minorUnit + 1, "0");
  const whole = minorUnit ? digits.slice(0, -minorUnit) : digits;
  const fraction = minorUnit ? digits.slice(-minorUnit) : "";
  const integer = grouped ? Number(whole).toLocaleString("en-AU") : whole;
  return fraction && /[1-9]/.test(fraction) ? `${integer}.${fraction}` : integer;
}

export function getOptionalPrice(product: Product, value?: string, grouped = false) {
  return formatMinorPrice(value, product.prices?.currency_minor_unit ?? 2, grouped);
}

export function getPrice(product: Product) {
  const current = getOptionalPrice(product, product.prices?.price);
  const regular = getOptionalPrice(product, product.prices?.regular_price);
  return {
    current,
    regular,
    isOnSale: current !== null && regular !== null &&
      Number(product.prices?.regular_price) > Number(product.prices?.price),
  };
}

export function priceLabel(price: string | null, symbol = "$") {
  return price === null ? "Quote Required" : `${symbol}${price}`;
}
