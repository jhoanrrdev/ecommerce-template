"use client";

import { useCart } from "@/components/store/CartProvider";

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    promoPrice: number | null;
    imageUrl: string | null;
  };
  large?: boolean;
};

export function AddToCartButton({ product, large = false }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={`rounded-xl bg-slate-900 font-semibold text-white ${
        large ? "px-6 py-3 text-sm" : "px-5 py-3 text-sm"
      }`}
    >
      Agregar al carrito
    </button>
  );
}
