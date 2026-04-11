import { ProductForm } from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  return (
    <ProductForm
      mode="create"
      title="Nuevo producto"
      description="Crea un producto real en la base de datos."
      submitLabel="Guardar producto"
      successMessage="Producto creado correctamente"
      redirectTo="/admin/productos"
    />
  );
}
