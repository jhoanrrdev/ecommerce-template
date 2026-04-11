import { prisma } from "@/lib/prisma";
import { PromotionManager } from "@/components/admin/PromotionManager";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Promociones</h1>
        <p className="mt-2 text-slate-600">
          Crea campañas y activa descuentos sin salir del panel.
        </p>
      </div>

      <PromotionManager
        initialPromotions={promotions.map((promotion) => ({
          ...promotion,
          startDate: promotion.startDate ? promotion.startDate.toISOString().slice(0, 10) : null,
          endDate: promotion.endDate ? promotion.endDate.toISOString().slice(0, 10) : null,
        }))}
      />
    </section>
  );
}
