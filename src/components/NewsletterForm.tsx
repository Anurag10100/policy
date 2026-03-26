"use client";

import { useState } from "react";

const sectorOptions = [
  { slug: "bfsi", name: "BFSI" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "energy", name: "Energy" },
  { slug: "education", name: "Education" },
  { slug: "smartcities", name: "Smart Cities" },
  { slug: "defence", name: "Defence" },
  { slug: "egov", name: "eGovernance" },
];

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sectors, setSectors] = useState<string[]>(["bfsi"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function toggleSector(slug: string) {
    setSectors((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sectors.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sectors, source: "landing_page" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-green-400 animate-fade-in">
        <p className="text-xl font-semibold mb-2">You&apos;re in.</p>
        <p className="text-green-400/80">Your first Policy Pulse digest arrives this Monday.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {sectorOptions.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => toggleSector(s.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              sectors.includes(s.slug)
                ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]"
                : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text-dim)]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="flex gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading" || sectors.length === 0}
          className="bg-[var(--accent)] text-[var(--bg)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center mt-3">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-[var(--text-dim)] text-xs text-center mt-3">
        Free weekly digest. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
