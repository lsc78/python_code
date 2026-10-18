create table if not exists public.teacher_login_credentials (
  username text primary key,
  display_name text not null,
  password_hash text not null,
  failed_attempts smallint not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.teacher_login_credentials enable row level security;
revoke all on public.teacher_login_credentials from anon, authenticated;

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
  ) or exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

revoke all on function public.student_session_is_linked() from public;
grant execute on function public.student_session_is_linked() to authenticated;

create or replace function public.teacher_password_login(p_username text, p_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  stored_hash text;
  teacher_name text;
  current_failures smallint;
  current_lock timestamptz;
begin
  if current_user_id is null
    or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true
    or p_username is null
    or p_password is null
    or length(p_password) < 8
  then return false; end if;

  select password_hash, display_name, failed_attempts, locked_until
  into stored_hash, teacher_name, current_failures, current_lock
  from public.teacher_login_credentials
  where username = lower(btrim(p_username))
  for update;

  if not found or current_lock > now() then return false; end if;
  if crypt(p_password, stored_hash) <> stored_hash then
    current_failures := current_failures + 1;
    update public.teacher_login_credentials
    set failed_attempts = current_failures,
        locked_until = case when current_failures >= 5 then now() + interval '15 minutes' else null end
    where username = lower(btrim(p_username));
    return false;
  end if;

  update public.teacher_login_credentials
  set failed_attempts = 0, locked_until = null
  where username = lower(btrim(p_username));

  insert into public.profiles (id, student_number, display_name, role)
  values (current_user_id, null, teacher_name, 'teacher')
  on conflict (id) do update
    set student_number = null,
        display_name = excluded.display_name,
        role = 'teacher';
  return true;
end;
$$;

revoke all on function public.teacher_password_login(text, text) from public;
grant execute on function public.teacher_password_login(text, text) to authenticated;

create or replace function public.create_demo_teacher()
returns table (teacher_id text, teacher_password text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  random_bytes bytea;
  random_number bigint;
  new_id text;
  new_password text;
begin
  loop
    random_bytes := gen_random_bytes(4);
    random_number := get_byte(random_bytes, 0)::bigint * 16777216
      + get_byte(random_bytes, 1)::bigint * 65536
      + get_byte(random_bytes, 2)::bigint * 256
      + get_byte(random_bytes, 3)::bigint;
    new_id := 'teacher-test-' || lpad((random_number % 1000000)::text, 6, '0');
    exit when not exists (select 1 from public.teacher_login_credentials where username = new_id);
  end loop;

  new_password := translate(encode(gen_random_bytes(18), 'base64'), '+/=', 'xyz');
  insert into public.teacher_login_credentials (username, display_name, password_hash)
  values (new_id, '테스트 교사', crypt(new_password, gen_salt('bf', 10)));
  return query select new_id, new_password;
end;
$$;

revoke all on function public.create_demo_teacher() from public;
revoke all on function public.create_demo_teacher() from anon, authenticated;
notify pgrst, 'reload schema';
