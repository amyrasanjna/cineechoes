create extension if not exists "pgcrypto";

create table if not exists public.rounds (
  id uuid primary key default gen_random_uuid(),
  actress_a text not null,
  actress_b text not null,
  actress_a_image text not null,
  actress_b_image text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_active boolean not null default false
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  actress_voted text not null,
  device_id text not null,
  instagram_username text,
  traffic_source text,
  created_at timestamptz not null default now(),
  unique(round_id, device_id)
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  instagram_username text,
  notify_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.rounds enable row level security;
alter table public.votes enable row level security;
alter table public.users enable row level security;

create policy "Public read rounds" on public.rounds
  for select
  using (true);

-- Votes and user writes are handled via server routes with service role key.
