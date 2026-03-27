create table public.profiles (
  id text primary key,                          -- Clerk user ID
  name text,
  onboarding_goal text check (onboarding_goal in ('career', 'switch', 'personal', 'certs')),
  interests text[] not null default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read their own profile"
  on public.profiles for select
  using ((auth.jwt() ->> 'sub') = id);

-- Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((auth.jwt() ->> 'sub') = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using ((auth.jwt() ->> 'sub') = id);

-- Reuse the updated_at trigger
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
