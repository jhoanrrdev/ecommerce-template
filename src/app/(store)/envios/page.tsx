export default function ShippingPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          Envios
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">Informacion de envios</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Esta seccion funciona como plantilla para explicar tiempos, cobertura y condiciones de entrega.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Cobertura</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Define ciudades, zonas o alcance nacional segun tu operacion.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Tiempo estimado</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Indica tiempos de entrega claros para reducir friccion al momento de comprar.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Pago contra entrega</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Aclara donde aplica y bajo que condiciones se confirma el pedido.
          </p>
        </div>
      </div>
    </section>
  );
}
