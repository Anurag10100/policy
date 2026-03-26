"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("bfsi");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, sector }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-8 text-green-100">
        <p className="text-xl font-semibold mb-2">You&apos;re in!</p>
        <p>
          Welcome aboard as a founding subscriber. Your first policy briefing
          arrives this Monday.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-6 text-left shadow-xl"
    >
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sector
        </label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
        >
          <option value="bfsi">BFSI</option>
          <option value="healthcare">Healthcare</option>
          <option value="energy">Energy</option>
          <option value="edtech">EdTech</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-[var(--color-accent)] text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
      >
        {status === "loading"
          ? "Subscribing..."
          : "Subscribe — Founding Rate INR 3,000/mo"}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-gray-400 text-xs mt-3 text-center">
        Cancel anytime. First briefing delivered this Monday.
      </p>
    </form>
  );
}
