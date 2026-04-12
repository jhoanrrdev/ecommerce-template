import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { AddToCartButton } from "@/components/store/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [settings, product] = await Promise.all([
    prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
    }),
    prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    }),
  ]);

  if (!product || !product.active) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      id: {
        not: product.id,
      },
      categoryId: product.categoryId ?? undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  const whatsappMessage = [
    `Hola, quiero pedir este producto: ${product.name}.`,
    `Precio: ${formatCurrency(product.promoPrice ?? product.price)}.`,
    `Link: ${process.env.NEXT_PUBLIC_SITE_URL || ""}/producto/${product.slug}`,
  ].join(" ");

  const whatsappUrl = settings?.whatsapp
    ? buildWhatsAppUrl(settings.whatsapp, whatsappMessage)
    : null;

  return (
    <section className="space-y-10">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-sm">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full w-full object-contain"
              />
            ) : (
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Sin imagen
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">
              {product.category?.name || "Producto"}
            </p>
            <h1 className="mt-3 text-4xl font-black text-slate-900">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {product.description || "Producto disponible para compra inmediata."}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {product.promoPrice ? (
                  <div className="space-y-1">
                    <p className="text-base text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-4xl font-black text-slate-900">
                      {formatCurrency(product.promoPrice)}
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl font-black text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  Stock: {product.stock}
                </span>
                {product.featured ? (
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                    Destacado
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  promoPrice: product.promoPrice,
                  imageUrl: product.imageUrl,
                }}
                large
              />
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Pedir por WhatsApp
                </a>
              ) : null}
              <Link
                href="/"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Volver a la tienda
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Pago</p>
              <p className="mt-2 text-lg font-bold text-slate-900">Contra entrega</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Despacho</p>
              <p className="mt-2 text-lg font-bold text-slate-900">Rapido y seguro</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Atencion</p>
              <p className="mt-2 text-lg font-bold text-slate-900">Directa por WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Tambien puede interesarte</h2>
            <p className="mt-1 text-slate-500">
              Productos relacionados para seguir comprando.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Ver mas
          </Link>
        </div>

        {relatedProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-slate-500 shadow-sm">
            No hay productos relacionados disponibles ahora mismo.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/producto/${relatedProduct.slug}`}
                className="rounded-3xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-4">
                  {relatedProduct.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="max-h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Sin imagen
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {relatedProduct.name}
                </h3>
                <p className="mt-2 text-base font-semibold text-slate-700">
                  {formatCurrency(relatedProduct.promoPrice ?? relatedProduct.price)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
