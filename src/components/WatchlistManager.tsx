"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface TrackedItem {
  id: string;
  track_type: string;
  track_value: string;
  is_active: boolean;
  created_at: string;
  matchCount: number;
}

const trackTypes = [
  { value: "keyword", label: "Keyword" },
  { value: "ministry", label: "Ministry" },
  { value: "sector", label: "Sector" },
  { value: "bill_number", label: "Bill Number" },
];

export function WatchlistManager({
  initialItems,
  userId,
}: {
  initialItems: TrackedItem[];
  userId: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [trackType, setTrackType] = useState("keyword");
  const [trackValue, setTrackValue] = useState("");
  const [adding, setAdding] = useState(false);

  async function addItem() {
    if (!trackValue.trim()) return;
    setAdding(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracked_items")
      .insert({
        user_id: userId,
        track_type: trackType,
        track_value: trackValue.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setItems((prev) => [{ ...data, matchCount: 0 }, ...prev]);
      setTrackValue("");
    }
    setAdding(false);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const supabase = createClient();
    await supabase
      .from("tracked_items")
      .update({ is_active: !currentActive })
      .eq("id", id);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: !currentActive } : item
      )
    );
  }

  async function deleteItem(id: string) {
    const supabase = createClient();
    await supabase.from("tracked_items").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div>
      {/* Add new item */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={trackType}
            onChange={(e) => setTrackType(e.target.value)}
            className="px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white text-sm focus:border-[var(--accent)] focus:outline-none"
          >
            {trackTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={trackValue}
            onChange={(e) => setTrackValue(e.target.value)}
            placeholder={
              trackType === "keyword"
                ? "e.g., NBFC, digital lending"
                : trackType === "ministry"
                  ? "e.g., RBI, SEBI"
                  : trackType === "bill_number"
                    ? "e.g., Finance Bill 2026"
                    : "e.g., BFSI"
            }
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            className="flex-1 px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-white text-sm placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            onClick={addItem}
            disabled={adding || !trackValue.trim()}
            className="bg-[var(--accent)] text-[var(--bg)] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-dim)]">
          <p className="text-lg mb-2">No tracked items yet</p>
          <p className="text-sm">Add keywords or ministries to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4 transition-all ${
                !item.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-[var(--bg)] text-[var(--text-dim)] px-2 py-0.5 rounded mono uppercase">
                    {item.track_type}
                  </span>
                  <span className="font-medium text-white text-sm">
                    {item.track_value}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-dim)]">
                  {item.matchCount > 0
                    ? `${item.matchCount} match${item.matchCount !== 1 ? "es" : ""} this week`
                    : "No matches this week"}
                </span>
              </div>

              <button
                onClick={() => toggleActive(item.id, item.is_active)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  item.is_active
                    ? "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    : "border-[var(--border)] text-[var(--text-dim)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                {item.is_active ? "Active" : "Paused"}
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="text-xs text-[var(--text-dim)] hover:text-red-400 transition-colors px-2 py-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
