import Link from "next/link";

type FooterProps = {
  storeName: string;
  whatsapp?: string | null;
  address?: string | null;
};

export function Footer({ storeName, whatsapp, address }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-[90rem] gap-8 px-6 py-10 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
            {storeName}
          </p>
          <h2 className="mt-3 text-2xl font-black">Plantilla ecommerce lista para vender.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Catalogo visual, carrito, promociones y cierre por WhatsApp en un flujo simple.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Navegacion
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/" className="transition hover:text-white">
              Inicio
            </Link>
            <Link href="/tienda" className="transition hover:text-white">
              Tienda
            </Link>
            <Link href="/promociones" className="transition hover:text-white">
              Promociones
            </Link>
            <Link href="/carrito" className="transition hover:text-white">
              Carrito
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Informacion
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/contacto" className="transition hover:text-white">
              Contacto
            </Link>
            <Link href="/envios" className="transition hover:text-white">
              Envios
            </Link>
            <Link href="/politicas" className="transition hover:text-white">
              Politicas
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Contacto
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>{whatsapp || "Configura el WhatsApp en el panel admin"}</p>
            <p>{address || "Configura la direccion de la tienda en el panel admin"}</p>
            <p className="text-slate-500">Contra entrega y atencion directa.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
