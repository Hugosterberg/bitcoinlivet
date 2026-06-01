-- Newsletter subscribers.
--
-- Simple opt-in list: no double opt-in, no email is sent. A visitor submits
-- an address, we store it once. Duplicates are silently ignored.
--
-- RLS is enabled and there is intentionally NO policy granting anon/auth roles
-- direct access. All writes go through `subscribe_to_newsletter()`, a
-- security-definer function, so the list can never be read or enumerated by
-- the public anon key — only inserted into (without leaking whether an address
-- already existed).

create extension if not exists citext;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  -- citext makes the unique constraint case-insensitive (a@x.se == A@X.se).
  email citext not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Public subscribe entry point. SECURITY DEFINER runs as the table owner and
-- bypasses RLS, so anon never touches the table directly. `on conflict do
-- nothing` makes re-subscribing a harmless no-op (no duplicate, no error).
create or replace function public.subscribe_to_newsletter(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.newsletter_subscribers (email)
  values (p_email)
  on conflict (email) do nothing;
end;
$$;

-- Allow the public roles to call the function, nothing more.
revoke all on function public.subscribe_to_newsletter(text) from public;
grant execute on function public.subscribe_to_newsletter(text) to anon, authenticated;
