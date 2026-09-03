"use client";

import { createContext, useContext, useEffect, useReducer, useSyncExternalStore, type ReactNode } from "react";
import { cartSummary, type CartLine } from "@/lib/cart";
import { cartReducer, INITIAL_CART } from "@/lib/cart-reducer";
import { persistCart, readSavedCart } from "@/lib/cart-storage";

interface CartContextValue extends ReturnType<typeof cartSummary> {
  lines: readonly CartLine[];
  isHydrated: boolean;
  storageWarning: string;
  message: string;
  announcementId: number;
  add: (productId: string, quantity?: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  dismiss: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const browserStorage = () => window.localStorage;
const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const initialCartSnapshot = {
  ...cartSummary(INITIAL_CART.lines),
  lines: INITIAL_CART.lines,
  isHydrated: INITIAL_CART.isHydrated,
  storageWarning: INITIAL_CART.storageWarning,
  message: INITIAL_CART.message,
  announcementId: INITIAL_CART.announcementId,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_CART);

  useEffect(() => {
    dispatch({ type: "hydrate", saved: readSavedCart(browserStorage) });
  }, []);

  useEffect(() => {
    // The initial empty render must never replace a saved cart before it is read.
    if (state.isHydrated && state.storageAvailable && !persistCart(browserStorage, state.lines, state.isHydrated)) {
      dispatch({ type: "storage-failed" });
    }
  }, [state.lines, state.isHydrated, state.storageAvailable]);

  useEffect(() => {
    if (!state.message) return;

    const timeout = setTimeout(() => dispatch({ type: "dismiss" }), 3000);
    return () => clearTimeout(timeout);
    // Restart even when consecutive cart updates produce the same message.
  }, [state.message, state.announcementId]);

  const value: CartContextValue = {
    ...cartSummary(state.lines),
    lines: state.lines,
    isHydrated: state.isHydrated,
    storageWarning: state.storageWarning,
    message: state.message,
    announcementId: state.announcementId,
    add: (productId, quantity = 1) => dispatch({ type: "add", productId, quantity }),
    increment: (productId) => dispatch({ type: "increment", productId }),
    decrement: (productId) => dispatch({ type: "decrement", productId }),
    remove: (productId) => dispatch({ type: "remove", productId }),
    dismiss: () => dispatch({ type: "dismiss" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  // A Suspense consumer may hydrate after the provider has already restored storage.
  // Keep that consumer's first render identical to its server HTML.
  const isClient = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return isClient ? context : { ...context, ...initialCartSnapshot };
}
