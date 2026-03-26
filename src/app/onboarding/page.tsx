"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const sectorOptions = [
  { slug: "bfsi", name: "BFSI", icon: "🏦" },
  { slug: "healthcare", name: "Healthcare", icon: "🏥" },
  { slug: "energy", name: "Energy", icon: "⚡" },
  { slug: "education", name: "Education", icon: "🎓" },
  { slug: "smartcities", name: "Smart Cities", icon: "🏙️" },
  { slug: "defence", name: "Defence", icon: "🛡️" },
  { slug: "egov", name: "eGovernance", icon: "🏛️" },
];

const roleOptions = [
  "Compliance",
  "Legal",
  "CXO",
  "Government Affairs",
  "Other",
];

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const regulatoryExposures = [
  "RBI regulated entity",
  "SEBI listed company",
  "IRDAI licensed",
  "Government contractor",
  "Foreign company / MNC",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sectors, setSectors] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [exposure, setExposure] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleSector(slug: string) {
    setSectors((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleState(state: string) {
    setStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  }

  function toggleExposure(item: string) {
    setExposure((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  async function handleComplete() {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Update user profile
    await supabase
      .from("users")
      .update({
        full_name: fullName,
        company,
        role,
        subscribed_sectors: sectors,
      })
      .eq("id", user.id);

    // Create org profile
    await supabase.from("org_profiles").upsert(
      {
        user_id: user.id,
        company_name: company,
        industry: sectors[0] || "general",
        states_of_operation: states,
        regulatory_exposure: exposure,
        priority_keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
      { onConflict: "user_id" }
    );

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-[var(--accent)]" style={{ fontFamily: "Playfair Display, serif" }}>
            PolicyAI
          </span>
          <div className="flex items-center justify-center gap-2 mt-4 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-colors ${
                  s <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-[var(--text-dim)]">Step {step} of 3</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Which sectors do you track?
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Select the regulatory sectors relevant to your business.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {sectorOptions.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => toggleSector(s.slug)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      sectors.includes(s.slug)
                        ? "bg-[var(--accent)]/10 border-[var(--accent)] text-white"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text-dim)]"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{s.icon}</span>
                    <span className="text-sm font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={sectors.length === 0}
                className="w-full mt-6 bg-[var(--accent)] text-[var(--bg)] py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Your Role</h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Help us tailor intelligence to your needs.
              </p>
              <div className="mb-4">
                <label className="block text-sm text-[var(--text-muted)] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-[var(--text-muted)] mb-1.5">Your Role</label>
                <div className="flex flex-wrap gap-2">
                  {roleOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                        role === r
                          ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--text-dim)]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-[var(--border)] text-[var(--text-dim)] rounded-lg hover:border-[var(--text-dim)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!fullName || !role}
                  className="flex-1 bg-[var(--accent)] text-[var(--bg)] py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Company Details
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                This helps us generate personalised impact analysis.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    className="w-full px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">States of Operation</label>
                  <div className="max-h-36 overflow-y-auto border border-[var(--border)] rounded-lg p-2 space-y-1">
                    {stateOptions.map((state) => (
                      <label key={state} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[var(--bg-card-hover)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={states.includes(state)}
                          onChange={() => toggleState(state)}
                          className="accent-[var(--accent)]"
                        />
                        <span className="text-sm text-[var(--text-muted)]">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">Regulatory Exposure</label>
                  <div className="space-y-2">
                    {regulatoryExposures.map((item) => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exposure.includes(item)}
                          onChange={() => toggleExposure(item)}
                          className="accent-[var(--accent)]"
                        />
                        <span className="text-sm text-[var(--text-muted)]">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1.5">
                    Priority Keywords <span className="text-[var(--text-dim)]">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="NBFC, digital lending, green hydrogen..."
                    className="w-full px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-[var(--border)] text-[var(--text-dim)] rounded-lg hover:border-[var(--text-dim)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={saving || !company}
                  className="flex-1 bg-[var(--accent)] text-[var(--bg)] py-3 rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
