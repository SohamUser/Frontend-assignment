import { getProductById } from "./catalog";
import { addCartLine, cartSummary, decrementCartLine, removeCartLine, type CartLine } from "./cart";
import { STORAGE_WARNING, type SavedCart } from "./cart-storage";

export interface CartState extends SavedCart {
  isHydrated: boolean;
  message: string;
  announcementId: number;
}

export const INITIAL_CART: CartState = {
  lines: [], isHydrated: false, storageAvailable: true, storageWarning: "", message: "", announcementId: 0,
};

export type CartAction =
  | { type: "hydrate"; saved: SavedCart }
  | { type: "add"; productId: string; quantity: number }
  | { type: "increment" | "decrement" | "remove"; productId: string }
  | { type: "storage-failed" }
  | { type: "dismiss" };

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "hydrate") return state.isHydrated ? state : { ...state, ...action.saved, isHydrated: true };
  if (action.type === "storage-failed") return { ...state, storageAvailable: false, storageWarning: STORAGE_WARNING };
  if (action.type === "dismiss") return { ...state, message: "" };
  if (!state.isHydrated) return state;
  const product = getProductById(action.productId);
  if (!product) return state;
  let lines: readonly CartLine[] = state.lines;
  let message = "";
  switch (action.type) {
    case "add": {
      lines = addCartLine(lines, product.id, action.quantity);
      const count = cartSummary(lines).totalQuantity;
      message = lines === state.lines ? "This quantity could not be added. Choose a smaller positive whole number."
        : `Added ${action.quantity} × ${product.title} to cart. Cart now has ${count} ${count === 1 ? "item" : "items"}.`;
      break;
    }
    case "increment":
      if (!lines.some((line) => line.productId === product.id)) return state;
      lines = addCartLine(lines, product.id, 1);
      message = lines === state.lines ? "This quantity is too large to increase." : `Increased ${product.title} quantity.`;
      break;
    case "decrement":
      lines = decrementCartLine(lines, product.id);
      if (lines === state.lines) return state;
      message = `Decreased ${product.title} quantity.`;
      break;
    case "remove":
      lines = removeCartLine(lines, product.id);
      if (lines === state.lines) return state;
      message = `Removed ${product.title} from cart.`;
  }
  return { ...state, lines, message, announcementId: state.announcementId + 1 };
}
