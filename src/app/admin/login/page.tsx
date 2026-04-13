import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{
    next?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Ingresar al panel</h1>
        <p className="mt-2 text-sm text-slate-600">
          Accede con tu usuario y contrasena de administrador.
        </p>

        <AdminLoginForm nextPath={params?.next} />
      </div>
    </div>
  );
}
