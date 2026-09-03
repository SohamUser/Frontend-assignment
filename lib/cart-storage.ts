import { validateCartLines, type CartLine } from "./cart";

export const CART_STORAGE_KEY = "whatbytes-cart-v1";
export const STORAGE_WARNING = "Your cart works for this visit, but changes cannot be saved on this device.";
export interface CartStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface SavedCart {
  lines: readonly CartLine[];
  storageAvailable: boolean;
  storageWarning: string;
}

export function readSavedCart(getStorage: () => CartStorage): SavedCart {
  let raw: string | null;
  try {
    raw = getStorage().getItem(CART_STORAGE_KEY);
  } catch {
    return { lines: [], storageAvailable: false, storageWarning: STORAGE_WARNING };
  }
  if (raw === null) return { lines: [], storageAvailable: true, storageWarning: "" };
  try {
    const value: unknown = JSON.parse(raw);
    return {
      lines: validateCartLines(value), storageAvailable: true,
      storageWarning: Array.isArray(value) ? "" : "The saved cart was invalid and has been reset.",
    };
  } catch {
    return { lines: [], storageAvailable: true, storageWarning: "The saved cart was invalid and has been reset." };
  }
}

export function persistCart(getStorage: () => CartStorage, lines: readonly CartLine[], isHydrated: boolean): boolean {
  if (!isHydrated) return false;
  try {
    getStorage().setItem(CART_STORAGE_KEY, JSON.stringify(lines.map(({ productId, quantity }) => ({ productId, quantity }))));
    return true;
  } catch {
    return false;
  }
}
