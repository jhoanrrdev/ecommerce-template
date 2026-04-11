import { prisma } from "@/lib/prisma";
import { OrdersManager } from "@/components/admin/OrdersManager";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>
        <p className="mt-2 text-slate-600">
          Revisa estados, clientes y el avance de cada entrega.
        </p>
      </div>

      <OrdersManager
        initialOrders={orders.map((order) => ({
          id: order.id,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          notes: order.notes,
          createdAt: order.createdAt.toISOString(),
          itemsCount: order.items.length,
        }))}
      />
    </section>
  );
}
