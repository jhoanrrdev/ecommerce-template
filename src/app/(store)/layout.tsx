import { Header } from "@/components/shared/Header";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-[90rem] px-6 py-8">{children}</main>
    </div>
  );
}
