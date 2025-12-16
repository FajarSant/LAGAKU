-- =======================================================
-- MIGRATION: SISTEM GUGUR OTOMATIS + BABAK DINAMIS
-- =======================================================

begin;

-- =======================================================
-- 1. FUNCTION: TENTUKAN KAPASITAS BABAK OTOMATIS
-- =======================================================
create or replace function public.get_round_capacity(
  p_team_count int
)
returns int
language plpgsql
as $$
begin
  if p_team_count <= 8 then
    return 8;
  elsif p_team_count <= 16 then
    return 16;
  elsif p_team_count <= 32 then
    return 32;
  else
    raise exception 'Jumlah tim maksimal 32';
  end if;
end;
$$;

-- =======================================================
-- 2. FUNCTION: GENERATE ROUND AWAL + MATCH (AUTO)
-- =======================================================
create or replace function public.generate_full_knockout(
  p_acara_id uuid
)
returns void
language plpgsql
as $$
declare
  tim_ids uuid[];
  total_tim int;
  kapasitas int;
  round_id uuid;
  i int := 1;
begin
  -- Ambil tim aktif
  select array_agg(id order by random())
  into tim_ids
  from public.tim
  where acara_id = p_acara_id
    and status = 'aktif';

  total_tim := array_length(tim_ids, 1);

  if total_tim is null or total_tim < 2 then
    raise exception 'Minimal 2 tim untuk sistem gugur';
  end if;

  -- Tentukan kapasitas babak
  kapasitas := public.get_round_capacity(total_tim);

  -- Buat round awal
  insert into public.round (
    acara_id,
    nama,
    urutan,
    kapasitas
  )
  values (
    p_acara_id,
    kapasitas || ' Besar',
    1,
    kapasitas
  )
  returning id into round_id;

  -- Generate pertandingan + BYE
  i := 1;
  while i <= kapasitas loop

    exit when tim_ids[i] is null;

    -- BYE
    if tim_ids[i + 1] is null then
      insert into public.pertandingan (
        acara_id,
        round_id,
        tim_a_id,
        tim_b_id,
        status,
        skor_tim_a,
        skor_tim_b,
        pemenang_id
      )
      values (
        p_acara_id,
        round_id,
        tim_ids[i],
        tim_ids[i],
        'selesai',
        1,
        0,
        tim_ids[i]
      );
    else
      insert into public.pertandingan (
        acara_id,
        round_id,
        tim_a_id,
        tim_b_id,
        status
      )
      values (
        p_acara_id,
        round_id,
        tim_ids[i],
        tim_ids[i + 1],
        'dijadwalkan'
      );
    end if;

    i := i + 2;
  end loop;
end;
$$;

-- =======================================================
-- 3. FUNCTION: CEGAH TIM GUGUR IKUT MATCH
-- =======================================================
create or replace function public.prevent_gugur_team()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.tim
    where id in (new.tim_a_id, new.tim_b_id)
      and status = 'gugur'
  ) then
    raise exception 'Tim yang sudah gugur tidak boleh bertanding';
  end if;

  return new;
end;
$$;

-- =======================================================
-- 4. FUNCTION: SET PEMENANG OTOMATIS DARI SKOR
-- =======================================================
create or replace function public.set_pemenang_otomatis()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'selesai' then
    if new.skor_tim_a is null or new.skor_tim_b is null then
      raise exception 'Skor wajib diisi';
    end if;

    if new.skor_tim_a = new.skor_tim_b then
      raise exception 'Pertandingan sistem gugur tidak boleh seri';
    end if;

    if new.skor_tim_a > new.skor_tim_b then
      new.pemenang_id := new.tim_a_id;
    else
      new.pemenang_id := new.tim_b_id;
    end if;
  end if;

  return new;
end;
$$;

-- =======================================================
-- 5. FUNCTION: GUGURKAN TIM KALAH
-- =======================================================
create or replace function public.gugurkan_tim_kalah()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'selesai' and new.pemenang_id is not null then
    update public.tim
    set status = 'gugur'
    where id in (new.tim_a_id, new.tim_b_id)
      and id <> new.pemenang_id;
  end if;

  return new;
end;
$$;

-- =======================================================
-- 6. FUNCTION: AUTO GENERATE ROUND BERIKUTNYA
-- =======================================================
create or replace function public.generate_next_round()
returns trigger
language plpgsql
as $$
declare
  winners uuid[];
  next_round_id uuid;
  next_urutan int;
  i int := 1;
begin
  -- Pastikan semua pertandingan di round ini selesai
  if exists (
    select 1
    from public.pertandingan
    where round_id = new.round_id
      and status <> 'selesai'
  ) then
    return new;
  end if;

  -- Ambil semua pemenang
  select array_agg(pemenang_id)
  into winners
  from public.pertandingan
  where round_id = new.round_id;

  -- Jika final (1 pemenang)
  if array_length(winners, 1) <= 1 then
    return new;
  end if;

  -- Tentukan urutan babak berikutnya
  select urutan + 1
  into next_urutan
  from public.round
  where id = new.round_id;

  -- Buat round berikutnya
  insert into public.round (
    acara_id,
    nama,
    urutan,
    kapasitas
  )
  values (
    new.acara_id,
    array_length(winners, 1) || ' Besar',
    next_urutan,
    array_length(winners, 1)
  )
  returning id into next_round_id;

  -- Generate pertandingan round berikutnya
  i := 1;
  while i < array_length(winners, 1) loop
    insert into public.pertandingan (
      acara_id,
      round_id,
      tim_a_id,
      tim_b_id,
      status
    )
    values (
      new.acara_id,
      next_round_id,
      winners[i],
      winners[i + 1],
      'dijadwalkan'
    );
    i := i + 2;
  end loop;

  return new;
end;
$$;

-- =======================================================
-- 7. TRIGGERS
-- =======================================================

drop trigger if exists trg_prevent_gugur_team on public.pertandingan;
create trigger trg_prevent_gugur_team
before insert
on public.pertandingan
for each row
execute function public.prevent_gugur_team();

drop trigger if exists trg_set_pemenang on public.pertandingan;
create trigger trg_set_pemenang
before update
on public.pertandingan
for each row
execute function public.set_pemenang_otomatis();

drop trigger if exists trg_gugurkan_tim on public.pertandingan;
create trigger trg_gugurkan_tim
after update
on public.pertandingan
for each row
execute function public.gugurkan_tim_kalah();

drop trigger if exists trg_generate_next_round on public.pertandingan;
create trigger trg_generate_next_round
after update
on public.pertandingan
for each row
execute function public.generate_next_round();

commit;
