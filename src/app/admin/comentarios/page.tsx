import { prisma } from "@/lib/prisma";
import { TestimonialsForm } from "@/components/admin/TestimonialsForm";

export default async function AdminCommentsPage() {
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-brand-accent p-8 text-white shadow-xl">
        <h1 className="text-4xl font-black">Comentarios de clientes</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-200">
          Organiza testimonios reales y manten visible la confianza que transmite tu tienda.
        </p>
      </div>

      <TestimonialsForm
        initialData={{
          storeName: settings?.storeName || "",
          testimonials: [
            {
              name: settings?.testimonial1Name || "",
              role: settings?.testimonial1Role || "",
              comment: settings?.testimonial1Comment || "",
            },
            {
              name: settings?.testimonial2Name || "",
              role: settings?.testimonial2Role || "",
              comment: settings?.testimonial2Comment || "",
            },
            {
              name: settings?.testimonial3Name || "",
              role: settings?.testimonial3Role || "",
              comment: settings?.testimonial3Comment || "",
            },
          ],
        }}
      />
    </section>
  );
}
