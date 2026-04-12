"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  promoPrice: number | null;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemsCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "ecommerce-template-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return;
    }

    try {
      setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + (item.promoPrice ?? item.price) * item.quantity,
      0
    );

    return {
      items,
      itemsCount,
      total,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((cartItem) => cartItem.id === item.id);

          if (existing) {
            return current.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          }

          return [...current, { ...item, quantity: 1 }];
        });
      },
      removeItem: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          current
            .map((item) =>
              item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart: () => {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
