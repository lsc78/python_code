create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  student_number text,
  display_name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.problem_progress to authenticated;
grant select, insert on public.submissions to authenticated;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, student_number, display_name, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'student_number', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      '학생'
    ),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, student_number, display_name, role)
select
  users.id,
  nullif(users.raw_user_meta_data ->> 'student_number', ''),
  coalesce(
    nullif(users.raw_user_meta_data ->> 'display_name', ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    '학생'
  ),
  'student'
from auth.users as users
on conflict (id) do nothing;

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

drop policy if exists "Students can read their own progress" on public.problem_progress;
drop policy if exists "Students and teachers can read progress" on public.problem_progress;
create policy "Students and teachers can read progress"
  on public.problem_progress for select
  using (auth.uid() = user_id or public.is_teacher());

drop policy if exists "Students can add their own progress" on public.problem_progress;
create policy "Students can add their own progress"
  on public.problem_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Students can read their own submissions" on public.submissions;
drop policy if exists "Students and teachers can read submissions" on public.submissions;
create policy "Students and teachers can read submissions"
  on public.submissions for select
  using (auth.uid() = user_id or public.is_teacher());

drop policy if exists "Students can add their own submissions" on public.submissions;
create policy "Students can add their own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own profile and teachers can read all" on public.profiles;
create policy "Users can read own profile and teachers can read all"
  on public.profiles for select
  using (id = auth.uid() or public.is_teacher());

drop policy if exists "Users can add their own student profile" on public.profiles;
create policy "Users can add their own student profile"
  on public.profiles for insert
  with check (id = auth.uid() and role = 'student');

drop policy if exists "Users can update their profile without changing role" on public.profiles;
create policy "Users can update their profile without changing role"
  on public.profiles for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and (
      (role = 'student' and not public.is_teacher())
      or (role = 'teacher' and public.is_teacher())
    )
  );

create or replace function public.teacher_student_stats()
returns table (
  user_id uuid,
  student_number text,
  display_name text,
  solved_count bigint,
  submission_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    profiles.id,
    profiles.student_number,
    profiles.display_name,
    count(distinct progress.problem_id),
    count(distinct submissions.id)
  from public.profiles as profiles
  left join public.problem_progress as progress on progress.user_id = profiles.id
  left join public.submissions as submissions on submissions.user_id = profiles.id
  where profiles.role = 'student' and public.is_teacher()
  group by profiles.id, profiles.student_number, profiles.display_name
  order by profiles.student_number nulls last, profiles.display_name;
$$;

revoke all on function public.teacher_student_stats() from public;
grant execute on function public.teacher_student_stats() to authenticated;

-- Promote a teacher only after their account has been created and verified.
-- Replace the email below in the Supabase SQL Editor, then run this query:
-- update public.profiles
-- set role = 'teacher'
-- where id = (select id from auth.users where email = 'teacher@school.edu');
