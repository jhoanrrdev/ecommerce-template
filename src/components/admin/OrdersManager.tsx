"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type OrderItem = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  total: number;
  status: string;
  notes: string | null;
  createdAt: string;
  itemsCount: number;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date(date));
}

export function OrdersManager({ initialOrders }: { initialOrders: OrderItem[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("todos");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const filteredOrders = useMemo(() => {
    if (filter === "todos") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  async function updateStatus(orderId: number, status: string) {
    setSavingId(orderId);
    setError("");
    try {
      const res = await fetch(`/api/pedidos/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo actualizar el pedido");
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar pedido");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pedidos totales</p>
          <p className="mt-2 text-4xl font-black text-slate-900">{orders.length}</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pendientes</p>
          <p className="mt-2 text-4xl font-black text-amber-800">
            {orders.filter((order) => order.status === "pendiente").length}
          </p>
        </div>
        <div className="rounded-3xl bg-sky-50 p-5 shadow-sm">
          <p className="text-sm text-sky-700">Confirmados</p>
          <p className="mt-2 text-4xl font-black text-sky-800">
            {orders.filter((order) => order.status === "confirmado").length}
          </p>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Ingresos</p>
          <p className="mt-2 text-2xl font-black text-emerald-800">
            {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Gestion de pedidos</h2>
            <p className="mt-1 text-sm text-slate-500">Actualiza estados sin salir del panel.</p>
          </div>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none md:w-56"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="mt-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              No hay pedidos para este filtro.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-slate-100 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Pedido #{order.id} • {order.customerName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.customerPhone}
                      {order.customerEmail ? ` • ${order.customerEmail}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.itemsCount} item(s) • {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 lg:items-end">
                    <p className="text-2xl font-black text-slate-900">
                      {formatCurrency(order.total)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value)}
                      disabled={savingId === order.id}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                {order.notes ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {order.notes}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
