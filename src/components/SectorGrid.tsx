const sectors = [
  { slug: "bfsi", name: "BFSI", icon: "🏦", regulators: ["RBI", "SEBI", "IRDAI", "TRAI"] },
  { slug: "healthcare", name: "Healthcare", icon: "🏥", regulators: ["MoHFW", "CDSCO", "NMC", "AIIMS"] },
  { slug: "energy", name: "Energy", icon: "⚡", regulators: ["MNRE", "MoP", "CERC", "BEE"] },
  { slug: "education", name: "Education", icon: "🎓", regulators: ["MoE", "UGC", "AICTE", "NMC"] },
  { slug: "smartcities", name: "Smart Cities", icon: "🏙️", regulators: ["MoHUA", "MeitY", "BIS"] },
  { slug: "defence", name: "Defence", icon: "🛡️", regulators: ["MoD", "DRDO", "DDP", "DPIIT"] },
  { slug: "egov", name: "eGovernance", icon: "🏛️", regulators: ["MeitY", "DeitY", "NIC", "UIDAI"] },
];

export function SectorGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sectors.map((s) => (
        <a
          key={s.slug}
          href={`/dashboard?sector=${s.slug}`}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)] transition-all group"
        >
          <div className="text-3xl mb-3">{s.icon}</div>
          <h3 className="font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
            {s.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {s.regulators.map((r) => (
              <span
                key={r}
                className="text-xs bg-[var(--bg)]/60 text-[var(--text-dim)] px-2 py-0.5 rounded mono"
              >
                {r}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
