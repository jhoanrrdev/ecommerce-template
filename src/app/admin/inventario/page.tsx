import { prisma } from "@/lib/prisma";
import { InventoryManager } from "@/components/admin/InventoryManager";

export const dynamic = "force-dynamic";
export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      stock: "asc",
    },
    include: {
      category: true,
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inventario</h1>
        <p className="mt-2 text-slate-600">
          Controla existencias y detecta productos con baja disponibilidad.
        </p>
      </div>

      <InventoryManager initialProducts={products} />
    </section>
  );
}
