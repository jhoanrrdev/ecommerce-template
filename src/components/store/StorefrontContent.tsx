import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoreProductGrid } from "@/components/store/StoreProductGrid";
import { formatCurrency } from "@/lib/utils";

type StorefrontContentProps = {
  searchParams?: Promise<{
    categoria?: string;
    q?: string;
    sort?: string;
    promo?: string;
  }>;
  mode?: "home" | "catalog";
};

export async function StorefrontContent({
  searchParams,
  mode = "catalog",
}: StorefrontContentProps) {
  const params = await searchParams;
  const selectedCategoryId = params?.categoria ? Number(params.categoria) : null;
  const query = params?.q?.trim() || "";
  const promoOnly = params?.promo === "1";
  const sort = params?.sort || "recientes";

  const orderBy =
    sort === "precio_asc"
      ? { price: "asc" as const }
      : sort === "precio_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, categories, promotions, featuredProducts, settings] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        categoryId:
          selectedCategoryId && !Number.isNaN(selectedCategoryId)
            ? selectedCategoryId
            : undefined,
        promoPrice: promoOnly ? { not: null } : undefined,
        OR: query
          ? [
              { name: { contains: query } },
              { description: { contains: query } },
            ]
          : undefined,
      },
      orderBy,
    }),
    prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 8,
    }),
    prisma.promotion.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    }),
    prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    }),
    prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
    }),
  ]);

  const newestProducts = products.slice(0, 4);
  const promoProducts = products.filter((product) => product.promoPrice).slice(0, 4);
  const testimonials = [
    {
      name: settings?.testimonial1Name || "",
      role: settings?.testimonial1Role || "",
      comment: settings?.testimonial1Comment || "",
    },
    {
      name: settings?.testimonial2Name || "",
      role: settings?.testimonial2Role || "",
      comment: settings?.testimonial2Comment || "",
    },
    {
      name: settings?.testimonial3Name || "",
      role: settings?.testimonial3Role || "",
      comment: settings?.testimonial3Comment || "",
    },
  ].filter((testimonial) => testimonial.comment);

  const isHome = mode === "home";

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-brand-accent text-white shadow-xl">
        <div className="grid gap-8 px-8 py-10 md:px-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Pago contra entrega disponible
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              {isHome
                ? `La plantilla ideal para vender con ${settings?.storeName || "tu tienda"}`
                : `Compra con confianza en ${settings?.storeName || "nuestra tienda"} y paga cuando recibas tu pedido.`}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              {isHome
                ? "Muestra productos, impulsa conversion con promociones y cierra pedidos por WhatsApp o carrito desde un storefront moderno."
                : "Encuentra productos listos para envio rapido, atencion directa y promociones activas para cerrar tu compra hoy mismo."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/tienda"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900"
              >
                Explorar tienda
              </Link>
              <Link
                href="/promociones"
                className="rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20"
              >
                Ver promociones
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">Compra segura</p>
              <p className="mt-2 text-2xl font-bold">Sin pago anticipado</p>
              <p className="mt-2 text-sm text-slate-200">Recibes primero y pagas despues.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/15">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300">Venta directa</p>
              <p className="mt-2 text-2xl font-bold">Atencion agil</p>
              <p className="mt-2 text-sm text-slate-200">Carrito, WhatsApp y promociones activas.</p>
            </div>
            <div className="rounded-3xl bg-amber-300 p-5 text-slate-900 shadow-lg">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-700">Plantilla lista</p>
              <p className="mt-2 text-2xl font-black">Pensada para convertir</p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                Imagen, oferta y compra rapida en el mismo flujo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isHome && featuredProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Destacados del momento</h2>
              <p className="mt-1 text-slate-500">
                Productos priorizados para impulsar conversion.
              </p>
            </div>
            <Link
              href="/tienda?promo=1"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Ver ofertas
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
                  ) : (
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Sin imagen
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{product.name}</h3>
                <p className="mt-2 text-base font-semibold text-slate-700">
                  {formatCurrency(product.promoPrice ?? product.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {isHome ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Nuevos</h2>
              <Link href="/tienda?sort=recientes" className="text-sm font-semibold text-brand-accent">
                Ver todos
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {newestProducts.map((product) => (
                <Link key={product.id} href={`/producto/${product.slug}`} className="block rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatCurrency(product.promoPrice ?? product.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Ofertas</h2>
              <Link href="/tienda?promo=1" className="text-sm font-semibold text-brand-accent">
                Ver todas
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {promoProducts.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Todavia no hay productos en oferta.
                </div>
              ) : (
                promoProducts.map((product) => (
                  <Link key={product.id} href={`/producto/${product.slug}`} className="block rounded-2xl bg-amber-50 px-4 py-3 transition hover:bg-amber-100/70">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-sm text-slate-500 line-through">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-base font-bold text-amber-700">
                      {formatCurrency(product.promoPrice ?? product.price)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Categorias</h2>
              <Link href="/tienda" className="text-sm font-semibold text-brand-accent">
                Explorar
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tienda?categoria=${category.id}`}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div id="catalogo" className="space-y-5">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            {isHome ? "Catalogo principal" : "Tienda"}
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Busca, filtra y ordena productos para comprar mas rapido.
          </p>
        </div>

        <form action={isHome ? "/" : "/tienda"} className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.7fr_auto]">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Buscar por nombre o descripcion"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            <select
              name="categoria"
              defaultValue={
                selectedCategoryId && !Number.isNaN(selectedCategoryId)
                  ? String(selectedCategoryId)
                  : ""
              }
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Todas las categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="recientes">Mas recientes</option>
              <option value="precio_asc">Precio menor a mayor</option>
              <option value="precio_desc">Precio mayor a menor</option>
            </select>
            <select
              name="promo"
              defaultValue={promoOnly ? "1" : "0"}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="0">Todos</option>
              <option value="1">Solo ofertas</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Filtrar
            </button>
          </div>
        </form>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={isHome ? "/" : "/tienda"}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !selectedCategoryId ? "bg-slate-900 text-white" : "bg-white text-slate-700 shadow-sm"
              }`}
            >
              Todas
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`${isHome ? "/" : "/tienda"}?categoria=${category.id}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedCategoryId === category.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 shadow-sm"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}

        {promotions.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                  Promocion activa
                </p>
                <h3 className="mt-3 text-2xl font-bold text-slate-900">
                  {promotion.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Tipo: {promotion.type} • Valor: {promotion.value}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {isHome ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Confianza
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Compra sin complicaciones
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                El flujo esta pensado para vender por carrito o por WhatsApp, con mensajes claros y CTA visibles.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Entrega
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Pago contra entrega
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Ideal para negocios que necesitan confianza inmediata y cierre rapido sin depender de pasarela.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Soporte
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Atencion cercana
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Desde el panel puedes mantener productos, promociones e inventario alineados con lo que ve el cliente.
              </p>
            </div>
          </div>
        ) : null}

        {isHome ? (
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
                Confianza social
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                Comentarios que ayudan a vender mas
              </h2>
              <p className="mt-2 text-slate-500">
                Este bloque te sirve como plantilla para testimonios, reputacion o pruebas sociales.
              </p>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial, index) => (
                  <div key={`${testimonial.name}-${index}`} className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm leading-7 text-slate-600">"{testimonial.comment}"</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      {testimonial.name || `Cliente ${index + 1}`}
                    </p>
                    {testimonial.role ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                        {testimonial.role}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500 lg:col-span-3">
                  Aun no has agregado comentarios. Puedes cargarlos desde el panel en la seccion
                  Comentarios.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">No encontramos productos con esos filtros.</p>
          </div>
        ) : (
          <StoreProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
