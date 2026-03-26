-- ============================================
-- PolicyAI — Phase 2: Impact Intelligence
-- ============================================

-- Organisation profiles
create table org_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id),
  company_name text,
  industry text,
  states_of_operation text[] default '{}',
  company_size text,
  regulatory_exposure text[] default '{}',
  priority_keywords text[] default '{}',
  updated_at timestamptz default now()
);

alter table org_profiles enable row level security;
create policy "Users can read own org profile"
  on org_profiles for select using (auth.uid() = user_id);
create policy "Users can update own org profile"
  on org_profiles for update using (auth.uid() = user_id);
create policy "Users can insert own org profile"
  on org_profiles for insert with check (auth.uid() = user_id);

-- Impact summaries (personalised per user per document)
create table impact_summaries (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id),
  user_id uuid references users(id),
  org_profile_id uuid references org_profiles(id),
  impact_text text,
  action_required boolean default false,
  urgency text check (urgency in ('immediate', 'this_week', 'this_month', 'monitor')),
  action_items text[] default '{}',
  risk_level text,
  affected_business_areas text[] default '{}',
  generated_at timestamptz default now(),
  unique (document_id, user_id)
);

alter table impact_summaries enable row level security;
create policy "Users can read own impact summaries"
  on impact_summaries for select using (auth.uid() = user_id);

-- Watchlist / custom tracking
create table tracked_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  track_type text check (track_type in ('keyword', 'ministry', 'sector', 'bill_number')),
  track_value text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table tracked_items enable row level security;
create policy "Users can manage own tracked items"
  on tracked_items for all using (auth.uid() = user_id);

create index idx_tracked_items_user on tracked_items(user_id);
create index idx_impact_summaries_document on impact_summaries(document_id);
create index idx_impact_summaries_user on impact_summaries(user_id);
