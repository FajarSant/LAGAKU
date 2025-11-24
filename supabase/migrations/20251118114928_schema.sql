-- =======================================================
-- EXTENSIONS
-- =======================================================
create extension if not exists "pgcrypto";  -- Untuk UUID acak

-- =======================================================
-- TABLE: users  (profil pengguna, sinkron dari auth.users)
-- =======================================================
create table if not exists public.users (
  id uuid primary key,                      -- ID dari auth.users
  name text,
  email text unique,
  provider text,                            -- google, email, github, dll
  provider_id text,
  avatar_url text,

  -- Role dasar sistem
  role text not null default 'mahasiswa'
    check (role in ('admin', 'mahasiswa')),

  -- Identitas mahasiswa
  nim text unique,
  fakultas text,
  program_studi text,
  jenis_kelamin text check (jenis_kelamin in ('L', 'P')),
  tanggal_lahir date,
  alamat text,
  nomor_hp text,
  

  created_at timestamptz default now()
);

create index if not exists users_email_idx on public.users(email);
create index if not exists users_nim_idx on public.users(nim);


-- =======================================================
-- TABLE: sports
-- =======================================================
create table if not exists public.sports (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz default now()
);

create index if not exists sports_name_idx on public.sports(name);


-- =======================================================
-- TABLE: events
-- =======================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  sport_id uuid references public.sports(id) on delete set null,
  location text,

  -- Event dibuat oleh user
  created_by uuid references public.users(id) on delete set null,

  created_at timestamptz default now()
);

create unique index if not exists events_name_idx on public.events(name);


-- =======================================================
-- TABLE: participants
-- =======================================================
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  is_team boolean default true,
  name text not null,
  player_count int default 0 check (player_count >= 0),
  created_at timestamptz default now()
);

create index if not exists participants_event_idx on public.participants(event_id);


-- =======================================================
-- TABLE: teams_players
-- =======================================================
create table if not exists public.teams_players (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  player_name text not null,
  created_at timestamptz default now()
);

create index if not exists teams_players_participant_idx
  on public.teams_players(participant_id);


-- =======================================================
-- TABLE: matches
-- =======================================================
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  home_participant_id uuid references public.participants(id) on delete set null,
  away_participant_id uuid references public.participants(id) on delete set null,

  match_date timestamptz,

  status text default 'scheduled'
    check (status in ('scheduled', 'ongoing', 'finished')),

  home_score int default 0 check (home_score >= 0),
  away_score int default 0 check (away_score >= 0),

  duration_minutes int default 0,
  current_minute int default 0,

  field_location text,
  created_at timestamptz default now()
);

create index if not exists matches_event_idx on public.matches(event_id);


-- =======================================================
-- TABLE: statistics
-- =======================================================
create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade unique,

  total_participants int default 0 check (total_participants >= 0),
  total_matches int default 0 check (total_matches >= 0),
  total_followers int default 0 check (total_followers >= 0),

  updated_at timestamptz default now()
);

create index if not exists statistics_event_idx on public.statistics(event_id);
