import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Ecommerce Template
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/tienda">Tienda</Link>
          <Link href="/promociones">Promociones</Link>
          <Link href="/carrito">Carrito</Link>
          <Link href="/admin/login" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
