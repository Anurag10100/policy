const verticals = [
  {
    name: "BFSI",
    description:
      "RBI circulars, SEBI regulations, IRDAI guidelines, NBFC compliance updates",
    sources: "RBI, SEBI, IRDAI, MoF",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    name: "Healthcare",
    description:
      "MoHFW notifications, CDSCO drug approvals, NMC guidelines, AYUSH regulations",
    sources: "MoHFW, CDSCO, NMC, AYUSH",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    name: "Energy",
    description:
      "MNRE policies, CEA regulations, state electricity board orders, green energy mandates",
    sources: "MNRE, CEA, CERC, State ERCs",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    name: "EdTech",
    description:
      "UGC regulations, AICTE guidelines, NEP updates, state education department orders",
    sources: "UGC, AICTE, MoE, NCERT",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
  },
];

export function Verticals() {
  return (
    <section id="verticals" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Four Sectors. Complete Coverage.
        </h2>
        <p className="text-[var(--color-muted)] text-center mb-12 max-w-xl mx-auto">
          We track every regulatory body that matters to your industry, so you
          don&apos;t have to.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {verticals.map((v) => (
            <div
              key={v.name}
              className={`${v.color} border rounded-xl p-6 hover:shadow-md transition-shadow`}
            >
              <h3 className={`text-xl font-bold ${v.iconColor} mb-2`}>
                {v.name}
              </h3>
              <p className="text-[var(--color-text)] mb-3">{v.description}</p>
              <p className="text-sm text-[var(--color-muted)]">
                Sources: {v.sources}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
