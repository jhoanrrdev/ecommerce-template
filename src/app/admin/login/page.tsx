export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Ingresar al panel</h1>
        <p className="mt-2 text-sm text-slate-600">Versión inicial. Luego conectamos autenticación real.</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
            <input className="w-full rounded-xl border px-4 py-3" type="email" placeholder="admin@mitienda.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
            <input className="w-full rounded-xl border px-4 py-3" type="password" placeholder="********" />
          </div>
          <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
