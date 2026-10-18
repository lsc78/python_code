create table if not exists public.student_roster (
  student_number text primary key,
  display_name text not null,
  class_name text,
  email text,
  imported_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_roster enable row level security;
grant select, insert, update, delete on public.student_roster to authenticated;

drop policy if exists "Teachers manage student roster" on public.student_roster;
create policy "Teachers manage student roster"
  on public.student_roster for all
  using (public.is_teacher())
  with check (public.is_teacher());

drop function if exists public.teacher_roster_stats();
create function public.teacher_roster_stats()
returns table (
  student_number text,
  display_name text,
  class_name text,
  account_linked boolean,
  solved_count bigint,
  submission_count bigint
)
language sql
stable
security definer
set search_path = public, auth, pg_temp
as $$
  select
    roster.student_number,
    roster.display_name,
    roster.class_name,
    coalesce(stats.account_linked, false),
    coalesce(stats.solved_count, 0),
    coalesce(stats.submission_count, 0)
  from public.student_roster as roster
  left join lateral (
    select
      count(distinct profiles.id) > 0 as account_linked,
      count(distinct progress.problem_id) as solved_count,
      count(distinct submissions.id) as submission_count
    from public.profiles as profiles
    join auth.users as accounts on accounts.id = profiles.id
    left join public.problem_progress as progress on progress.user_id = profiles.id
    left join public.submissions as submissions on submissions.user_id = profiles.id
    where profiles.student_number = roster.student_number
      and lower(profiles.display_name) = lower(roster.display_name)
      and (nullif(roster.email, '') is null or lower(accounts.email) = lower(roster.email))
  ) as stats on true
  where public.is_teacher()
  order by roster.class_name nulls last, roster.student_number;
$$;

revoke all on function public.teacher_roster_stats() from public;
grant execute on function public.teacher_roster_stats() to authenticated;
