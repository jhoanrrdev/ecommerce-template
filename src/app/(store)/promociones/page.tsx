import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PromotionsPage() {
  const [promotions, featuredProducts] = await Promise.all([
    prisma.promotion.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    }),
  ]);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-brand-accent p-8 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
          Campañas activas
        </p>
        <h1 className="mt-4 text-4xl font-black">Promociones para convertir mas ventas</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-200">
          Revisa descuentos, campañas temporales y productos destacados listos para pedir hoy.
        </p>
      </div>

      {promotions.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-slate-500 shadow-sm">
          No hay promociones activas en este momento.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Oferta
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">{promotion.title}</h2>
              <p className="mt-2 text-slate-500">
                Tipo: {promotion.type} • Valor: {promotion.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Productos destacados</h2>
            <p className="mt-1 text-slate-500">
              Productos seleccionados para impulsar la conversion.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Ver tienda
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.slug}`}
              className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-4">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full w-full object-contain"
                  />
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{product.name}</h3>
              <p className="mt-2 text-base font-semibold text-slate-700">
                {formatCurrency(product.promoPrice ?? product.price)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
