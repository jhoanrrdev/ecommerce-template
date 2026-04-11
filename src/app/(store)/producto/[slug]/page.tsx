import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square rounded-3xl bg-white shadow-sm" />
      <div>
        <p className="text-sm text-slate-500">Producto</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{slug.replace(/-/g, " ")}</h1>
        <p className="mt-4 text-slate-600">
          Aquí irá el detalle real del producto con imágenes, precio, promoción y botón de pedido.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">Pedir por WhatsApp</button>
          <Link href="/tienda" className="rounded-xl border px-5 py-3 text-slate-900">
            Volver a la tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
