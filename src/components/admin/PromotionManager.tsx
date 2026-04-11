"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PromotionItem = {
  id: number;
  title: string;
  type: string;
  value: number;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
};

export function PromotionManager({ initialPromotions }: { initialPromotions: PromotionItem[] }) {
  const router = useRouter();
  const [promotions, setPromotions] = useState(initialPromotions);
  const [form, setForm] = useState({
    title: "",
    type: "porcentaje",
    value: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createPromotion(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/promociones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          active: true,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear la promocion");
      setForm({ title: "", type: "porcentaje", value: "", startDate: "", endDate: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear promocion");
    } finally {
      setSaving(false);
    }
  }

  async function togglePromotion(promotion: PromotionItem) {
    setError("");
    try {
      const res = await fetch(`/api/promociones/${promotion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promotion.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar la promocion");
      setPromotions((current) =>
        current.map((item) =>
          item.id === promotion.id ? { ...item, active: !item.active } : item
        )
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar promocion");
    }
  }

  async function deletePromotion(promotion: PromotionItem) {
    if (!window.confirm(`Eliminar la promocion "${promotion.title}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/promociones/${promotion.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar la promocion");
      setPromotions((current) => current.filter((item) => item.id !== promotion.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar promocion");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createPromotion} className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">Titulo</label>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              placeholder="Ej. Semana de descuentos"
            />
          </div>
          <div className="md:w-48">
            <label className="mb-2 block text-sm font-medium text-slate-700">Tipo</label>
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="porcentaje">Porcentaje</option>
              <option value="valor_fijo">Valor fijo</option>
              <option value="precio_especial">Precio especial</option>
            </select>
          </div>
          <div className="md:w-40">
            <label className="mb-2 block text-sm font-medium text-slate-700">Valor</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.value}
              onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Crear promocion"}
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Fecha inicio</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Fecha fin</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-slate-900">{promotion.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  promotion.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {promotion.active ? "Activa" : "Inactiva"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Tipo: {promotion.type} • Valor: {promotion.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Vigencia: {promotion.startDate || "Sin inicio"} - {promotion.endDate || "Sin fin"}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => togglePromotion(promotion)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {promotion.active ? "Pausar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => deletePromotion(promotion)}
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
