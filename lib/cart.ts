import { getProductById } from "./catalog";

export interface CartLine {
  readonly productId: string;
  readonly quantity: number;
}

export function validQuantity(quantity: unknown): quantity is number {
  return typeof quantity === "number" && Number.isSafeInteger(quantity) && quantity >= 1;
}

export function cartSummary(lines: readonly CartLine[]) {
  const items = lines.flatMap((line) => {
    const product = getProductById(line.productId);
    return product ? [{ ...line, product, lineTotalCents: Math.round(product.price * 100) * line.quantity }] : [];
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  return {
    items,
    subtotalCents,
    subtotal: subtotalCents / 100,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function addCartLine(lines: readonly CartLine[], productId: string, quantity: number): readonly CartLine[] {
  const product = getProductById(productId);
  if (!product || !validQuantity(quantity)) return lines;
  const existing = lines.find((line) => line.productId === productId);
  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  const nextCents = cartSummary(lines).subtotalCents + Math.round(product.price * 100) * quantity;
  // Reject numerical overflow rather than silently changing requested quantities/prices.
  if (!validQuantity(nextQuantity) || !Number.isSafeInteger(nextCents)) return lines;
  return existing
    ? lines.map((line) => line.productId === productId ? { productId, quantity: nextQuantity } : line)
    : [...lines, { productId, quantity }];
}

export function decrementCartLine(lines: readonly CartLine[], productId: string): readonly CartLine[] {
  const existing = lines.find((line) => line.productId === productId);
  if (!existing || existing.quantity <= 1) return lines;
  return lines.map((line) => line.productId === productId ? { ...line, quantity: line.quantity - 1 } : line);
}

export function removeCartLine(lines: readonly CartLine[], productId: string): readonly CartLine[] {
  return lines.some((line) => line.productId === productId)
    ? lines.filter((line) => line.productId !== productId) : lines;
}

/** Unknown items and invalid quantities are discarded; valid duplicates merge. */
export function validateCartLines(value: unknown): readonly CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<readonly CartLine[]>((lines, entry: unknown) => {
    if (!entry || typeof entry !== "object" || !("productId" in entry) || !("quantity" in entry) ||
        typeof entry.productId !== "string" || !validQuantity(entry.quantity)) return lines;
    return addCartLine(lines, entry.productId, entry.quantity);
  }, []);
}
