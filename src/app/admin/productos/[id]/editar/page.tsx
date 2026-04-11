import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      mode="edit"
      productId={product.id}
      initialData={{
        name: product.name,
        description: product.description || "",
        price: String(product.price),
        promoPrice: product.promoPrice ? String(product.promoPrice) : "",
        stock: String(product.stock),
        sku: product.sku || "",
        imageUrl: product.imageUrl || "",
        active: product.active,
        featured: product.featured,
      }}
      title={`Editar producto #${product.id}`}
      description="Actualiza la informacion del producto y guarda los cambios."
      submitLabel="Actualizar producto"
      successMessage="Producto actualizado correctamente"
      redirectTo="/admin/productos"
    />
  );
}
