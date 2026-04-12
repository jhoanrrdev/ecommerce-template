"use client";

import Link from "next/link";
import { useCart } from "@/components/store/CartProvider";

type HeaderProps = {
  storeName: string;
  logoUrl?: string | null;
  categories: Array<{
    id: number;
    name: string;
  }>;
};

export function Header({ storeName, logoUrl, categories }: HeaderProps) {
  const { itemsCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[90rem] px-6">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={storeName}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <span className="text-sm font-black text-slate-600">EC</span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Ecommerce
                </p>
                <p className="text-lg font-black text-slate-900">{storeName}</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 xl:flex">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/tienda?categoria=${category.id}`}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form action="/tienda" className="w-full lg:max-w-xl">
              <div className="flex items-center rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2">
                <input
                  type="search"
                  name="q"
                  placeholder="Buscar productos, categorias o referencias"
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Buscar
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Inicio
              </Link>
              <Link
                href="/tienda"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Tienda
              </Link>
              <Link
                href="/promociones"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Promociones
              </Link>
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                <span>Carrito</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {itemsCount}
                </span>
              </Link>
              <Link
                href="/admin/login"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
