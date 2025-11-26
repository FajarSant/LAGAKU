-- =======================================================
-- EXTENSIONS
-- =======================================================
create extension if not exists "pgcrypto";  -- Untuk UUID acak

-- =======================================================
-- ENUMS
-- =======================================================
create type public.enum_peran as enum ('admin', 'mahasiswa');
create type public.enum_jenis_kelamin as enum ('L', 'P');
create type public.enum_status_pertandingan as enum ('dijadwalkan', 'berlangsung', 'selesai');

-- =======================================================
-- TABEL: pengguna
-- =======================================================
create table if not exists public.pengguna (
  id uuid primary key,                     -- ID dari auth.users
  nama text,
  email text unique,
  penyedia text,                           -- google, email, github, dll
  id_penyedia text,
  avatar_url text,

  -- Role dasar sistem
  peran public.enum_peran not null default 'mahasiswa',

  -- Identitas mahasiswa (nullable agar OAuth insert tidak gagal)
  nim text,
  fakultas text,
  program_studi text,
  jenis_kelamin public.enum_jenis_kelamin,
  tanggal_lahir date,
  alamat text,
  nomor_hp text,

  -- Status verifikasi identitas
  is_verified boolean default false,

  dibuat_pada timestamptz default now()
);

create index if not exists pengguna_email_idx on public.pengguna(email);
create index if not exists pengguna_nim_idx on public.pengguna(nim);

-- =======================================================
-- TABEL: cabang_olahraga
-- =======================================================
create table if not exists public.cabang_olahraga (
  id uuid primary key default gen_random_uuid(),
  nama text unique not null,
  deskripsi text,
  dibuat_pada timestamptz default now()
);

create index if not exists cabang_olahraga_nama_idx on public.cabang_olahraga(nama);

-- =======================================================
-- TABEL: acara
-- =======================================================
create table if not exists public.acara (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  tipe text,
  cabang_olahraga_id uuid references public.cabang_olahraga(id) on delete set null,
  lokasi text,

  dibuat_oleh uuid references public.pengguna(id) on delete set null,

  dibuat_pada timestamptz default now()
);

create unique index if not exists acara_nama_idx on public.acara(nama);

-- =======================================================
-- TABEL: peserta
-- =======================================================
create table if not exists public.peserta (
  id uuid primary key default gen_random_uuid(),
  acara_id uuid not null references public.acara(id) on delete cascade,
  adalah_tim boolean default true,
  nama text not null,
  jumlah_pemain int default 0 check (jumlah_pemain >= 0),
  dibuat_pada timestamptz default now()
);

create index if not exists peserta_acara_idx on public.peserta(acara_id);

-- =======================================================
-- TABEL: anggota_tim
-- =======================================================
create table if not exists public.anggota_tim (
  id uuid primary key default gen_random_uuid(),
  peserta_id uuid not null references public.peserta(id) on delete cascade,
  nama_pemain text not null,
  dibuat_pada timestamptz default now()
);

create index if not exists anggota_tim_peserta_idx
  on public.anggota_tim(peserta_id);

-- =======================================================
-- TABEL: pertandingan
-- =======================================================
create table if not exists public.pertandingan (
  id uuid primary key default gen_random_uuid(),
  acara_id uuid not null references public.acara(id) on delete cascade,
  peserta_tuan_rumah_id uuid references public.peserta(id) on delete set null,
  peserta_tamu_id uuid references public.peserta(id) on delete set null,

  tanggal_pertandingan timestamptz,

  status public.enum_status_pertandingan default 'dijadwalkan',

  skor_tuan_rumah int default 0 check (skor_tuan_rumah >= 0),
  skor_tamu int default 0 check (skor_tamu >= 0),

  durasi_menit int default 0,
  menit_saat_ini int default 0,

  lokasi_lapangan text,
  dibuat_pada timestamptz default now()
);

create index if not exists pertandingan_acara_idx on public.pertandingan(acara_id);

-- =======================================================
-- TABEL: statistik
-- =======================================================
create table if not exists public.statistik (
  id uuid primary key default gen_random_uuid(),
  acara_id uuid not null references public.acara(id) on delete cascade unique,

  total_peserta int default 0 check (total_peserta >= 0),
  total_pertandingan int default 0 check (total_pertandingan >= 0),
  total_pengikut int default 0 check (total_pengikut >= 0),

  diperbarui_pada timestamptz default now()
);

create index if not exists statistik_acara_idx on public.statistik(acara_id);
