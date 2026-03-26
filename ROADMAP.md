# policyai.com — Product Roadmap

> India's first AI-native policy and regulatory intelligence platform — the PolicyNote for India, built lean, distribution-first, monetizing from Month 1.

---

## Phase 1 — Validate & Launch (Months 1–3)

**Goal:** Get a paying product in market before writing serious code.

### What You Build

- **Curated Weekly Policy Intelligence Newsletter** per vertical (BFSI, Healthcare, Energy, EdTech)
  - AI-summarized from gazette notifications, ministry press releases, RBI/SEBI/IRDAI circulars, state government orders
- **Simple landing page** on policyai.com with paid subscription CTA
- **Manual + AI pipeline:** Fireflies + Claude API pulling and summarizing source documents

### What You Don't Build Yet

Any complex platform, dashboard, or data infrastructure.

### Distribution

- Existing summit attendee lists across verticals
- Zero cold acquisition
- 10,000-person BFSI delegate database as launch audience

### Revenue Target

50 paid newsletter subscribers at INR 5K/month = **INR 25L ARR** before building anything serious.

### Key Milestone

First paying customer within **30 days** of launch.

---

## Phase 2 — Product (Months 4–9)

**Goal:** Turn the newsletter into a real SaaS platform.

### What You Build

| Feature | Description |
|---------|-------------|
| Web dashboard | Sector-wise policy feed, search, filters by ministry/state/topic |
| Alert system | Email/WhatsApp notifications when tracked regulations change |
| AI summarization layer | Plain English explanations of complex regulatory language |
| User management | Basic user accounts, billing, team seats |

### Sector Coverage (4 Verticals — Mapped to Elets Summits)

1. BFSI
2. Healthcare
3. Energy
4. EdTech

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js |
| Database | PostgreSQL |
| AI Summarization | Claude API |
| Ingestion Pipelines | n8n (reused from 247agents.com) |

### Data Sources to Ingest

- Gazette of India
- RBI, SEBI, IRDAI, TRAI, MoHFW, MNRE circulars
- PRS Legislative Research
- State legislature feeds (Maharashtra, Karnataka, Telangana, Delhi to start)
- Ministry press releases via RSS

### Revenue Target

20 Professional subscribers at INR 25K/month = **INR 60L ARR**

### Summit Integration

Launch a **"Policy Pulse"** segment at every Elets summit — branded policyai.com briefing on what changed in that sector in the last quarter. Sponsors pay INR 2–5L add-on. Immediate revenue, zero extra cost.

---

## Phase 3 — Scale & Moat (Months 10–18)

**Goal:** Build the data moat and open enterprise/government revenue.

### What You Build

| Product | Description |
|---------|-------------|
| PolicyNote-style API | Sell the data feed to InsurTechs, LegalTechs, compliance platforms. They embed it, you earn per seat or flat annual |
| Sector deep-dive reports | Quarterly, sold at INR 25–50K standalone. Summit speakers contribute for credibility + attribution |
| Government department contracts | State governments need to track what other states are doing. MoU relationships (Telangana Energy, Karnataka, etc.) are the opening door |
| MNC India Entry Intelligence | Foreign corporations entering India need a regulatory map. Dollar-denominated revenue. Package at $10–25K/year per client |
| Custom tracking | Enterprise clients define the regulations they care about; policyai.com monitors and alerts specifically for them |

### Moat

Every document indexed, every sector covered, every alert generated is **proprietary structured data** that compounds over time. By Month 18 you have 18 months of India regulatory history that no competitor can replicate quickly.

### Revenue Target by Month 18

| Stream | ARR |
|--------|-----|
| SaaS subscriptions (100 customers) | INR 2.5 Cr |
| API licensing (5 platforms) | INR 75L |
| Sector reports | INR 50L |
| Summit integrations | INR 60L |
| Government contracts (2) | INR 50L |
| MNC India entry (5 clients) | INR 75L |
| **Total** | **~INR 5.1 Cr ARR** |

---

## Phase 4 — Platform & Exit Optionality (Months 18–36)

**Goal:** Position as acquirable or fundable asset.

### What You Build

- Expand to **all 7 Elets verticals** + add new ones (Legal, Environment, Labour)
- Launch **GovSpend + policyai.com bundle** — procurement intelligence + regulatory intelligence as one subscription. No one else in India can offer this combination
- Add **AI assistant layer** — users can ask *"what changed in NBFC regulations in the last 6 months?"* and get a structured answer with citations
- Explore **white-label** — sell the platform to Big4 firms, law firms, trade bodies who want to brand it as their own intelligence product

### Target ARR

**INR 15–20 Cr by Month 36**

---

## Competitive Advantages

| Advantage | Impact |
|-----------|--------|
| Elets summit distribution | Zero cold acquisition cost |
| 200K+ verified sector contacts | Instant beta user pool |
| Government MoU relationships | Direct government contract pipeline |
| 247agents.com n8n infrastructure | Reuse ingestion + automation stack |
| Summit speaker network | Free expert validation and content |
| 7 vertical content teams | Editorial quality at no extra cost |

---

## Immediate Next Actions (This Week)

- [ ] **Lock the domain** — confirm ownership of policyai.com or acquire it now
- [ ] **Pick one vertical to launch** — BFSI is the strongest given World Fintech Summit momentum
- [ ] **Set up the ingestion pipeline** — RBI + SEBI circulars into n8n -> Claude API -> formatted newsletter
- [ ] **Email BFSI summit list** with a "founding subscriber" offer at INR 3K/month
- [ ] **Test the Policy Pulse format** at World Fintech Summit May 2026 — live proof of concept in front of 500 decision-makers
