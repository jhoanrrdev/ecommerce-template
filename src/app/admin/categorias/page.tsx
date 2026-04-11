import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Categorias</h1>
        <p className="mt-2 text-slate-600">
          Crea, activa y organiza las categorias del catalogo.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </section>
  );
}
