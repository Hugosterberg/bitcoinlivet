-- Newsletter language preference.
--
-- Adds a `language` column so each subscriber is stored with the locale they
-- signed up in (the domain they were on: bitcoinlivet.se = sv,
-- bitcoinerlife.xyz = en). This makes Supabase the source of truth for which
-- language to send a given subscriber, so broadcasts can be segmented per
-- locale.

alter table public.newsletter_subscribers
  add column if not exists language text not null default 'sv'
    check (language in ('sv', 'en'));

-- Replace the subscribe entry point with a 2-arg version that records the
-- language. The old 1-arg signature is dropped so there's no ambiguity.
drop function if exists public.subscribe_to_newsletter(text);

create or replace function public.subscribe_to_newsletter(
  p_email text,
  p_language text default 'sv'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.newsletter_subscribers (email, language)
  values (p_email, case when p_language = 'en' then 'en' else 'sv' end)
  on conflict (email) do update
    set language = excluded.language;
end;
$$;

-- Allow the public roles to call the function, nothing more.
revoke all on function public.subscribe_to_newsletter(text, text) from public;
grant execute on function public.subscribe_to_newsletter(text, text) to anon, authenticated;
