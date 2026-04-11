import { prisma } from "@/lib/prisma";
import { StoreProductGrid } from "@/components/store/StoreProductGrid";

export default async function TiendaPage() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-brand-accent text-white shadow-xl">
        <div className="grid gap-8 px-8 py-10 md:px-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Pago contra entrega disponible
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              Compra con confianza y paga cuando recibas tu pedido.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              Encuentra productos listos para envio rapido, atencion directa y promociones activas para cerrar tu compra hoy mismo.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900">
                Sin pago anticipado
              </span>
              <span className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
                Atencion personalizada
              </span>
              <span className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20">
                Promociones por tiempo limitado
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                Beneficio 1
              </p>
              <p className="mt-2 text-2xl font-bold">Compra segura</p>
              <p className="mt-2 text-sm text-slate-200">
                Recibes primero, pagas despues.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                Beneficio 2
              </p>
              <p className="mt-2 text-2xl font-bold">Entrega agil</p>
              <p className="mt-2 text-sm text-slate-200">
                Despachos rapidos segun disponibilidad.
              </p>
            </div>
            <div className="rounded-3xl bg-amber-300 p-5 text-slate-900 shadow-lg">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-700">
                Oferta
              </p>
              <p className="mt-2 text-2xl font-black">Aprovecha hoy</p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                Los productos destacados se agotan rapido.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-4xl font-bold text-slate-900">Tienda</h2>
        <p className="mt-3 text-lg text-slate-600">
          Productos cargados desde la base de datos con enfoque en conversion.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">Todavia no hay productos disponibles.</p>
        </div>
      ) : (
        <StoreProductGrid products={products} />
      )}
    </section>
  );
}
