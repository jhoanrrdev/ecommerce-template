"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type ProductRow = {
  id: number;
  name: string;
  sku: string | null;
  imageUrl: string | null;
  price: number;
  promoPrice: number | null;
  stock: number;
  categoryId: number | null;
  active: boolean;
  featured: boolean;
  category: {
    id: number;
    name: string;
  } | null;
};

type CategoryOption = {
  id: number;
  name: string;
};

type ProductAdminTableProps = {
  products: ProductRow[];
  categories: CategoryOption[];
};

export function ProductAdminTable({
  products,
  categories,
}: ProductAdminTableProps) {
  const router = useRouter();
  const [items, setItems] = useState(products);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingStockId, setSavingStockId] = useState<number | null>(null);
  const [savingPromoId, setSavingPromoId] = useState<number | null>(null);
  const [savingCategoryId, setSavingCategoryId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<number | null>(
    null
  );
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        (product.sku || "").toLowerCase().includes(normalizedQuery) ||
        (product.category?.name || "").toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "activos" && product.active) ||
        (statusFilter === "inactivos" && !product.active);

      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  function updateLocalProduct(productId: number, changes: Partial<ProductRow>) {
    setItems((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, ...changes } : product
      )
    );
  }

  async function patchProduct(productId: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/productos/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo actualizar el producto");
    }

    return data;
  }

  async function handleStockChange(productId: number, value: string) {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 0) {
      setError("El stock debe ser un numero entero mayor o igual a 0");
      return;
    }

    setSavingStockId(productId);
    setError("");

    try {
      await patchProduct(productId, { stock: numericValue });
      updateLocalProduct(productId, { stock: numericValue });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrio un error al actualizar stock"
      );
    } finally {
      setSavingStockId(null);
    }
  }

  async function handlePromoPriceChange(productId: number, value: string) {
    const promoValue = value.trim() === "" ? null : Number(value);

    if (promoValue !== null && (Number.isNaN(promoValue) || promoValue < 0)) {
      setError("El precio promocional debe ser mayor o igual a 0");
      return;
    }

    setSavingPromoId(productId);
    setError("");

    try {
      await patchProduct(productId, { promoPrice: promoValue });
      updateLocalProduct(productId, { promoPrice: promoValue });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrio un error al actualizar el precio promocional"
      );
    } finally {
      setSavingPromoId(null);
    }
  }

  async function handleCategoryChange(productId: number, value: string) {
    const nextCategoryId = value === "" ? null : Number(value);

    if (nextCategoryId !== null && Number.isNaN(nextCategoryId)) {
      setError("La categoria seleccionada no es valida");
      return;
    }

    const selectedCategory =
      nextCategoryId === null
        ? null
        : categories.find((category) => category.id === nextCategoryId) ?? null;

    setSavingCategoryId(productId);
    setError("");

    try {
      await patchProduct(productId, { categoryId: nextCategoryId });
      updateLocalProduct(productId, {
        categoryId: nextCategoryId,
        category: selectedCategory,
      });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrio un error al actualizar categoria"
      );
    } finally {
      setSavingCategoryId(null);
    }
  }

  async function handleToggleActive(productId: number, nextValue: boolean) {
    setTogglingId(productId);
    setError("");

    try {
      await patchProduct(productId, { active: nextValue });
      updateLocalProduct(productId, { active: nextValue });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrio un error al actualizar estado"
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function handleToggleFeatured(productId: number, nextValue: boolean) {
    setTogglingFeaturedId(productId);
    setError("");

    try {
      await patchProduct(productId, { featured: nextValue });
      updateLocalProduct(productId, { featured: nextValue });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrio un error al destacar"
      );
    } finally {
      setTogglingFeaturedId(null);
    }
  }

  async function handleDelete(productId: number, productName: string) {
    const confirmed = window.confirm(
      `Se eliminara "${productName}". Esta accion no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(productId);
    setError("");

    try {
      const res = await fetch(`/api/productos/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar el producto");
      }

      setItems((current) =>
        current.filter((product) => product.id !== productId)
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrio un error al eliminar"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="Buscar por nombre, SKU o categoria"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none md:w-52"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {filteredProducts.length} producto(s) encontrado(s)
        </p>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">Producto</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Destacado</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="text-sm text-slate-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.sku || `ID #${product.id}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(product.promoPrice ?? product.price)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Base: {formatCurrency(product.price)}
                        </p>
                      </div>
                      {product.promoPrice ? (
                        <p className="text-xs text-slate-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={product.promoPrice ?? ""}
                          onBlur={(event) =>
                            handlePromoPriceChange(product.id, event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handlePromoPriceChange(
                                product.id,
                                (event.target as HTMLInputElement).value
                              );
                            }
                          }}
                          className="w-28 rounded-lg border border-slate-300 px-3 py-2 outline-none"
                          placeholder="Promo"
                        />
                        {savingPromoId === product.id ? (
                          <span className="text-xs text-slate-500">Guardando...</span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.stock}
                        onBlur={(event) =>
                          handleStockChange(product.id, event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleStockChange(
                              product.id,
                              (event.target as HTMLInputElement).value
                            );
                          }
                        }}
                        className="w-24 rounded-lg border border-slate-300 px-3 py-2 outline-none"
                      />
                      {savingStockId === product.id ? (
                        <span className="text-xs text-slate-500">Guardando...</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(product.id, !product.active)
                      }
                      disabled={togglingId === product.id}
                      className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-60 ${
                        product.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {togglingId === product.id
                        ? "Actualizando..."
                        : product.active
                          ? "Activo"
                          : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFeatured(product.id, !product.featured)
                      }
                      disabled={togglingFeaturedId === product.id}
                      className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-60 ${
                        product.featured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {togglingFeaturedId === product.id
                        ? "Actualizando..."
                        : product.featured
                          ? "Destacado"
                          : "Normal"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <select
                        value={product.categoryId ?? ""}
                        onChange={(event) =>
                          handleCategoryChange(product.id, event.target.value)
                        }
                        className="w-44 rounded-lg border border-slate-300 px-3 py-2 outline-none"
                      >
                        <option value="">Sin categoria</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {savingCategoryId === product.id ? (
                        <span className="text-xs text-slate-500">Guardando...</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/productos/${product.id}/editar`}
                        className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                      >
                        {deletingId === product.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    No hay productos que coincidan con los filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
