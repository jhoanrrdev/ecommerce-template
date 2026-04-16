import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { mapWompiStatusToOrderStatus, wompiBaseUrl } from "@/lib/wompi";

type WompiPageProps = {
  searchParams?: Promise<{
    id?: string;
  }>;
};

export default async function WompiResponsePage({ searchParams }: WompiPageProps) {
  const params = await searchParams;
  const transactionId = params?.id || "";
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
    select: {
      wompiPublicKey: true,
    },
  });
  const publicKey = settings?.wompiPublicKey || "";

  let transaction:
    | {
        id: string;
        reference: string;
        status: string;
        status_message?: string;
        amount_in_cents: number;
        payment_method_type?: string;
      }
    | null = null;
  let fetchError = "";

  if (transactionId && publicKey) {
    try {
      const response = await fetch(`${wompiBaseUrl(publicKey)}/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${publicKey}`,
        },
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        fetchError = payload.error?.reason || "No se pudo consultar la transaccion";
      } else {
        transaction = payload.data;

        const matchingOrder = await prisma.order.findFirst({
          where: {
            notes: {
              contains: `[wompi_reference:${payload.data.reference}]`,
            },
          },
        });

        if (matchingOrder) {
          await prisma.order.update({
            where: {
              id: matchingOrder.id,
            },
            data: {
              status: mapWompiStatusToOrderStatus(payload.data.status),
              notes: [
                matchingOrder.notes || "",
                `[wompi_transaction_id:${payload.data.id}]`,
                `[wompi_status:${payload.data.status}]`,
              ]
                .filter(Boolean)
                .join("\n"),
            },
          });
        }
      }
    } catch (error) {
      console.error("Error consultando transaccion Wompi:", error);
      fetchError = "No se pudo validar la transaccion con Wompi";
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          Resultado del pago
        </p>
        <h1 className="mt-3 text-4xl font-black text-slate-900">Wompi</h1>

        {!transactionId ? (
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-amber-800">
            No llego el identificador de la transaccion. Revisa el resultado desde tu panel de Wompi.
          </div>
        ) : fetchError ? (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{fetchError}</div>
        ) : transaction ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Estado</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{transaction.status}</p>
              {transaction.status_message ? (
                <p className="mt-2 text-sm text-slate-600">{transaction.status_message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Transaccion</p>
                <p className="mt-2 font-semibold text-slate-900">{transaction.id}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Referencia</p>
                <p className="mt-2 font-semibold text-slate-900">{transaction.reference}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Monto</p>
                <p className="mt-2 font-semibold text-slate-900">
                  {formatCurrency(transaction.amount_in_cents / 100)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Metodo</p>
                <p className="mt-2 font-semibold text-slate-900">
                  {transaction.payment_method_type || "No informado"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/carrito"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Volver al carrito
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
