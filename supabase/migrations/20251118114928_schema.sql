-- =======================================================
-- EXTENSIONS
-- =======================================================
create extension if not exists "pgcrypto";

-- =======================================================
-- ENUMS
-- =======================================================
do $$ begin
    create type public.enum_peran as enum ('admin', 'mahasiswa');
exception when duplicate_object then null;
end $$;

do $$ begin
    create type public.enum_jenis_kelamin as enum ('L', 'P');
exception when duplicate_object then null;
end $$;

do $$ begin
    create type public.enum_status_pertandingan as enum ('dijadwalkan', 'berlangsung', 'selesai');
exception when duplicate_object then null;
end $$;

-- =======================================================
-- TABLE: tipe_olahraga
-- =======================================================
create table if not exists public.tipe_olahraga (
    id uuid primary key default gen_random_uuid(),
    nama text not null unique,
    deskripsi text,
    dibuat_pada timestamptz default now()
);

-- =======================================================
-- TABLE: pengguna
-- =======================================================
create table if not exists public.pengguna (
    id uuid primary key default gen_random_uuid(),
    nama text not null,
    email text unique,
    peran public.enum_peran not null default 'mahasiswa',
    nim text unique,
    fakultas text,
    program_studi text,
    jenis_kelamin public.enum_jenis_kelamin,
    tanggal_lahir date,
    alamat text,
    nomor_hp text,
    is_verified boolean default false,
    dibuat_pada timestamptz default now()
);

create index if not exists pengguna_email_idx on public.pengguna(email);
create index if not exists pengguna_nim_idx on public.pengguna(nim);

-- =======================================================
-- TABLE: acara
-- =======================================================
create table if not exists public.acara (
    id uuid primary key default gen_random_uuid(),
    nama text not null unique,
    deskripsi text,
    tipe_olahraga_id uuid references public.tipe_olahraga(id) on delete set null,
    lokasi text,
    url_lokasi_maps text,
    dibuat_oleh uuid references public.pengguna(id) on delete set null,
    dibuat_pada timestamptz default now()
);

create index if not exists acara_tipe_idx on public.acara(tipe_olahraga_id);

-- =======================================================
-- TABLE: tim
-- =======================================================
create table if not exists public.tim (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,
    nama text not null,
    jurusan text,
    angkatan text,
    jumlah_pemain int default 0 check (jumlah_pemain >= 0),
    dibuat_pada timestamptz default now()
);

create index if not exists tim_acara_idx on public.tim(acara_id);

-- =======================================================
-- TABLE: anggota_tim
-- =======================================================
create table if not exists public.anggota_tim (
    id uuid primary key default gen_random_uuid(),
    tim_id uuid not null references public.tim(id) on delete cascade,
    nama_pemain text not null,
    nim text,
    dibuat_pada timestamptz default now()
);

create index if not exists anggota_tim_tim_idx on public.anggota_tim(tim_id);

-- =======================================================
-- TABLE: pertandingan
-- =======================================================
create table if not exists public.pertandingan (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,

    -- Tim A & B (rename request)
    tim_a_id uuid references public.tim(id) on delete set null,
    tim_b_id uuid references public.tim(id) on delete set null,

    -- Detail pertandingan
    status public.enum_status_pertandingan default 'dijadwalkan',
    skor_tim_a int default 0 check (skor_tim_a >= 0),
    skor_tim_b int default 0 check (skor_tim_b >= 0),

    tanggal_pertandingan date,
    waktu_pertandingan time,
    durasi_pertandingan int default 0, -- total menit

    lokasi_lapangan text,
    url_lokasi_maps text,

    dibuat_pada timestamptz default now()
);

create index if not exists pertandingan_acara_idx on public.pertandingan(acara_id);
create index if not exists pertandingan_tim_idx on public.pertandingan(tim_a_id, tim_b_id);

-- =======================================================
-- TABLE: bracket
-- =======================================================
create table if not exists public.bracket (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,
    ronde int not null,
    tim_1_id uuid references public.tim(id) on delete set null,
    tim_2_id uuid references public.tim(id) on delete set null,
    pemenang_id uuid references public.tim(id) on delete set null,
    dibuat_pada timestamptz default now()
);

create index if not exists bracket_acara_idx on public.bracket(acara_id);
