"use client";

import { useState } from "react";

type TestimonialItem = {
  name: string;
  role: string;
  comment: string;
};

type TestimonialsFormData = {
  storeName: string;
  testimonials: TestimonialItem[];
};

export function TestimonialsForm({ initialData }: { initialData: TestimonialsFormData }) {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateTestimonial(index: number, field: keyof TestimonialItem, value: string) {
    setForm((current) => ({
      ...current,
      testimonials: current.testimonials.map((testimonial, testimonialIndex) =>
        testimonialIndex === index ? { ...testimonial, [field]: value } : testimonial
      ),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const [first, second, third] = form.testimonials;

      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: form.storeName,
          testimonial1Name: first.name,
          testimonial1Role: first.role,
          testimonial1Comment: first.comment,
          testimonial2Name: second.name,
          testimonial2Role: second.role,
          testimonial2Comment: second.comment,
          testimonial3Name: third.name,
          testimonial3Role: third.role,
          testimonial3Comment: third.comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudieron guardar los comentarios");
      }

      setMessage("Comentarios guardados correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar comentarios");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
      {!form.storeName ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nombre de la tienda</label>
          <input
            value={form.storeName}
            onChange={(event) => setForm((current) => ({ ...current, storeName: event.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="Nombre de la tienda"
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Estos comentarios se muestran en la pagina principal como prueba social para ayudar a vender.
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {form.testimonials.map((testimonial, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Comentario {index + 1}
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
                <input
                  value={testimonial.name}
                  onChange={(event) => updateTestimonial(index, "name", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Nombre del cliente"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Cargo o contexto</label>
                <input
                  value={testimonial.role}
                  onChange={(event) => updateTestimonial(index, "role", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Ejemplo: Cliente frecuente"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Comentario</label>
                <textarea
                  value={testimonial.comment}
                  onChange={(event) => updateTestimonial(index, "comment", event.target.value)}
                  className="min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                  placeholder="Escribe aqui la experiencia del cliente"
                />
              </div>
            </div>
          </div>
        ))}
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
        {saving ? "Guardando..." : "Guardar comentarios"}
      </button>
    </form>
  );
}
