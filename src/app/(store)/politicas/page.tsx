export default function PoliciesPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          Politicas
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">Politicas de la tienda</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Usa esta plantilla para publicar terminos de compra, cambios, garantias y privacidad.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Cambios y devoluciones</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Define tiempos, condiciones del producto y pasos para gestionar solicitudes.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Garantia</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Explica cobertura, exclusiones y canales de soporte para reclamos.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Privacidad</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Aclara como se usan los datos del cliente en pedidos, seguimiento y atencion.
          </p>
        </div>
      </div>
    </section>
  );
}
