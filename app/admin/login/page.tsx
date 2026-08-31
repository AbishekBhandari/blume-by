"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl text-ink">Admin login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="font-body text-sm text-ink/70" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-green/20 bg-surface p-3 font-body text-sm"
            autoFocus
          />
        </div>
        {error && <p className="font-body text-sm text-rose-dark">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-green py-3 font-body text-sm font-medium text-bg transition hover:bg-green-dark disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </section>
  );
}
