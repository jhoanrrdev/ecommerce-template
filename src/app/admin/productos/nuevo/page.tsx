import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <ProductForm
      mode="create"
      categories={categories}
      title="Nuevo producto"
      description="Crea un producto real en la base de datos."
      submitLabel="Guardar producto"
      successMessage="Producto creado correctamente"
      redirectTo="/admin/productos"
    />
  );
}
