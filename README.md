# policyai.com

India's first AI-native policy and regulatory intelligence platform.

## Quick Start

```bash
npm install
cp .env.example .env  # fill in all keys
npm run dev            # http://localhost:3000
```

## Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS
- **Database:** Supabase (Postgres + Auth + RLS)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Email:** Resend
- **Payments:** Razorpay
- **Hosting:** Vercel

## Architecture

```
supabase/migrations/
  001_init.sql          # Sectors, sources, documents, summaries, users, alerts
  002_phase2.sql        # Org profiles, impact summaries, watchlist

src/app/
  page.tsx              # Landing page (hero, sectors, alerts, pricing)
  login/                # Magic link auth
  onboarding/           # 3-step sector + role + company setup
  subscribe/            # Razorpay payment flow
  dashboard/
    page.tsx            # Policy feed with filters & search
    brief/[id]/         # Full brief + impact analysis tabs
    watchlist/          # Custom keyword/ministry tracking
  auth/callback/        # Supabase auth callback
  api/
    ingest/             # RSS ingestion (GET = cron, POST = single source)
    summarise/          # Claude AI document summarisation
    alerts/dispatch/    # Real-time email alerts for paid users
    digest/weekly/      # Weekly digest cron for all subscribers
    impact/             # Org-specific impact analysis
    newsletter/subscribe/ # Public newsletter signup
    razorpay/webhook/   # Payment webhook verification

src/components/         # UI components (dark editorial aesthetic)
src/lib/
  supabase-server.ts    # Server-side Supabase client
  supabase-browser.ts   # Client-side Supabase client

middleware.ts           # Auth protection for /dashboard/*
vercel.json             # Cron schedules (ingest every 2h, digest Mondays 3am)
```

## Sectors Covered

| Sector | Regulators |
|--------|-----------|
| BFSI | RBI, SEBI, IRDAI, TRAI |
| Healthcare | MoHFW, CDSCO, NMC, AIIMS |
| Energy | MNRE, MoP, CERC, BEE |
| Education | MoE, UGC, AICTE, NMC |
| Smart Cities | MoHUA, MeitY, BIS |
| Defence | MoD, DRDO, DDP, DPIIT |
| eGovernance | MeitY, DeitY, NIC, UIDAI |

## Database Setup

Run migrations against your Supabase project:

```bash
supabase db push
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full 4-phase product roadmap.
