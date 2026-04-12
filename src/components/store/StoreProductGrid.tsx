"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";
import { useCart } from "@/components/store/CartProvider";
import { formatCurrency } from "@/lib/utils";

type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  promoPrice: number | null;
  stock: number;
};

type StoreProductGridProps = {
  products: StoreProduct[];
};

export function StoreProductGrid({ products }: StoreProductGridProps) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState<StoreProduct | null>(null);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [zoomPosition, setZoomPosition] = useState<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  const handleImageMove = (event: MouseEvent<HTMLDivElement>, productId: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setHoveredImageId(productId);
    setZoomPosition((current) => ({
      ...current,
      [productId]: { x, y },
    }));
  };

  const handleImageLeave = () => {
    setHoveredImageId(null);
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:z-30 hover:-translate-y-1 hover:shadow-2xl"
          >
            <button
              type="button"
              onClick={() => product.imageUrl && setActiveImage(product)}
              className="relative mb-6 block w-full rounded-[1.75rem] bg-gradient-to-br from-slate-100 via-white to-slate-200 p-3 text-left shadow-inner"
            >
              <div className="absolute left-6 top-6 z-10 rounded-full bg-slate-900/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                {product.promoPrice ? "Oferta activa" : "Producto destacado"}
              </div>

              {product.promoPrice ? (
                <div className="absolute right-6 top-6 z-10 rounded-full bg-amber-300 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-950 shadow-sm">
                  -
                  {Math.round(
                    ((product.price - product.promoPrice) / product.price) * 100
                  )}
                  %
                </div>
              ) : null}

              <div className="absolute bottom-6 left-6 z-10 rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-sm backdrop-blur-sm">
                Pasa el cursor para ampliar
              </div>

              <div
                className="relative flex aspect-[4/3] min-h-[20rem] items-center justify-center overflow-visible rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 md:min-h-[24rem]"
                onMouseMove={(event) => handleImageMove(event, product.id)}
                onMouseLeave={handleImageLeave}
              >
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="relative z-20 max-h-full w-full rounded-2xl object-contain transition-transform duration-200 ease-out"
                    style={{
                      transformOrigin: `${zoomPosition[product.id]?.x ?? 50}% ${zoomPosition[product.id]?.y ?? 50}%`,
                      transform: hoveredImageId === product.id ? "scale(1.65)" : "scale(1)",
                      boxShadow:
                        hoveredImageId === product.id
                          ? "0 24px 48px rgba(15, 23, 42, 0.22)"
                          : "none",
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl bg-slate-200 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Imagen pendiente
                  </div>
                )}

                {product.imageUrl && hoveredImageId === product.id ? (
                  <div
                    className="pointer-events-none absolute z-30 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/90 bg-transparent shadow-[0_0_0_9999px_rgba(255,255,255,0.02)] ring-1 ring-slate-900/20"
                    style={{
                      left: `${zoomPosition[product.id]?.x ?? 50}%`,
                      top: `${zoomPosition[product.id]?.y ?? 50}%`,
                      backdropFilter: "blur(1px)",
                    }}
                  />
                ) : null}
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 h-24 rounded-b-2xl bg-gradient-to-t from-slate-900/25 to-transparent" />
            </button>

            <h2 className="text-2xl font-semibold text-slate-900">
              <Link href={`/producto/${product.slug}`} className="transition hover:text-brand-accent">
                {product.name}
              </Link>
            </h2>

            <p className="mt-3 line-clamp-3 text-base text-slate-600">
              {product.description || "Sin descripcion"}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                {product.promoPrice ? (
                  <div className="space-y-1">
                    <p className="text-base text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {formatCurrency(product.promoPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Stock: {product.stock}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    promoPrice: product.promoPrice,
                    imageUrl: product.imageUrl,
                  })
                }
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Agregar al carrito
              </button>
              <Link
                href={`/producto/${product.slug}`}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow"
            >
              Cerrar
            </button>

            <div className="overflow-hidden rounded-[2rem] bg-white p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-4 px-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Vista ampliada
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {activeImage.name}
                  </h3>
                </div>
              </div>

              <div className="flex max-h-[80vh] items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.imageUrl || ""}
                  alt={activeImage.name}
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
