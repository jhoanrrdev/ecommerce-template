"use client";

import { useState } from "react";

type SettingsData = {
  storeName: string;
  logoUrl: string;
  faviconUrl: string;
  whatsapp: string;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  bannerUrl: string;
  wompiPublicKey: string;
  wompiIntegritySecret: string;
};

export function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [form, setForm] = useState(initialData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function uploadFile(file: File | null) {
    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo subir la imagen");
    }

    return data.url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const [uploadedLogoUrl, uploadedFaviconUrl] = await Promise.all([
        uploadFile(logoFile),
        uploadFile(faviconFile),
      ]);

      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logoUrl: uploadedLogoUrl || form.logoUrl,
          faviconUrl: uploadedFaviconUrl || form.faviconUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar la configuracion");
      setForm((current) => ({
        ...current,
        logoUrl: uploadedLogoUrl || current.logoUrl,
        faviconUrl: uploadedFaviconUrl || current.faviconUrl,
      }));
      setLogoFile(null);
      setFaviconFile(null);
      setMessage("Configuracion guardada correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar configuracion");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Nombre de la tienda</label>
          <input
            value={form.storeName}
            onChange={(event) => setForm((current) => ({ ...current, storeName: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="Nombre de la tienda"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">WhatsApp</label>
          <input
            value={form.whatsapp}
            onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="573001234567"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Direccion</label>
          <input
            value={form.address}
            onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="Direccion principal"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Color principal</label>
          <input
            value={form.primaryColor}
            onChange={(event) => setForm((current) => ({ ...current, primaryColor: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="#111827"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Color secundario</label>
          <input
            value={form.secondaryColor}
            onChange={(event) => setForm((current) => ({ ...current, secondaryColor: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="#2563eb"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Logo URL</label>
          <input
            value={form.logoUrl}
            onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Favicon URL</label>
          <input
            value={form.faviconUrl}
            onChange={(event) => setForm((current) => ({ ...current, faviconUrl: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Banner URL</label>
          <input
            value={form.bannerUrl}
            onChange={(event) => setForm((current) => ({ ...current, bannerUrl: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Wompi public key</label>
          <input
            value={form.wompiPublicKey}
            onChange={(event) => setForm((current) => ({ ...current, wompiPublicKey: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="pub_test_..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Wompi integrity secret</label>
          <input
            type="password"
            value={form.wompiIntegritySecret}
            onChange={(event) =>
              setForm((current) => ({ ...current, wompiIntegritySecret: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="test_integrity_..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Subir logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Subir favicon</label>
          <input
            type="file"
            accept="image/x-icon,image/png,image/svg+xml,image/*"
            onChange={(event) => setFaviconFile(event.target.files?.[0] || null)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Configura aqui las llaves de Wompi para habilitar pagos online desde el carrito.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700">Vista previa logo</p>
          <div className="mt-3 flex h-24 items-center justify-center rounded-2xl bg-slate-50">
            {form.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.logoUrl} alt="Logo" className="max-h-16 max-w-full object-contain" />
            ) : (
              <span className="text-sm text-slate-400">Sin logo</span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-700">Vista previa favicon</p>
          <div className="mt-3 flex h-24 items-center justify-center rounded-2xl bg-slate-50">
            {form.faviconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.faviconUrl} alt="Favicon" className="h-12 w-12 object-contain" />
            ) : (
              <span className="text-sm text-slate-400">Sin favicon</span>
            )}
          </div>
        </div>
      </div>

      {message ? (
        <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar configuracion"}
      </button>
    </form>
  );
}
