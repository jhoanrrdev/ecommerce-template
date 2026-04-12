"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/store/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CartPageClient({ whatsapp }: { whatsapp: string }) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });

  const message = items.length
    ? [
        "Hola, quiero realizar este pedido:",
        `Cliente: ${customer.name || "Pendiente"}`,
        `Telefono: ${customer.phone || "Pendiente"}`,
        `Correo: ${customer.email || "No informado"}`,
        `Ciudad: ${customer.city || "Pendiente"}`,
        `Direccion: ${customer.address || "Pendiente"}`,
        ...items.map(
          (item) =>
            `- ${item.name} x${item.quantity} (${formatCurrency(
              (item.promoPrice ?? item.price) * item.quantity
            )})`
        ),
        `Total estimado: ${formatCurrency(total)}`,
        customer.notes ? `Notas: ${customer.notes}` : "",
      ].join("\n")
    : "";

  const checkoutReady =
    customer.name.trim() && customer.phone.trim() && customer.city.trim();

  const whatsappUrl = whatsapp && items.length
    ? buildWhatsAppUrl(whatsapp, message)
    : null;

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Tu carrito esta vacio</h2>
        <p className="mt-3 text-slate-600">
          Agrega productos desde la tienda para continuar con tu compra.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Sin imagen
                    </span>
                  )}
                </div>

                <div>
                  <Link
                    href={`/producto/${item.slug}`}
                    className="text-xl font-bold text-slate-900 transition hover:text-brand-accent"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    Precio unitario: {formatCurrency(item.promoPrice ?? item.price)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value) || 1)
                  }
                  className="w-20 rounded-xl border border-slate-300 px-3 py-2 outline-none"
                />
                <p className="min-w-28 text-right text-lg font-bold text-slate-900">
                  {formatCurrency((item.promoPrice ?? item.price) * item.quantity)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
              Checkout
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">
              Datos del cliente
            </h2>
            <p className="mt-2 text-slate-500">
              Completa estos datos para enviar el pedido con mejor contexto.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={customer.name}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Nombre completo"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            <input
              value={customer.phone}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Telefono"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            <input
              value={customer.email}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Correo electronico"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            <input
              value={customer.city}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, city: event.target.value }))
              }
              placeholder="Ciudad"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
            <input
              value={customer.address}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, address: event.target.value }))
              }
              placeholder="Direccion de entrega"
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none md:col-span-2"
            />
            <textarea
              value={customer.notes}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Notas del pedido, referencias o instrucciones"
              className="min-h-[120px] rounded-xl border border-slate-300 px-4 py-3 outline-none md:col-span-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
          Resumen de compra
        </p>
        <h2 className="mt-3 text-3xl font-black">Tu pedido</h2>

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">
                {item.name} x{item.quantity}
              </span>
              <span className="font-semibold text-white">
                {formatCurrency((item.promoPrice ?? item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <span className="text-base text-slate-300">Total estimado</span>
            <span className="text-3xl font-black">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Cliente
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>Nombre: {customer.name || "Pendiente"}</p>
            <p>Telefono: {customer.phone || "Pendiente"}</p>
            <p>Ciudad: {customer.city || "Pendiente"}</p>
            {customer.address ? <p>Direccion: {customer.address}</p> : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {whatsappUrl ? (
            checkoutReady ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950"
              >
                Enviar pedido por WhatsApp
              </a>
            ) : (
              <div className="rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">
                Completa nombre, telefono y ciudad para continuar.
              </div>
            )
          ) : (
            <div className="rounded-xl bg-white/10 px-4 py-3 text-sm text-slate-300">
              Configura el WhatsApp de la tienda para finalizar pedidos.
            </div>
          )}
          <button
            type="button"
            onClick={clearCart}
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
