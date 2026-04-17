import { prisma } from "@/lib/prisma";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { parseOrderMetadata } from "@/lib/wompi";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              imageUrl: true,
            },
          },
        },
      },
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
          metadata: parseOrderMetadata(order.notes),
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          notes: order.notes,
          createdAt: order.createdAt.toISOString(),
          itemsCount: order.items.length,
          items: order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            productImageUrl: item.product.imageUrl,
          })),
        }))}
      />
    </section>
  );
}
