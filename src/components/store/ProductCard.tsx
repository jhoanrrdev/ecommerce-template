import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  id: number;
  name: string;
  slug: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
};

export function ProductCard({ id, name, slug, price, promoPrice, stock }: ProductCardProps) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 aspect-square rounded-xl bg-slate-100" />
      <p className="text-xs text-slate-500">SKU #{id}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{name}</h3>
      <div className="mt-3 flex items-center gap-2">
        {promoPrice ? (
          <>
            <span className="text-lg font-bold text-emerald-600">{formatCurrency(promoPrice)}</span>
            <span className="text-sm text-slate-400 line-through">{formatCurrency(price)}</span>
          </>
        ) : (
          <span className="text-lg font-bold text-slate-900">{formatCurrency(price)}</span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">Stock: {stock}</p>
      <Link
        href={`/producto/${slug}`}
        className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
      >
        Ver producto
      </Link>
    </article>
  );
}
