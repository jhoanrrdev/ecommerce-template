import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(date);
}

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const [
    totalProducts,
    totalOrders,
    activePromotions,
    lowStockProducts,
    recentOrders,
    featuredProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.promotion.count({
      where: {
        active: true,
      },
    }),
    prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        items: true,
      },
    }),
    prisma.product.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    }),
  ]);

  const revenue = recentOrders.reduce((sum, order) => sum + order.total, 0);

  const cards = [
    {
      title: "Productos",
      value: totalProducts.toString(),
      detail: "Catalogo total disponible",
      accent: "from-sky-500 to-cyan-400",
    },
    {
      title: "Pedidos",
      value: totalOrders.toString(),
      detail: "Pedidos registrados",
      accent: "from-emerald-500 to-lime-400",
    },
    {
      title: "Promociones activas",
      value: activePromotions.toString(),
      detail: "Campañas encendidas",
      accent: "from-amber-400 to-orange-400",
    },
    {
      title: "Bajo stock",
      value: lowStockProducts.length.toString(),
      detail: "Requieren atencion",
      accent: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
        <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.3fr_0.9fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              Centro de control
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight">
              Gestiona la tienda con una vista clara de ventas, stock y operacion.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              Accede rapido a productos, pedidos y campañas activas. El panel ya
              esta conectado a tu base de datos y listo para operar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/productos/nuevo"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Crear producto
              </Link>
              <Link
                href="/admin/promociones"
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20"
              >
                Gestionar promociones
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/10"
              >
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${card.accent}`} />
                <p className="mt-4 text-sm text-slate-300">{card.title}</p>
                <p className="mt-2 text-4xl font-black">{card.value}</p>
                <p className="mt-2 text-sm text-slate-400">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Pedidos recientes</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ingreso reciente estimado: {formatCurrency(revenue)}
              </p>
            </div>
            <Link
              href="/admin/pedidos"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Ver pedidos
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {recentOrders.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                Aun no hay pedidos registrados.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Pedido #{order.id} • {order.items.length} item(s) • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Alerta de stock</h2>
            <p className="mt-1 text-sm text-slate-500">
              Productos que necesitan reposicion.
            </p>

            <div className="mt-5 space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Todo el inventario esta por encima del nivel critico.
                </div>
              ) : (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">
                        SKU: {product.sku || `ID #${product.id}`}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600">
                      {product.stock} unidades
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Destacados</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Productos marcados para mayor visibilidad.
                </p>
              </div>
              <Link
                href="/admin/productos"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Gestionar
              </Link>
            </div>

            <div className="mt-5 grid gap-3">
              {featuredProducts.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Aun no hay productos destacados.
                </div>
              ) : (
                featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(product.promoPrice ?? product.price)}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Destacado
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
