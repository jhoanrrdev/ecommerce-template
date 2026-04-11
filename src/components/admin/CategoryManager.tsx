"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  active: boolean;
  _count: {
    products: number;
  };
};

export function CategoryManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, active: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la categoria");
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoria");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(category: CategoryItem) {
    setError("");
    try {
      const res = await fetch(`/api/categorias/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !category.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar la categoria");
      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? { ...item, active: !item.active } : item
        )
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar categoria");
    }
  }

  async function deleteCategory(category: CategoryItem) {
    if (!window.confirm(`Eliminar la categoria "${category.name}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/categorias/${category.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar la categoria");
      setCategories((current) => current.filter((item) => item.id !== category.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar categoria");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={createCategory} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Nueva categoria</h2>
          <p className="mt-2 text-sm text-slate-500">
            Crea grupos para organizar mejor el catalogo.
          </p>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="Ej. Herramientas"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Crear categoria"}
          </button>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Resumen</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{categories.length}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Activas</p>
              <p className="mt-2 text-3xl font-black text-emerald-800">
                {categories.filter((item) => item.active).length}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm text-sky-700">Productos agrupados</p>
              <p className="mt-2 text-3xl font-black text-sky-800">
                {categories.reduce((sum, item) => sum + item._count.products, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{category.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {category.slug}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  category.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {category.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {category._count.products} producto(s) en esta categoria.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => toggleActive(category)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {category.active ? "Desactivar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
