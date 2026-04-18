export type RegulatorCode =
  | "SEBI" | "RBI" | "MCA" | "CBIC" | "CBDT" | "TRAI" | "IRDAI"
  | "DPIIT" | "CERC" | "CCI" | "MeitY" | "CDSCO" | "PFRDA" | "NPCI";

export const REGULATORS: Record<RegulatorCode, { code: RegulatorCode; name: string; hue: "ink" }> = {
  SEBI:  { code: "SEBI",  name: "Securities and Exchange Board of India",                 hue: "ink" },
  RBI:   { code: "RBI",   name: "Reserve Bank of India",                                   hue: "ink" },
  MCA:   { code: "MCA",   name: "Ministry of Corporate Affairs",                           hue: "ink" },
  CBIC:  { code: "CBIC",  name: "Central Board of Indirect Taxes and Customs",             hue: "ink" },
  CBDT:  { code: "CBDT",  name: "Central Board of Direct Taxes",                           hue: "ink" },
  TRAI:  { code: "TRAI",  name: "Telecom Regulatory Authority of India",                   hue: "ink" },
  IRDAI: { code: "IRDAI", name: "Insurance Regulatory and Development Authority",          hue: "ink" },
  DPIIT: { code: "DPIIT", name: "Department for Promotion of Industry and Internal Trade", hue: "ink" },
  CERC:  { code: "CERC",  name: "Central Electricity Regulatory Commission",               hue: "ink" },
  CCI:   { code: "CCI",   name: "Competition Commission of India",                         hue: "ink" },
  MeitY: { code: "MeitY", name: "Ministry of Electronics and IT",                          hue: "ink" },
  CDSCO: { code: "CDSCO", name: "Central Drugs Standard Control Organisation",             hue: "ink" },
  PFRDA: { code: "PFRDA", name: "Pension Fund Regulatory and Development Authority",       hue: "ink" },
  NPCI:  { code: "NPCI",  name: "National Payments Corporation of India",                  hue: "ink" },
};

export const EXAMPLE_CHIPS: string[] = [
  "Latest SEBI AIF amendments",
  "RBI digital lending norms timeline",
  "GST ITC on employee insurance, state-wise",
  "IRDAI surrender value rules for par policies",
  "MCA related-party disclosure thresholds FY26",
];

export type Thread = { id: string; q: string; last: string; regs: RegulatorCode[] };

export const THREADS: Thread[] = [
  { id: "t1", q: "SEBI AIF Regulations — Category II PPM amendments", last: "2 hrs ago", regs: ["SEBI"] },
  { id: "t2", q: "RBI Digital Lending Directions — DLG cap interpretation", last: "Yesterday", regs: ["RBI"] },
  { id: "t3", q: "GST ITC on employee group mediclaim (state-wise divergence)", last: "Yesterday", regs: ["CBIC"] },
  { id: "t4", q: "IRDAI (Surrender Value) Regulations 2024 — par vs non-par", last: "2 days ago", regs: ["IRDAI"] },
  { id: "t5", q: "MCA CSR unspent amount — ongoing project classification", last: "4 days ago", regs: ["MCA"] },
  { id: "t6", q: "TRAI OTT licensing consultation — scope of \"communication service\"", last: "5 days ago", regs: ["TRAI"] },
  { id: "t7", q: "DPDP Act — consent manager registration readiness", last: "1 wk ago", regs: ["MeitY"] },
  { id: "t8", q: "CERC ancillary services mechanism — battery storage eligibility", last: "1 wk ago", regs: ["CERC"] },
];

export type Citation = {
  id: number;
  regulator: RegulatorCode;
  title: string;
  ref: string;
  section: string;
  issued: string;
  effective: string;
  type: string;
  excerpt: string;
  score: number;
};

export const CITATIONS: Citation[] = [
  {
    id: 1,
    regulator: "SEBI",
    title: "SEBI (Alternative Investment Funds) (Second Amendment) Regulations, 2026",
    ref: "No. SEBI/LAD-NRO/GN/2026/221",
    section: "Reg. 20(21A)",
    issued: "08 Apr 2026",
    effective: "01 May 2026",
    type: "Gazette Notification",
    excerpt:
      "Every scheme of a Category II AIF which has originated or acquired debt securities shall, before 30 September 2026, value such holdings as per the valuation methodology specified by an Association of Investment Managers approved by the Board, and disclose dispersion of valuations in the quarterly report to investors.",
    score: 0.94,
  },
  {
    id: 2,
    regulator: "SEBI",
    title: "Master Circular for Alternative Investment Funds — April 2026 edition",
    ref: "SEBI/HO/AFD/PoD1/CIR/P/2026/42",
    section: "Chapter 3, ¶ 3.4.2",
    issued: "10 Apr 2026",
    effective: "10 Apr 2026",
    type: "Master Circular",
    excerpt:
      "The Private Placement Memorandum of every Category II AIF shall include a dedicated \"Dispersion and Redressal\" annexure setting out the mechanism for handling dissenting investors where the valuation of unlisted debt instruments diverges by more than 20% across independent valuers.",
    score: 0.88,
  },
  {
    id: 3,
    regulator: "SEBI",
    title: "Informal Guidance under Reg. 20 of the AIF Regulations to Avendus Future Leaders Fund III",
    ref: "SEBI/HO/AFD/SEC-1/OW/2026/9876",
    section: "Query 2",
    issued: "02 Apr 2026",
    effective: "—",
    type: "Informal Guidance",
    excerpt:
      "A Category II AIF that invests predominantly in unlisted non-convertible debentures issued by performing credit portfolio companies is not required to designate an independent \"credit risk manager\" separate from the Investment Committee, provided that the Investment Committee includes at least one external member with credit assessment experience.",
    score: 0.81,
  },
  {
    id: 4,
    regulator: "SEBI",
    title: "Consultation Paper on Accredited Investor framework for AIFs and PMS",
    ref: "CP/AFD/APR-2026",
    section: "¶ 11–14",
    issued: "28 Mar 2026",
    effective: "—",
    type: "Consultation Paper",
    excerpt:
      "It is proposed that the minimum commitment for an Accredited Investor into a Category II AIF be reduced from ₹1 crore to ₹25 lakh, subject to the investor meeting the net-worth criterion of ₹7.5 crore or financial assets of ₹5 crore.",
    score: 0.67,
  },
  {
    id: 5,
    regulator: "SEBI",
    title: "Board Meeting Press Release — 317th Meeting",
    ref: "PR No. 8/2026",
    section: "—",
    issued: "14 Apr 2026",
    effective: "—",
    type: "Press Release",
    excerpt:
      "The Board approved amendments to the AIF Regulations to introduce a framework for co-investment through a separate vehicle and to recognise differential rights among investors of the same class, in line with recommendations of the Alternative Investment Policy Advisory Committee.",
    score: 0.62,
  },
];

export type CorpusRow = {
  regulator: RegulatorCode;
  type: string;
  title: string;
  ref: string;
  issued: string;
  effective: string;
  tags: string[];
  excerpt: string;
  sector: string;
  state: string;
};

export const CORPUS_ROWS: CorpusRow[] = [
  {
    regulator: "RBI", type: "Master Direction",
    title: "Master Direction — Digital Lending (Updated as on 04 Apr 2026)",
    ref: "RBI/DoR/2026-27/103 DoR.STR.REC.18/21.04.048/2026-27",
    issued: "04 Apr 2026", effective: "01 Jul 2026",
    tags: ["Digital Lending", "DLG", "FLDG", "LSP"],
    excerpt:
      "Default Loss Guarantee arrangements between Regulated Entities and Lending Service Providers shall not exceed five percent of the amount of loan portfolio…",
    sector: "BFSI", state: "Pan-India",
  },
  {
    regulator: "SEBI", type: "Gazette Notification",
    title: "SEBI (Alternative Investment Funds) (Second Amendment) Regulations, 2026",
    ref: "No. SEBI/LAD-NRO/GN/2026/221", issued: "08 Apr 2026", effective: "01 May 2026",
    tags: ["AIF", "Category II", "Valuation", "PPM"],
    excerpt:
      "Every scheme of a Category II AIF which has originated or acquired debt securities shall value such holdings…",
    sector: "BFSI", state: "Pan-India",
  },
  {
    regulator: "CBIC", type: "Circular",
    title: "Clarification on availability of ITC on group health insurance of employees",
    ref: "Circular No. 232/26/2026-GST", issued: "11 Apr 2026", effective: "11 Apr 2026",
    tags: ["GST", "ITC", "Sec. 17(5)", "Insurance"],
    excerpt:
      "Where provision of group health insurance cover is obligatory for the employer under any law for the time being in force, input tax credit on such insurance shall be available…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "IRDAI", type: "Regulation",
    title: "IRDAI (Insurance Products) Regulations, 2024 — Surrender Value Amendment",
    ref: "F. No. IRDAI/Reg/9/201/2026", issued: "06 Apr 2026", effective: "01 Oct 2026",
    tags: ["Surrender Value", "Par", "Non-Par", "Persistency"],
    excerpt:
      "Special surrender value for participating products shall not be lower than the guaranteed surrender value computed as per the methodology in Schedule II…",
    sector: "BFSI", state: "Pan-India",
  },
  {
    regulator: "MCA", type: "Notification",
    title: "Companies (Corporate Social Responsibility Policy) Amendment Rules, 2026",
    ref: "G.S.R. 219(E)", issued: "27 Mar 2026", effective: "01 Apr 2026",
    tags: ["CSR", "Unspent", "Ongoing Project"],
    excerpt:
      "The period for which an ongoing project may continue under sub-rule (1) shall not exceed five financial years, excluding the year in which it was commenced…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "TRAI", type: "Consultation Paper",
    title: "Regulatory framework for OTT communication services and selective banning",
    ref: "CP No. 04/2026", issued: "22 Mar 2026", effective: "—",
    tags: ["OTT", "Licensing", "Interception"],
    excerpt:
      "The Authority invites comments on whether OTT communication services should be brought under a light-touch authorisation regime…",
    sector: "Telecom", state: "Pan-India",
  },
  {
    regulator: "MeitY", type: "Draft Rules",
    title: "Digital Personal Data Protection Rules, 2026 — Revised Draft",
    ref: "F. No. 3(1)/2024-DPDP", issued: "18 Mar 2026", effective: "—",
    tags: ["DPDP", "Consent Manager", "Cross-border"],
    excerpt:
      "A Consent Manager shall be a company incorporated in India with a net worth of not less than ₹2 crore and shall be registered with the Board…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "CBDT", type: "Circular",
    title: "Guidelines under section 194R on perquisites to business associates",
    ref: "Circular No. 07/2026", issued: "15 Apr 2026", effective: "15 Apr 2026",
    tags: ["TDS", "194R", "Perquisites"],
    excerpt:
      "Where the benefit or perquisite is provided in kind and the provider is unable to realise TDS in cash, the provider shall ensure tax has been paid by the recipient…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "CERC", type: "Regulation",
    title: "CERC (Ancillary Services) Regulations, 2026",
    ref: "L-1/268/2023-CERC", issued: "12 Apr 2026", effective: "01 Jun 2026",
    tags: ["Ancillary", "BESS", "Frequency"],
    excerpt:
      "Battery Energy Storage Systems of capacity not less than 10 MW/40 MWh shall be eligible to participate in the Tertiary Reserve Ancillary Service market…",
    sector: "Energy", state: "Pan-India",
  },
  {
    regulator: "CCI", type: "Order",
    title: "CCI v. Major Online Travel Aggregators — Order under Section 27",
    ref: "Case No. 14 of 2024", issued: "03 Apr 2026", effective: "03 Apr 2026",
    tags: ["Antitrust", "MFN", "Digital Markets"],
    excerpt:
      "The Commission, on examination of evidence, finds that the imposition of wide parity clauses by OP-1 and OP-2 on partner hotels has the effect of restricting intra-brand price competition…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "DPIIT", type: "Press Note",
    title: "Press Note No. 2 (2026 Series) — FDI policy amendment in space sector",
    ref: "P.N. 2 of 2026", issued: "20 Mar 2026", effective: "20 Mar 2026",
    tags: ["FDI", "Space", "Automatic Route"],
    excerpt:
      "FDI up to 74% in satellite manufacturing and operation shall be permitted under the automatic route; beyond 74% under Government route…",
    sector: "Cross-sector", state: "Pan-India",
  },
  {
    regulator: "CDSCO", type: "Notification",
    title: "New Drugs and Clinical Trials (Third Amendment) Rules, 2026",
    ref: "G.S.R. 241(E)", issued: "30 Mar 2026", effective: "01 Jul 2026",
    tags: ["Clinical Trials", "Orphan Drugs", "Waiver"],
    excerpt:
      "The licensing authority may waive the requirement of local clinical trials for new drugs already approved in a specified regulated country, subject to post-marketing surveillance…",
    sector: "Pharma", state: "Pan-India",
  },
  {
    regulator: "RBI", type: "Circular",
    title: "Review of Regulatory Framework for NBFC-P2P Lending Platforms",
    ref: "RBI/2026-27/14 DoR.NBFC(PD).CC.No.201/03.10.001/2026-27",
    issued: "01 Apr 2026", effective: "01 May 2026",
    tags: ["NBFC-P2P", "Exposure", "Escrow"],
    excerpt:
      "The aggregate exposure of a lender across all P2P platforms to a single borrower shall not exceed ₹50,000 at any point in time…",
    sector: "BFSI", state: "Pan-India",
  },
  {
    regulator: "PFRDA", type: "Regulation",
    title: "PFRDA (Point of Presence) Amendment Regulations, 2026",
    ref: "PFRDA/Reg/PoP/2026/03", issued: "14 Apr 2026", effective: "01 Jun 2026",
    tags: ["NPS", "PoP", "Onboarding"],
    excerpt:
      "A Point of Presence may, with prior intimation to the Authority, engage any banking correspondent registered with the Reserve Bank of India as a sub-entity for on-boarding subscribers…",
    sector: "BFSI", state: "Pan-India",
  },
];

export type DiffPart = { t: string; k: "ctx" | "add" | "del" };

export type AlertMatch = {
  when: string;
  regulator: RegulatorCode;
  title: string;
  diff: DiffPart[];
};

export type Alert = {
  id: string;
  name: string;
  query: string;
  topics: string[];
  lastHit: string;
  hits7d: number;
  hitsTotal: number;
  active: boolean;
  matches: AlertMatch[];
};

export const ALERTS: Alert[] = [
  {
    id: "a1",
    name: "SEBI AIF — Category II / Valuation",
    query: "(SEBI OR \"Alternative Investment Fund\") AND \"Category II\" AND (valuation OR dispersion)",
    topics: ["SEBI", "AIF", "Category II"],
    lastHit: "14 Apr 2026",
    hits7d: 4, hitsTotal: 28,
    active: true,
    matches: [
      {
        when: "14 Apr 2026", regulator: "SEBI",
        title: "Board Meeting Press Release — 317th Meeting",
        diff: [
          { t: "Board approved amendments to the AIF Regulations to introduce a framework for ", k: "ctx" },
          { t: "co-investment through a separate vehicle", k: "add" },
          { t: " and to recognise ", k: "ctx" },
          { t: "differential rights among investors of the same class", k: "add" },
          { t: ".", k: "ctx" },
        ],
      },
      {
        when: "10 Apr 2026", regulator: "SEBI",
        title: "Master Circular for AIFs — April 2026 edition",
        diff: [
          { t: "The Private Placement Memorandum of every Category II AIF shall include a dedicated ", k: "ctx" },
          { t: "\"Dispersion and Redressal\" annexure", k: "add" },
          { t: " setting out the mechanism for handling dissenting investors where valuation diverges by more than ", k: "ctx" },
          { t: "15%", k: "del" }, { t: " ", k: "ctx" }, { t: "20%", k: "add" },
          { t: ".", k: "ctx" },
        ],
      },
      {
        when: "08 Apr 2026", regulator: "SEBI",
        title: "SEBI (AIF) (Second Amendment) Regulations, 2026",
        diff: [
          { t: "Category II AIFs originating debt must value holdings per an ", k: "ctx" },
          { t: "AIM-approved methodology", k: "add" },
          { t: " before ", k: "ctx" },
          { t: "30 September 2026", k: "add" },
          { t: ".", k: "ctx" },
        ],
      },
    ],
  },
  {
    id: "a2",
    name: "RBI Digital Lending — DLG / FLDG",
    query: "(RBI AND \"Digital Lending\") AND (DLG OR FLDG OR \"default loss guarantee\")",
    topics: ["RBI", "Digital Lending", "DLG"],
    lastHit: "04 Apr 2026",
    hits7d: 1, hitsTotal: 11,
    active: true,
    matches: [
      {
        when: "04 Apr 2026", regulator: "RBI",
        title: "Master Direction — Digital Lending (Updated 04 Apr 2026)",
        diff: [
          { t: "DLG cover shall not exceed ", k: "ctx" }, { t: "5%", k: "add" },
          { t: " of the loan portfolio amount, computed on an ", k: "ctx" },
          { t: "outstanding basis", k: "add" }, { t: ".", k: "ctx" },
        ],
      },
    ],
  },
  {
    id: "a3",
    name: "GST — ITC Sec. 17(5)",
    query: "(GST OR CBIC) AND \"section 17(5)\" AND (insurance OR \"employee benefit\")",
    topics: ["GST", "ITC", "CBIC"],
    lastHit: "11 Apr 2026",
    hits7d: 2, hitsTotal: 19,
    active: true,
    matches: [
      {
        when: "11 Apr 2026", regulator: "CBIC",
        title: "Circular No. 232/26/2026-GST",
        diff: [
          { t: "ITC on group health insurance of employees ", k: "ctx" },
          { t: "is available", k: "add" }, { t: " where cover is ", k: "ctx" },
          { t: "obligatory under any law", k: "add" }, { t: ".", k: "ctx" },
        ],
      },
    ],
  },
  {
    id: "a4",
    name: "DPDP — Consent Manager",
    query: "(\"Digital Personal Data Protection\" OR DPDP) AND \"Consent Manager\"",
    topics: ["MeitY", "DPDP"],
    lastHit: "18 Mar 2026",
    hits7d: 0, hitsTotal: 6,
    active: true,
    matches: [
      {
        when: "18 Mar 2026", regulator: "MeitY",
        title: "DPDP Rules, 2026 — Revised Draft",
        diff: [
          { t: "Consent Manager net worth threshold raised from ", k: "ctx" },
          { t: "₹1 crore", k: "del" }, { t: " ", k: "ctx" }, { t: "₹2 crore", k: "add" }, { t: ".", k: "ctx" },
        ],
      },
    ],
  },
  {
    id: "a5",
    name: "IRDAI — Surrender Value",
    query: "IRDAI AND (\"surrender value\" OR persistency)",
    topics: ["IRDAI", "Par"],
    lastHit: "06 Apr 2026",
    hits7d: 1, hitsTotal: 8,
    active: false,
    matches: [],
  },
  {
    id: "a6",
    name: "CERC — BESS / Ancillary",
    query: "CERC AND (ancillary OR \"battery storage\" OR BESS)",
    topics: ["CERC", "Energy"],
    lastHit: "12 Apr 2026",
    hits7d: 1, hitsTotal: 5,
    active: true,
    matches: [],
  },
];

export type FacetItem = { k: string; n: number };
export const FACETS: Record<"regulator" | "docType" | "sector" | "state", FacetItem[]> = {
  regulator: [
    { k: "SEBI", n: 412821 }, { k: "RBI", n: 286904 }, { k: "MCA", n: 198440 },
    { k: "CBIC", n: 176210 }, { k: "CBDT", n: 154390 }, { k: "IRDAI", n: 62104 },
    { k: "TRAI", n: 41980 }, { k: "DPIIT", n: 28770 }, { k: "MeitY", n: 22419 },
    { k: "CERC", n: 19881 }, { k: "CCI", n: 14220 }, { k: "CDSCO", n: 12004 },
    { k: "PFRDA", n: 9180 }, { k: "NPCI", n: 5401 },
  ],
  docType: [
    { k: "Gazette Notification", n: 184322 }, { k: "Circular", n: 291007 },
    { k: "Master Direction", n: 2140 },       { k: "Regulation", n: 41020 },
    { k: "Press Release", n: 78411 },          { k: "Consultation Paper", n: 6402 },
    { k: "Order", n: 152830 },                  { k: "Informal Guidance", n: 4112 },
    { k: "FAQ", n: 8190 },
  ],
  sector: [
    { k: "BFSI", n: 642004 }, { k: "Pharma", n: 88110 }, { k: "Energy", n: 104221 },
    { k: "Telecom", n: 54810 }, { k: "Cross-sector", n: 220884 },
    { k: "IT / ITES", n: 42990 }, { k: "Mfg.", n: 78421 },
  ],
  state: [
    { k: "Pan-India", n: 904110 }, { k: "Maharashtra", n: 82041 },
    { k: "Karnataka", n: 66990 }, { k: "Tamil Nadu", n: 61440 },
    { k: "Gujarat", n: 54810 }, { k: "Delhi", n: 49882 },
    { k: "West Bengal", n: 38810 }, { k: "Telangana", n: 34901 },
  ],
};

export type Workspace = { name: string; items: number; members: string[]; updated: string };

export const WORKSPACES: Workspace[] = [
  { name: "AIF Compliance — FY27 planning", items: 14, members: ["AP", "SK", "RN"], updated: "14 Apr 2026" },
  { name: "Digital Lending Readiness",       items: 22, members: ["SK", "NM"],      updated: "13 Apr 2026" },
  { name: "GST ITC — group mediclaim",        items: 7,  members: ["AP"],            updated: "11 Apr 2026" },
  { name: "DPDP rollout",                     items: 19, members: ["RN", "NM", "AP"], updated: "09 Apr 2026" },
];
