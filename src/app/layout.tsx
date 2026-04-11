import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.setting.findFirst({
    orderBy: {
      id: "asc",
    },
  });

  return {
    title: settings?.storeName || "Ecommerce Template",
    description: "Plantilla ecommerce para multiples negocios",
    icons:
      settings?.faviconUrl || settings?.logoUrl
        ? {
            icon: settings?.faviconUrl || settings?.logoUrl || undefined,
            shortcut: settings?.faviconUrl || settings?.logoUrl || undefined,
            apple: settings?.faviconUrl || settings?.logoUrl || undefined,
          }
        : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
