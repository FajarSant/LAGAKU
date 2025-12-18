begin;

-- ======================================================
-- 1. KOLOM TAMBAHAN
-- ======================================================

alter table public.pertandingan
add column if not exists is_bye boolean not null default false;


-- ======================================================
-- 2. FUNCTION: POWER OF TWO
-- ======================================================

create or replace function public.next_power_of_two(p_num int)
returns int
language plpgsql
immutable
as $$
begin
  if p_num <= 2 then return 2;
  elsif p_num <= 4 then return 4;
  elsif p_num <= 8 then return 8;
  elsif p_num <= 16 then return 16;
  elsif p_num <= 32 then return 32;
  else
    raise exception 'Maksimal 32 tim';
  end if;
end;
$$;


-- ======================================================
-- 3. FUNCTION: GENERATE ROUND PERTAMA (BYE DI SINI SAJA)
-- ======================================================

create or replace function public.generate_first_round(p_acara_id uuid)
returns void
language plpgsql
as $$
declare
  teams uuid[];
  team_count int;
  bracket_size int;
  bye_count int;
  round_id uuid;
  i int;
begin
  select array_agg(id order by random())
  into teams
  from public.tim
  where acara_id = p_acara_id
    and status = 'aktif';

  team_count := array_length(teams, 1);

  if team_count < 2 then
    raise exception 'Minimal 2 tim';
  end if;

  bracket_size := public.next_power_of_two(team_count);
  bye_count := bracket_size - team_count;

  insert into public.round (
    acara_id, nama, urutan, min_tim, max_tim, dibuat_pada
  )
  values (
    p_acara_id,
    'Round Awal',
    1,
    team_count,
    bracket_size,
    now()
  )
  returning id into round_id;

  i := 1;

  -- BYE
  while i <= bye_count loop
    insert into public.pertandingan (
      acara_id, round_id, tim_a_id,
      status, skor_tim_a, skor_tim_b,
      pemenang_id, is_bye, dibuat_pada
    )
    values (
      p_acara_id, round_id, teams[i],
      'selesai', 1, 0,
      teams[i], true, now()
    );
    i := i + 1;
  end loop;

  -- MATCH NORMAL
  while i < team_count loop
    insert into public.pertandingan (
      acara_id, round_id,
      tim_a_id, tim_b_id,
      status, is_bye, dibuat_pada
    )
    values (
      p_acara_id, round_id,
      teams[i], teams[i + 1],
      'dijadwalkan', false, now()
    );
    i := i + 2;
  end loop;
end;
$$;


-- ======================================================
-- 4. FUNCTION: AMBIL PEMENANG ROUND
-- ======================================================

create or replace function public.get_round_winners(p_round_id uuid)
returns uuid[]
language sql
stable
as $$
  select array_agg(pemenang_id order by id)
  from public.pertandingan
  where round_id = p_round_id
    and pemenang_id is not null;
$$;


-- ======================================================
-- 5. FUNCTION: GENERATE ROUND BERIKUTNYA (TANPA BYE)
-- ======================================================

create or replace function public.generate_next_round()
returns trigger
language plpgsql
as $$
declare
  curr_round record;
  winners uuid[];
  total int;
  next_round_id uuid;
  i int;
begin
  select * into curr_round
  from public.round
  where id = new.round_id;

  if exists (
    select 1 from public.round
    where acara_id = curr_round.acara_id
      and urutan = curr_round.urutan + 1
  ) then
    return new;
  end if;

  if exists (
    select 1 from public.pertandingan
    where round_id = curr_round.id
      and status != 'selesai'
  ) then
    return new;
  end if;

  winners := public.get_round_winners(curr_round.id);
  total := array_length(winners, 1);

  if total = 1 then
    return new;
  end if;

  insert into public.round (
    acara_id, nama, urutan, min_tim, max_tim, dibuat_pada
  )
  values (
    curr_round.acara_id,
    'Round Lanjutan',
    curr_round.urutan + 1,
    total,
    total,
    now()
  )
  returning id into next_round_id;

  i := 1;
  while i < total loop
    insert into public.pertandingan (
      acara_id, round_id,
      tim_a_id, tim_b_id,
      status, is_bye, dibuat_pada
    )
    values (
      curr_round.acara_id,
      next_round_id,
      winners[i], winners[i + 1],
      'dijadwalkan', false, now()
    );
    i := i + 2;
  end loop;

  return new;
end;
$$;


-- ======================================================
-- 6. FUNCTION: VALIDASI SKOR & PEMENANG
-- ======================================================

create or replace function public.validate_match()
returns trigger
language plpgsql
as $$
begin
  if not new.is_bye and new.status = 'selesai' then
    if new.skor_tim_a is null or new.skor_tim_b is null then
      raise exception 'Skor wajib diisi';
    end if;

    if new.skor_tim_a = new.skor_tim_b then
      raise exception 'Tidak boleh seri';
    end if;

    new.pemenang_id :=
      case
        when new.skor_tim_a > new.skor_tim_b then new.tim_a_id
        else new.tim_b_id
      end;
  end if;

  return new;
end;
$$;


-- ======================================================
-- 7. FUNCTION: UPDATE STATUS TIM
-- ======================================================

create or replace function public.update_team_status()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'selesai' and not new.is_bye then
    update public.tim
    set status = 'gugur'
    where id in (new.tim_a_id, new.tim_b_id)
      and id <> new.pemenang_id;
  end if;

  return new;
end;
$$;


-- ======================================================
-- 8. TRIGGERS (BERSIH & AMAN)
-- ======================================================

drop trigger if exists trg_validate_match on public.pertandingan;
drop trigger if exists trg_update_team on public.pertandingan;
drop trigger if exists trg_generate_round on public.pertandingan;

create trigger trg_validate_match
before update on public.pertandingan
for each row
execute function public.validate_match();

create trigger trg_update_team
after update on public.pertandingan
for each row
when (new.status = 'selesai' and old.status != 'selesai')
execute function public.update_team_status();

create trigger trg_generate_round
after update on public.pertandingan
for each row
when (new.status = 'selesai' and old.status != 'selesai')
execute function public.generate_next_round();

commit;
