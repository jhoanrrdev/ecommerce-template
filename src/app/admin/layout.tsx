import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-admin-pathname") || "";

  if (pathname.startsWith("/admin/login")) {
    return children;
  }

  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Panel personalizado
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {settings?.storeName || "Tu tienda"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {settings?.faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.faviconUrl}
                      alt="Favicon"
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">ICO</span>
                  )}
                </div>
                <div className="flex h-14 w-32 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 px-3">
                  {settings?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="max-h-10 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-500">Sin logo</span>
                  )}
                </div>
                <AdminLogoutButton />
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
