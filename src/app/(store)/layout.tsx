import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartProvider } from "@/components/store/CartProvider";
import { prisma } from "@/lib/prisma";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    prisma.setting.findFirst({
      orderBy: {
        id: "asc",
      },
    }),
    prisma.category.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 6,
    }),
  ]);

  return (
    <CartProvider>
      <div>
        <Header
          storeName={settings?.storeName || "Ecommerce Template"}
          logoUrl={settings?.logoUrl}
          categories={categories}
        />
        <main className="mx-auto max-w-[90rem] px-6 py-8">{children}</main>
        <Footer
          storeName={settings?.storeName || "Ecommerce Template"}
          whatsapp={settings?.whatsapp}
          address={settings?.address}
        />
      </div>
    </CartProvider>
  );
}
