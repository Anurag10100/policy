# policyai.com

India's first AI-native policy and regulatory intelligence platform.

## Quick Start

```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
```

## Architecture

```
src/
  app/
    page.tsx              # Landing page with subscription CTA
    newsletter/page.tsx   # Newsletter preview page
    api/
      subscribe/          # Subscriber registration endpoint
      summarize/          # AI summarization endpoint (Claude API)
      ingest/             # Trigger ingestion of RBI/SEBI circulars
  components/             # UI components (Header, Hero, Pricing, etc.)
  lib/
    summarizer.ts         # Claude API integration for policy summarization
    ingestion.ts          # Web scrapers for RBI & SEBI circulars
    newsletter.ts         # HTML newsletter generator
scripts/
  ingest-circulars.ts     # CLI: Fetch and summarize latest circulars
  generate-newsletter.ts  # CLI: Generate newsletter HTML from summaries
```

## Pipeline

```bash
# 1. Ingest latest circulars from RBI & SEBI
npm run ingest

# 2. Generate newsletter HTML
npm run generate-newsletter        # defaults to BFSI
npm run generate-newsletter BFSI   # specify sector
```

## Environment Variables

Copy `.env.example` to `.env` and set:

- `ANTHROPIC_API_KEY` — Required for AI summarization

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full 4-phase product roadmap.
