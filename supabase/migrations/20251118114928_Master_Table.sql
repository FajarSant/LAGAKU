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
    create type public.enum_status_match as enum (
        'dijadwalkan',
        'berlangsung',
        'selesai'
    );
exception when duplicate_object then null;
end $$;

do $$ begin
    create type public.enum_status_tim as enum (
        'aktif',
        'gugur'
    );
exception when duplicate_object then null;
end $$;

-- =======================================================
-- TABLE: pengguna
-- =======================================================
create table if not exists public.pengguna (
    id uuid primary key default gen_random_uuid(),
    nama text not null,
    email text unique,
    avatar_url text,
    id_penyedia text,
    penyedia text,
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
-- TABLE: acara (TURNAMEN GUGUR)
-- =======================================================
create table if not exists public.acara (
    id uuid primary key default gen_random_uuid(),
    nama text not null unique,
    deskripsi text,
    lokasi_lapangan text,
    url_lokasi_maps text,
    tanggal_mulai_pertandingan timestamptz not null,
    tanggal_selesai_pertandingan timestamptz not null,
    deadline_pendaftaran timestamptz not null,

    dibuat_oleh uuid references public.pengguna(id) on delete set null,
    dibuat_pada timestamptz default now(),

    constraint cek_tanggal_pertandingan
        check (tanggal_mulai_pertandingan < tanggal_selesai_pertandingan),

    constraint cek_deadline_pendaftaran
        check (deadline_pendaftaran <= tanggal_mulai_pertandingan)
);


-- =======================================================
-- TABLE: tim
-- =======================================================
create table if not exists public.tim (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,
    nama text not null,
    jurusan text,
    angkatan text,
    nomor_hp text,
    jumlah_pemain int default 0 check (jumlah_pemain >= 0),
    status public.enum_status_tim default 'aktif',
    dibuat_pada timestamptz default now(),
    unique (acara_id, nama)
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
-- TABLE: round (BABAK TURNAMEN)
-- =======================================================
create table public.round (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,

    nama text not null,
    urutan int not null,

    min_tim int not null,
    max_tim int not null,

    dibuat_pada timestamptz default now(),

    constraint round_tim_check check (min_tim <= max_tim),
    unique (acara_id, urutan)
);


create index if not exists round_acara_idx on public.round(acara_id);

-- =======================================================
-- TABLE: pertandingan (MATCH GUGUR)
-- =======================================================
create table if not exists public.pertandingan (
    id uuid primary key default gen_random_uuid(),
    acara_id uuid not null references public.acara(id) on delete cascade,
    round_id uuid not null references public.round(id) on delete cascade,

    tim_a_id uuid not null references public.tim(id),
    tim_b_id uuid references public.tim(id), 

    skor_tim_a int check (skor_tim_a >= 0),
    skor_tim_b int check (skor_tim_b >= 0),

    pemenang_id uuid references public.tim(id),

    status public.enum_status_match default 'dijadwalkan',

    tanggal_pertandingan date,
    waktu_pertandingan time,
    durasi_pertandingan int default 0,

    lokasi_lapangan text,
    url_lokasi_maps text,

    dibuat_pada timestamptz default now(),

    
    check (tim_b_id is null or tim_a_id <> tim_b_id),
    check (
      pemenang_id is null
      or pemenang_id = tim_a_id
      or pemenang_id = tim_b_id
    )
);
create unique index if not exists unique_tim_a_per_round
on public.pertandingan(round_id, tim_a_id);

create unique index if not exists unique_tim_b_per_round
on public.pertandingan(round_id, tim_b_id)
where tim_b_id is not null;

create index if not exists pertandingan_acara_idx on public.pertandingan(acara_id);
create index if not exists pertandingan_round_idx on public.pertandingan(round_id);
create index if not exists pertandingan_tim_idx on public.pertandingan(tim_a_id, tim_b_id);

-- =======================================================
-- PROTEKSI DATA (REKOMENDASI KERAS)
-- =======================================================

-- Satu tim hanya boleh bermain sekali di satu round
-- Tim A hanya boleh 1x di round
create unique index if not exists unique_tim_a_per_round
on public.pertandingan(round_id, tim_a_id);

-- Tim B hanya boleh 1x di round (kecuali NULL / BYE)
create unique index if not exists unique_tim_b_per_round
on public.pertandingan(round_id, tim_b_id)
where tim_b_id is not null;

