import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          Contacto
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">Estamos listos para ayudarte</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Usa estos datos como plantilla para que tu cliente encuentre un canal claro de atencion.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">WhatsApp</h2>
          <p className="mt-3 text-slate-600">
            {settings?.whatsapp || "Configura el numero desde el panel administrativo."}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Direccion</h2>
          <p className="mt-3 text-slate-600">
            {settings?.address || "Configura la direccion de la tienda desde el panel administrativo."}
          </p>
        </div>
      </div>
    </section>
  );
}
