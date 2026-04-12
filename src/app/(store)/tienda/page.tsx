import { StorefrontContent } from "@/components/store/StorefrontContent";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    categoria?: string;
    q?: string;
    sort?: string;
    promo?: string;
  }>;
}) {
  return <StorefrontContent searchParams={searchParams} mode="catalog" />;
}
