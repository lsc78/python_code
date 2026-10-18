create extension if not exists pgcrypto with schema extensions;

alter table public.student_roster
  add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

update public.student_roster as roster
set auth_user_id = profiles.id
from public.profiles as profiles
where roster.auth_user_id is null
  and profiles.role = 'student'
  and profiles.student_number = roster.student_number
  and lower(profiles.display_name) = lower(roster.display_name);

create table if not exists public.student_pin_credentials (
  student_number text primary key references public.student_roster(student_number) on delete cascade,
  pin_hash text not null,
  failed_attempts smallint not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.student_pin_credentials enable row level security;
revoke all on public.student_pin_credentials from anon, authenticated;

create or replace function public.student_session_is_linked()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.student_roster
    where auth_user_id = auth.uid()
  );
$$;

revoke all on function public.student_session_is_linked() from public;
grant execute on function public.student_session_is_linked() to authenticated;

drop policy if exists "Students can read their own progress" on public.problem_progress;
drop policy if exists "Students and teachers can read progress" on public.problem_progress;
create policy "Linked students and teachers can read progress"
  on public.problem_progress for select
  using (
    public.is_teacher()
    or (user_id = auth.uid() and public.student_session_is_linked())
  );

drop policy if exists "Students can add their own progress" on public.problem_progress;
create policy "Linked students can add their own progress"
  on public.problem_progress for insert
  with check (
    user_id = auth.uid() and public.student_session_is_linked()
  );

drop policy if exists "Students can read their own submissions" on public.submissions;
drop policy if exists "Students and teachers can read submissions" on public.submissions;
create policy "Linked students and teachers can read submissions"
  on public.submissions for select
  using (
    public.is_teacher()
    or (user_id = auth.uid() and public.student_session_is_linked())
  );

drop policy if exists "Students can add their own submissions" on public.submissions;
create policy "Linked students can add their own submissions"
  on public.submissions for insert
  with check (
    user_id = auth.uid() and public.student_session_is_linked()
  );

create or replace function public.issue_student_pin(p_student_number text)
returns text
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  pin_bytes bytea;
  pin_number bigint;
  new_pin text;
begin
  if not public.is_teacher() then
    raise exception 'Teacher access required';
  end if;
  if not exists (select 1 from public.student_roster where student_number = p_student_number) then
    raise exception 'Student not found';
  end if;

  pin_bytes := gen_random_bytes(4);
  pin_number := get_byte(pin_bytes, 0)::bigint * 16777216
    + get_byte(pin_bytes, 1)::bigint * 65536
    + get_byte(pin_bytes, 2)::bigint * 256
    + get_byte(pin_bytes, 3)::bigint;
  new_pin := lpad((pin_number % 10000)::text, 4, '0');

  insert into public.student_pin_credentials (student_number, pin_hash, failed_attempts, locked_until, updated_at)
  values (p_student_number, crypt(new_pin, gen_salt('bf', 10)), 0, null, now())
  on conflict (student_number) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        updated_at = now();

  return new_pin;
end;
$$;

revoke all on function public.issue_student_pin(text) from public;
grant execute on function public.issue_student_pin(text) to authenticated;

create or replace function public.student_pin_login(p_student_number text, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  previous_user_id uuid;
  student_name text;
  stored_hash text;
  current_failures smallint;
  current_lock timestamptz;
begin
  if current_user_id is null
    or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true
    or p_pin !~ '^\d{4}$'
  then
    return false;
  end if;

  select pin_hash, failed_attempts, locked_until
  into stored_hash, current_failures, current_lock
  from public.student_pin_credentials
  where student_number = btrim(p_student_number)
  for update;

  if not found or current_lock > now() then
    return false;
  end if;

  if crypt(p_pin, stored_hash) <> stored_hash then
    current_failures := current_failures + 1;
    update public.student_pin_credentials
    set failed_attempts = current_failures,
        locked_until = case when current_failures >= 5 then now() + interval '15 minutes' else null end,
        updated_at = now()
    where student_number = btrim(p_student_number);
    return false;
  end if;

  update public.student_pin_credentials
  set failed_attempts = 0, locked_until = null, updated_at = now()
  where student_number = btrim(p_student_number);

  select display_name, auth_user_id
  into student_name, previous_user_id
  from public.student_roster
  where student_number = btrim(p_student_number)
  for update;

  if previous_user_id is not null and previous_user_id <> current_user_id then
    insert into public.problem_progress (user_id, problem_id, solved_at)
    select current_user_id, problem_id, solved_at
    from public.problem_progress
    where user_id = previous_user_id
    on conflict (user_id, problem_id) do nothing;

    delete from public.problem_progress where user_id = previous_user_id;
    update public.submissions set user_id = current_user_id where user_id = previous_user_id;
    delete from public.profiles where id = previous_user_id and role = 'student';
  end if;

  insert into public.profiles (id, student_number, display_name, role)
  values (current_user_id, btrim(p_student_number), student_name, 'student')
  on conflict (id) do update
    set student_number = excluded.student_number,
        display_name = excluded.display_name,
        role = 'student';

  update public.student_roster
  set auth_user_id = current_user_id
  where student_number = btrim(p_student_number);

  return true;
end;
$$;

revoke all on function public.student_pin_login(text, text) from public;
grant execute on function public.student_pin_login(text, text) to authenticated;

drop function if exists public.teacher_roster_stats();
create function public.teacher_roster_stats()
returns table (
  student_number text,
  display_name text,
  class_name text,
  account_linked boolean,
  pin_issued boolean,
  solved_count bigint,
  submission_count bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    roster.student_number,
    roster.display_name,
    roster.class_name,
    roster.auth_user_id is not null,
    exists (select 1 from public.student_pin_credentials as credentials where credentials.student_number = roster.student_number),
    coalesce(stats.solved_count, 0),
    coalesce(stats.submission_count, 0)
  from public.student_roster as roster
  left join lateral (
    select
      (select count(distinct progress.problem_id) from public.problem_progress as progress where progress.user_id = roster.auth_user_id) as solved_count,
      (select count(*) from public.submissions as submissions where submissions.user_id = roster.auth_user_id) as submission_count
  ) as stats on true
  where public.is_teacher()
  order by roster.class_name nulls last, roster.student_number;
$$;

revoke all on function public.teacher_roster_stats() from public;
grant execute on function public.teacher_roster_stats() to authenticated;

-- Enable Anonymous Sign-Ins in Supabase Auth settings before student PIN logins.
notify pgrst, 'reload schema';
