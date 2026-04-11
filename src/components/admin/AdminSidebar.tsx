import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", hint: "Resumen" },
  { href: "/admin/productos", label: "Productos", hint: "Catalogo" },
  { href: "/admin/categorias", label: "Categorias", hint: "Organizacion" },
  { href: "/admin/inventario", label: "Inventario", hint: "Stock" },
  { href: "/admin/promociones", label: "Promociones", hint: "Ventas" },
  { href: "/admin/pedidos", label: "Pedidos", hint: "Operaciones" },
  { href: "/admin/configuracion", label: "Configuracion", hint: "Tienda" },
];

export function AdminSidebar() {
  return (
    <aside className="min-h-screen w-72 border-r border-slate-200 bg-slate-950 px-5 py-6 text-white">
      <div className="rounded-3xl bg-gradient-to-br from-brand-accent via-sky-500 to-cyan-400 p-5 text-slate-950 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-900/70">
          Panel
        </p>
        <h2 className="mt-2 text-2xl font-black">Administrador</h2>
        <p className="mt-2 text-sm font-medium text-slate-900/75">
          Controla catalogo, ventas, pedidos y configuracion desde un solo lugar.
        </p>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <span className="font-medium">{link.label}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {link.hint}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
