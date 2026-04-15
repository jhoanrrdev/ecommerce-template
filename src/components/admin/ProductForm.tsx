"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  promoPrice: string;
  stock: string;
  sku: string;
  imageUrl: string;
  categoryId: string;
  active: boolean;
  featured: boolean;
};

type CategoryOption = {
  id: number;
  name: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: number;
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  redirectTo: string;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  promoPrice: "",
  stock: "",
  sku: "",
  imageUrl: "",
  categoryId: "",
  active: true,
  featured: false,
};

export function ProductForm({
  mode,
  productId,
  initialData,
  categories,
  title,
  description,
  submitLabel,
  successMessage,
  redirectTo,
}: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    ...emptyForm,
    ...initialData,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  }

  async function uploadImage() {
    if (!selectedFile) return form.imageUrl;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo subir la imagen");
      }

      return data.url as string;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const uploadedImageUrl = await uploadImage();
      const endpoint =
        mode === "create" ? "/api/productos" : `/api/productos/${productId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          promoPrice: form.promoPrice ? Number(form.promoPrice) : null,
          stock: Number(form.stock),
          sku: form.sku || null,
          imageUrl: uploadedImageUrl || form.imageUrl || null,
          categoryId: form.categoryId ? Number(form.categoryId) : null,
          active: form.active,
          featured: form.featured,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el producto");
      }

      setSuccess(successMessage);

      if (mode === "create") {
        setForm(emptyForm);
        setSelectedFile(null);
      }

      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 700);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrio un error inesperado";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="Ej. Camiseta negra"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Descripcion
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="min-h-[120px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="Describe el producto"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Precio
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="100000"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Precio promocion
            </label>
            <input
              name="promoPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.promoPrice}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="80000"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              SKU
            </label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="SKU-001"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Categoria
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Sin categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Imagen desde tu computador
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            {selectedFile ? (
              <p className="mt-2 text-sm text-slate-500">
                Archivo seleccionado: {selectedFile.name}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              URL de imagen
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Activo
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Destacado
          </label>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading || uploadingImage ? "Guardando..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
