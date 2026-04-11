"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type InventoryItem = {
  id: number;
  name: string;
  sku: string | null;
  stock: number;
  active: boolean;
  featured: boolean;
  category: {
    name: string;
  } | null;
};

export function InventoryManager({ initialProducts }: { initialProducts: InventoryItem[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("todos");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filteredProducts = useMemo(() => {
    if (filter === "bajo") return products.filter((product) => product.stock <= 5);
    if (filter === "agotado") return products.filter((product) => product.stock === 0);
    return products;
  }, [products, filter]);

  async function saveStock(productId: number, value: string) {
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un numero entero valido");
      return;
    }

    setSavingId(productId);
    setError("");
    try {
      const res = await fetch(`/api/productos/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar el inventario");
      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? { ...product, stock } : product
        )
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar stock");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Productos controlados</p>
          <p className="mt-2 text-4xl font-black text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Stock bajo</p>
          <p className="mt-2 text-4xl font-black text-amber-800">
            {products.filter((item) => item.stock <= 5).length}
          </p>
        </div>
        <div className="rounded-3xl bg-rose-50 p-5 shadow-sm">
          <p className="text-sm text-rose-700">Agotados</p>
          <p className="mt-2 text-4xl font-black text-rose-800">
            {products.filter((item) => item.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Control de stock</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ajusta inventario rapido por producto.
            </p>
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none md:w-56"
          >
            <option value="todos">Todos</option>
            <option value="bajo">Solo stock bajo</option>
            <option value="agotado">Solo agotados</option>
          </select>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-sm text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sku || `ID #${product.id}`}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {product.category?.name || "Sin categoria"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        defaultValue={product.stock}
                        onBlur={(event) => saveStock(product.id, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            saveStock(product.id, (event.target as HTMLInputElement).value);
                          }
                        }}
                        className="w-28 rounded-xl border border-slate-300 px-3 py-2 outline-none"
                      />
                      {savingId === product.id ? (
                        <span className="text-xs text-slate-500">Guardando...</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock === 0
                            ? "bg-rose-100 text-rose-700"
                            : product.stock <= 5
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {product.stock === 0 ? "Agotado" : product.stock <= 5 ? "Stock bajo" : "Disponible"}
                      </span>
                      {product.featured ? (
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                          Destacado
                        </span>
                      ) : null}
                      {!product.active ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          Inactivo
                        </span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
