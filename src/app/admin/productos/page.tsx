import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductAdminTable } from "@/components/admin/ProductAdminTable";

export const dynamic = "force-dynamic";
export default async function ProductosAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="mt-2 text-slate-600">
            Administra los productos creados, revisa stock y entra a editar cada uno.
          </p>
        </div>

        <Link
          href="/admin/productos/nuevo"
          className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">Todavia no hay productos cargados.</p>
        </div>
      ) : (
        <ProductAdminTable products={products} />
      )}
    </section>
  );
}
