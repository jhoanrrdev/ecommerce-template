import { StorefrontContent } from "@/components/store/StorefrontContent";

export const dynamic = "force-dynamic";
export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{
    categoria?: string;
    q?: string;
    sort?: string;
    promo?: string;
  }>;
}) {
  return <StorefrontContent searchParams={searchParams} mode="home" />;
}
