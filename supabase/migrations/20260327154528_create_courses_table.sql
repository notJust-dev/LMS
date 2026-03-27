create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  price integer not null default 0,
  is_published boolean not null default false,
  category text,
  instructor_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.courses enable row level security;

-- Anyone can read published courses
create policy "Published courses are viewable by everyone"
  on public.courses for select
  using (is_published = true);

-- Instructors can manage their own courses
create policy "Instructors can insert their own courses"
  on public.courses for insert
  with check ((auth.jwt() ->> 'sub') = instructor_id);

create policy "Instructors can update their own courses"
  on public.courses for update
  using ((auth.jwt() ->> 'sub') = instructor_id);

create policy "Instructors can delete their own courses"
  on public.courses for delete
  using ((auth.jwt() ->> 'sub') = instructor_id);

create policy "Instructors can view their own unpublished courses"
  on public.courses for select
  using ((auth.jwt() ->> 'sub') = instructor_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger courses_updated_at
  before update on public.courses
  for each row
  execute function public.set_updated_at();
