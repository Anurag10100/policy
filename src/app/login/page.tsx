"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full animate-fade-in">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-[var(--accent)]" style={{ fontFamily: "Playfair Display, serif" }}>
            PolicyAI
          </a>
          <p className="text-[var(--text-muted)] mt-2">
            Sign in to your intelligence dashboard
          </p>
        </div>

        {status === "sent" ? (
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-xl p-8 text-center">
            <p className="text-[var(--accent)] font-semibold text-lg mb-2">Check your inbox</p>
            <p className="text-[var(--text-muted)] text-sm">
              We sent a magic link to <strong className="text-white">{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none mb-4"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[var(--accent)] text-[var(--bg)] py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>
            {status === "error" && (
              <p className="text-red-400 text-sm text-center mt-3">
                Something went wrong. Please try again.
              </p>
            )}
            <p className="text-[var(--text-dim)] text-xs text-center mt-4">
              No password needed. We&apos;ll email you a sign-in link.
            </p>
          </form>
        )}

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-[var(--text-dim)] hover:text-[var(--text)]">
            ← Back to PolicyAI
          </a>
        </div>
      </div>
    </main>
  );
}
