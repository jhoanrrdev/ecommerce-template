"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "DELETE",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
    >
      Cerrar sesion
    </button>
  );
}
