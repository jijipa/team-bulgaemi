create table if not exists public.matches (
  id text primary key,
  match_type text not null,
  player_count text not null,
  quarter_count text not null,
  quarter_time text not null,
  match_date text not null,
  start_time text not null,
  end_time text not null,
  location text not null,
  location_link text,
  opponent_name text not null,
  is_completed boolean not null default false,
  our_score integer default 0,
  opponent_score integer default 0,
  created_at timestamptz not null default now(),
  image_url text
);

alter table public.matches enable row level security;

create policy "Public can read matches"
on public.matches
for select
to public
using (true);

create policy "Public can insert matches"
on public.matches
for insert
to public
with check (true);
