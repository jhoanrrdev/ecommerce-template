import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-brand-accent p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black">Configuracion</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-200">
          Ajusta branding, contacto y recursos principales de la tienda.
        </p>
      </div>

      <SettingsForm
        initialData={{
          storeName: settings?.storeName || "",
          logoUrl: settings?.logoUrl || "",
          faviconUrl: settings?.faviconUrl || "",
          whatsapp: settings?.whatsapp || "",
          address: settings?.address || "",
          primaryColor: settings?.primaryColor || "",
          secondaryColor: settings?.secondaryColor || "",
          bannerUrl: settings?.bannerUrl || "",
          wompiPublicKey: settings?.wompiPublicKey || "",
          wompiIntegritySecret: settings?.wompiIntegritySecret || "",
        }}
      />
    </section>
  );
}
