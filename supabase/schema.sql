-- NoteNurse AI schema. Run once in Supabase SQL editor (or as a migration).
-- All user tables use Row Level Security: users can only reach their own rows.

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role_title text,
  unit text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- subscriptions (written only by the server / verified webhook) ----------
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('trial','starter','pro')),
  status text not null default 'active' check (status in ('active','inactive','canceled')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  external_ref text,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "subs_select_own" on public.subscriptions for select using (auth.uid() = user_id);
-- No insert/update/delete policies: clients can never change their own plan.

-- ---------- notes ----------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  patient_label text check (char_length(patient_label) <= 80),
  unit text check (char_length(unit) <= 80),
  format text not null check (format in ('soap','sbar','dar','narrative')),
  transcript text not null check (char_length(transcript) between 20 and 30000),
  content jsonb not null,
  status text not null default 'draft' check (status in ('draft','verified')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_created_idx on public.notes (user_id, created_at desc);
alter table public.notes enable row level security;
create policy "notes_select_own" on public.notes for select using (auth.uid() = user_id);
create policy "notes_insert_own" on public.notes for insert with check (auth.uid() = user_id);
create policy "notes_update_own" on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_delete_own" on public.notes for delete using (auth.uid() = user_id);

-- ---------- handoffs ----------
create table if not exists public.handoffs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  note_ids uuid[] not null default '{}',
  content jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists handoffs_user_created_idx on public.handoffs (user_id, created_at desc);
alter table public.handoffs enable row level security;
create policy "handoffs_select_own" on public.handoffs for select using (auth.uid() = user_id);
create policy "handoffs_delete_own" on public.handoffs for delete using (auth.uid() = user_id);
-- Inserts happen server-side after the plan check.

-- ---------- usage events (credit accounting; survives note deletion) ----------
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('note','handoff')),
  created_at timestamptz not null default now()
);
create index if not exists usage_user_kind_idx on public.usage_events (user_id, kind, created_at desc);
alter table public.usage_events enable row level security;
create policy "usage_select_own" on public.usage_events for select using (auth.uid() = user_id);
-- No client write policies.

-- ---------- payment events (webhook idempotency; service role only) ----------
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  email text,
  plan text,
  payload jsonb,
  applied boolean not null default false,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);
alter table public.payment_events enable row level security;
-- No policies: only the service role can read or write.

-- ---------- new user bootstrap ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.subscriptions (user_id, plan, status) values (new.id, 'trial', 'active');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- updated_at ----------
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists notes_touch on public.notes;
create trigger notes_touch before update on public.notes for each row execute function public.touch_updated_at();
