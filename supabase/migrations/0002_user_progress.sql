-- User learning progression.
--
-- Mirrors the existing client-side `ProgressData` shape (see
-- features/education/components/progress-provider.tsx) onto Supabase Auth so a
-- signed-in user keeps their XP, streak, badges and completed lessons across
-- devices. Course content stays in code (features/education/data/courses.ts);
-- we only store references to lessons by slug.
--
-- Two tables:
--   * lesson_completions — one row per completed lesson (the source of truth,
--     mirrors ProgressData.lessons). The unique constraint gives idempotent
--     completion for free (matches the client's `alreadyDone` guard).
--   * user_progress — one aggregate row per user (mirrors xp/streak/
--     last_active/badges) so the existing incremental client logic maps 1:1.

-- ---------------------------------------------------------------------------
-- Aggregate progression (1 row per user)
-- ---------------------------------------------------------------------------
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active date,
  badges text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

-- Owner-only access. auth.uid() is the signed-in user's id.
create policy "Users read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Lesson completions (1 row per completed lesson)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null,
  lesson_slug text not null,
  correct integer not null default 0,
  total integer not null default 0,
  xp integer not null default 0,
  completed_at timestamptz not null default now(),
  unique (user_id, module_slug, lesson_slug)
);

create index if not exists lesson_completions_user_id_idx
  on public.lesson_completions (user_id);

alter table public.lesson_completions enable row level security;

create policy "Users read own completions"
  on public.lesson_completions for select
  using (auth.uid() = user_id);

create policy "Users insert own completions"
  on public.lesson_completions for insert
  with check (auth.uid() = user_id);

create policy "Users update own completions"
  on public.lesson_completions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own completions"
  on public.lesson_completions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh on user_progress
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Create an empty aggregate row when a new user signs up, so the app can
-- always update rather than worry about first-time inserts.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
