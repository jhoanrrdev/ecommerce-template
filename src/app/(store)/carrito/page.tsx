import { prisma } from "@/lib/prisma";
import { CartPageClient } from "@/components/store/CartPageClient";

export default async function CartPage() {
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Carrito</h1>
        <p className="mt-3 text-lg text-slate-600">
          Revisa tus productos, ajusta cantidades y finaliza tu pedido.
        </p>
      </div>

      <CartPageClient
        whatsapp={settings?.whatsapp || ""}
        wompiEnabled={Boolean(settings?.wompiPublicKey && settings?.wompiIntegritySecret)}
      />
    </section>
  );
}
