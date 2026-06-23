"use client";

import { BookingLineItem } from "@/types";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cartBreakdown } from "@/lib/utils/booking";

const STORAGE_KEY = "tribleera-cart-v1";

interface CartContextValue {
  items: BookingLineItem[];
  addItem: (item: BookingLineItem) => void;
  removeItem: (categorySlug: string) => void;
  clear: () => void;
  isInCart: (categorySlug: string) => boolean;
  totals: ReturnType<typeof cartBreakdown>;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BookingLineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from a browser-only store (localStorage) that cannot
    // be read during server render — this is the standard, intentional
    // exception to "don't setState in an effect".
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — booking still works for this session
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: BookingLineItem) => {
    setItems((prev) => [...prev.filter((i) => i.categorySlug !== item.categorySlug), item]);
  }, []);

  const removeItem = useCallback((categorySlug: string) => {
    setItems((prev) => prev.filter((i) => i.categorySlug !== categorySlug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (categorySlug: string) => items.some((i) => i.categorySlug === categorySlug),
    [items]
  );

  const totals = useMemo(() => cartBreakdown(items.map((i) => i.price)), [items]);

  const value: CartContextValue = { items, addItem, removeItem, clear, isInCart, totals, hydrated };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
