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

create table if not exists public.scores (
  id text primary key,
  match_id text not null references public.matches(id) on delete cascade,
  player_id text not null,
  player_name text not null,
  player_number text,
  goals integer not null default 0,
  assists integer not null default 0,
  is_mercenary boolean not null default false,
  is_opponent_goal boolean not null default false,
  quarter_data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.participants (
  id text primary key,
  match_id text not null references public.matches(id) on delete cascade,
  player_id text not null,
  player_name text,
  player_number text,
  is_mercenary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.moms (
  id text primary key,
  match_id text not null references public.matches(id) on delete cascade,
  player_ids text[] not null,
  created_at timestamptz not null default now(),
  unique (match_id)
);

create table if not exists public.goal_events (
  id text primary key,
  match_id text not null references public.matches(id) on delete cascade,
  quarter integer not null,
  goal_type text not null,
  scorer_id text not null,
  scorer_name text not null,
  scorer_is_mercenary boolean not null default false,
  assist_id text,
  assist_name text,
  assist_is_mercenary boolean not null default false,
  is_opponent_goal boolean not null default false,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.matches enable row level security;
alter table public.scores enable row level security;
alter table public.participants enable row level security;
alter table public.moms enable row level security;
alter table public.goal_events enable row level security;

drop policy if exists "Public can read matches" on public.matches;
drop policy if exists "Public can insert matches" on public.matches;
drop policy if exists "Public can update matches" on public.matches;
drop policy if exists "Public can delete matches" on public.matches;

create policy "Public can read matches" on public.matches for select to public using (true);
create policy "Public can insert matches" on public.matches for insert to public with check (true);
create policy "Public can update matches" on public.matches for update to public using (true) with check (true);
create policy "Public can delete matches" on public.matches for delete to public using (true);

drop policy if exists "Public can read scores" on public.scores;
drop policy if exists "Public can insert scores" on public.scores;
drop policy if exists "Public can update scores" on public.scores;
drop policy if exists "Public can delete scores" on public.scores;

create policy "Public can read scores" on public.scores for select to public using (true);
create policy "Public can insert scores" on public.scores for insert to public with check (true);
create policy "Public can update scores" on public.scores for update to public using (true) with check (true);
create policy "Public can delete scores" on public.scores for delete to public using (true);

drop policy if exists "Public can read participants" on public.participants;
drop policy if exists "Public can insert participants" on public.participants;
drop policy if exists "Public can update participants" on public.participants;
drop policy if exists "Public can delete participants" on public.participants;

create policy "Public can read participants" on public.participants for select to public using (true);
create policy "Public can insert participants" on public.participants for insert to public with check (true);
create policy "Public can update participants" on public.participants for update to public using (true) with check (true);
create policy "Public can delete participants" on public.participants for delete to public using (true);

drop policy if exists "Public can read moms" on public.moms;
drop policy if exists "Public can insert moms" on public.moms;
drop policy if exists "Public can update moms" on public.moms;
drop policy if exists "Public can delete moms" on public.moms;

create policy "Public can read moms" on public.moms for select to public using (true);
create policy "Public can insert moms" on public.moms for insert to public with check (true);
create policy "Public can update moms" on public.moms for update to public using (true) with check (true);
create policy "Public can delete moms" on public.moms for delete to public using (true);

drop policy if exists "Public can read goal events" on public.goal_events;
drop policy if exists "Public can insert goal events" on public.goal_events;
drop policy if exists "Public can update goal events" on public.goal_events;
drop policy if exists "Public can delete goal events" on public.goal_events;

create policy "Public can read goal events" on public.goal_events for select to public using (true);
create policy "Public can insert goal events" on public.goal_events for insert to public with check (true);
create policy "Public can update goal events" on public.goal_events for update to public using (true) with check (true);
create policy "Public can delete goal events" on public.goal_events for delete to public using (true);

create index if not exists scores_match_id_idx on public.scores(match_id);
create index if not exists participants_match_id_idx on public.participants(match_id);
create index if not exists moms_match_id_idx on public.moms(match_id);
create index if not exists goal_events_match_id_idx on public.goal_events(match_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'match-images',
  'match-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read match images" on storage.objects;
drop policy if exists "Public can insert match images" on storage.objects;
drop policy if exists "Public can update match images" on storage.objects;
drop policy if exists "Public can delete match images" on storage.objects;

create policy "Public can read match images"
on storage.objects for select
to public
using (bucket_id = 'match-images');

create policy "Public can insert match images"
on storage.objects for insert
to public
with check (bucket_id = 'match-images');

create policy "Public can update match images"
on storage.objects for update
to public
using (bucket_id = 'match-images')
with check (bucket_id = 'match-images');

create policy "Public can delete match images"
on storage.objects for delete
to public
using (bucket_id = 'match-images');
