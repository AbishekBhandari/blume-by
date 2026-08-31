"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNav({ title }: { title: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/admin" className="font-body text-xs uppercase tracking-wide text-gold">
          Blume by Binu — Admin
        </Link>
        <h1 className="font-display text-3xl text-ink">{title}</h1>
      </div>
      <button
        onClick={handleLogout}
        className="font-body text-sm text-rose underline"
      >
        Log out
      </button>
    </div>
  );
}
