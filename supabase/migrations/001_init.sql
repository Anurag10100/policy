-- ============================================
-- PolicyAI — Database Schema (Phase 1)
-- ============================================

-- Sectors
create table sectors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  regulators text[] default '{}',
  is_active boolean default true
);

-- Sources (RSS feeds & scrape targets)
create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  sector_id uuid references sectors(id),
  feed_url text not null,
  feed_type text not null default 'rss', -- 'rss' | 'scrape'
  is_active boolean default true,
  last_fetched_at timestamptz,
  summaries_today int default 0
);

-- Raw documents
create table documents (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id),
  sector_id uuid references sectors(id),
  external_id text not null,
  title text not null,
  raw_content text,
  published_at timestamptz,
  fetched_at timestamptz default now(),
  url text,
  doc_type text,
  unique (source_id, external_id)
);

create index idx_documents_sector on documents(sector_id);
create index idx_documents_published on documents(published_at desc);

-- AI summaries
create table summaries (
  id uuid primary key default gen_random_uuid(),
  document_id uuid unique references documents(id),
  summary_short text,
  summary_full text,
  severity text check (severity in ('high', 'medium', 'low')),
  tags text[] default '{}',
  key_dates jsonb default '[]',
  generated_at timestamptz default now(),
  model_used text default 'claude-sonnet-4-20250514'
);

create index idx_summaries_severity on summaries(severity);

-- Users (extends Supabase auth.users)
create table users (
  id uuid primary key references auth.users(id),
  email text not null,
  full_name text,
  company text,
  role text,
  plan text default 'free',
  subscribed_sectors text[] default '{}',
  created_at timestamptz default now()
);

-- Newsletter subscribers (public, no auth needed)
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  sectors text[] default '{}',
  source text,
  subscribed_at timestamptz default now(),
  is_confirmed boolean default false
);

-- Alerts sent
create table alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  document_id uuid references documents(id),
  triggered_by text,
  channel text default 'email',
  sent_at timestamptz default now(),
  opened_at timestamptz
);

create index idx_alerts_user on alerts(user_id);

-- ============================================
-- Row Level Security
-- ============================================

alter table users enable row level security;
alter table alerts enable row level security;

create policy "Users can read own profile"
  on users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update using (auth.uid() = id);

create policy "Users can read own alerts"
  on alerts for select using (auth.uid() = user_id);

-- Public read for sectors, documents, summaries
alter table sectors enable row level security;
create policy "Public read sectors" on sectors for select using (true);

alter table documents enable row level security;
create policy "Public read documents" on documents for select using (true);

alter table summaries enable row level security;
create policy "Public read summaries" on summaries for select using (true);

-- ============================================
-- Seed Data: Sectors
-- ============================================

insert into sectors (slug, name, icon, regulators) values
  ('bfsi', 'BFSI', '🏦', array['RBI', 'SEBI', 'IRDAI', 'TRAI']),
  ('healthcare', 'Healthcare', '🏥', array['MoHFW', 'CDSCO', 'NMC', 'AIIMS']),
  ('energy', 'Energy', '⚡', array['MNRE', 'MoP', 'CERC', 'BEE']),
  ('education', 'Education', '🎓', array['MoE', 'UGC', 'AICTE', 'NMC']),
  ('smartcities', 'Smart Cities', '🏙️', array['MoHUA', 'MeitY', 'BIS']),
  ('defence', 'Defence', '🛡️', array['MoD', 'DRDO', 'DDP', 'DPIIT']),
  ('egov', 'eGovernance', '🏛️', array['MeitY', 'DeitY', 'NIC', 'UIDAI']);

-- ============================================
-- Seed Data: Sources
-- ============================================

insert into sources (name, short_name, sector_id, feed_url, feed_type) values
  ('Reserve Bank of India', 'RBI',
    (select id from sectors where slug = 'bfsi'),
    'https://www.rbi.org.in/rss/RBINotifications.xml', 'rss'),
  ('Securities and Exchange Board of India', 'SEBI',
    (select id from sectors where slug = 'bfsi'),
    'https://www.sebi.gov.in/sebiweb/other/rss.xml', 'rss'),
  ('Ministry of Health and Family Welfare', 'MoHFW',
    (select id from sectors where slug = 'healthcare'),
    'https://mohfw.gov.in/latest-news', 'scrape'),
  ('Ministry of New and Renewable Energy', 'MNRE',
    (select id from sectors where slug = 'energy'),
    'https://mnre.gov.in/whats-new', 'scrape'),
  ('Ministry of Education', 'MoE',
    (select id from sectors where slug = 'education'),
    'https://www.education.gov.in/latest-news', 'scrape'),
  ('Press Information Bureau', 'PIB',
    null,
    'https://pib.gov.in/RssMain.aspx', 'rss'),
  ('PRS Legislative Research', 'PRS',
    null,
    'https://prsindia.org/feed', 'rss');
