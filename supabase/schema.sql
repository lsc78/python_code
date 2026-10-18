create table if not exists public.problem_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id smallint not null check (problem_id between 1 and 10),
  solved_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id smallint not null check (problem_id between 1 and 10),
  source_code text not null,
  verdict text not null check (verdict in ('accepted', 'wrong_answer', 'runtime_error')),
  passed_tests smallint not null check (passed_tests >= 0),
  total_tests smallint not null check (total_tests > 0),
  created_at timestamptz not null default now()
);

alter table public.problem_progress enable row level security;
alter table public.submissions enable row level security;

create policy "Students can read their own progress"
  on public.problem_progress for select
  using (auth.uid() = user_id);

create policy "Students can add their own progress"
  on public.problem_progress for insert
  with check (auth.uid() = user_id);

create policy "Students can read their own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Students can add their own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create index if not exists submissions_user_created_idx
  on public.submissions (user_id, created_at desc);
