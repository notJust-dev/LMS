-- ============================================================
-- 1. Extend existing tables
-- ============================================================

-- 1a. Add missing columns to courses
alter table public.courses
  add column rating numeric(2,1) not null default 0,
  add column review_count integer not null default 0,
  add column total_duration integer not null default 0,
  add column lesson_count integer not null default 0,
  add column original_price integer;

-- 1b. Add instructor profile fields to profiles
alter table public.profiles
  add column avatar_url text,
  add column role text,
  add column company text;

-- 1c. Add learner stats to profiles
alter table public.profiles
  add column streak_days integer not null default 0,
  add column certificates_earned integer not null default 0,
  add column total_lessons_completed integer not null default 0;

-- 1d. Add FK from courses.instructor_id -> profiles.id
alter table public.courses
  add constraint courses_instructor_id_fkey
  foreign key (instructor_id) references public.profiles(id);

-- 1e. Allow anyone to read instructor profiles
create policy "Instructor profiles are publicly readable"
  on public.profiles for select
  using (
    exists (
      select 1 from public.courses
      where courses.instructor_id = profiles.id
        and courses.is_published = true
    )
  );

-- ============================================================
-- 2. Chapters table
-- ============================================================

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chapters_course_id_idx on public.chapters(course_id);

alter table public.chapters enable row level security;

create policy "Chapters of published courses are viewable by everyone"
  on public.chapters for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = chapters.course_id
        and courses.is_published = true
    )
  );

create policy "Instructors can insert chapters for their courses"
  on public.chapters for insert
  with check (
    exists (
      select 1 from public.courses
      where courses.id = chapters.course_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can update chapters of their courses"
  on public.chapters for update
  using (
    exists (
      select 1 from public.courses
      where courses.id = chapters.course_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can delete chapters of their courses"
  on public.chapters for delete
  using (
    exists (
      select 1 from public.courses
      where courses.id = chapters.course_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create trigger chapters_updated_at
  before update on public.chapters
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- 3. Lessons table
-- ============================================================

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  description text,
  duration integer not null default 0,
  video_url text,
  is_locked boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lessons_chapter_id_idx on public.lessons(chapter_id);

alter table public.lessons enable row level security;

create policy "Lessons of published courses are viewable by everyone"
  on public.lessons for select
  using (
    exists (
      select 1 from public.chapters
      join public.courses on courses.id = chapters.course_id
      where chapters.id = lessons.chapter_id
        and courses.is_published = true
    )
  );

create policy "Instructors can insert lessons for their courses"
  on public.lessons for insert
  with check (
    exists (
      select 1 from public.chapters
      join public.courses on courses.id = chapters.course_id
      where chapters.id = lessons.chapter_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can update lessons of their courses"
  on public.lessons for update
  using (
    exists (
      select 1 from public.chapters
      join public.courses on courses.id = chapters.course_id
      where chapters.id = lessons.chapter_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can delete lessons of their courses"
  on public.lessons for delete
  using (
    exists (
      select 1 from public.chapters
      join public.courses on courses.id = chapters.course_id
      where chapters.id = lessons.chapter_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create trigger lessons_updated_at
  before update on public.lessons
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- 4. Lesson resources table
-- ============================================================

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  file_name text not null,
  file_size integer not null default 0,
  file_type text not null,
  download_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index lesson_resources_lesson_id_idx on public.lesson_resources(lesson_id);

alter table public.lesson_resources enable row level security;

create policy "Resources of published courses are viewable by everyone"
  on public.lesson_resources for select
  using (
    exists (
      select 1 from public.lessons
      join public.chapters on chapters.id = lessons.chapter_id
      join public.courses on courses.id = chapters.course_id
      where lessons.id = lesson_resources.lesson_id
        and courses.is_published = true
    )
  );

create policy "Instructors can insert resources for their courses"
  on public.lesson_resources for insert
  with check (
    exists (
      select 1 from public.lessons
      join public.chapters on chapters.id = lessons.chapter_id
      join public.courses on courses.id = chapters.course_id
      where lessons.id = lesson_resources.lesson_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can update resources of their courses"
  on public.lesson_resources for update
  using (
    exists (
      select 1 from public.lessons
      join public.chapters on chapters.id = lessons.chapter_id
      join public.courses on courses.id = chapters.course_id
      where lessons.id = lesson_resources.lesson_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

create policy "Instructors can delete resources of their courses"
  on public.lesson_resources for delete
  using (
    exists (
      select 1 from public.lessons
      join public.chapters on chapters.id = lessons.chapter_id
      join public.courses on courses.id = chapters.course_id
      where lessons.id = lesson_resources.lesson_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

-- ============================================================
-- 5. Enrollments table
-- ============================================================

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id),
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index enrollments_user_id_idx on public.enrollments(user_id);
create index enrollments_course_id_idx on public.enrollments(course_id);

alter table public.enrollments enable row level security;

create policy "Users can view their own enrollments"
  on public.enrollments for select
  using ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can enroll themselves"
  on public.enrollments for insert
  with check ((auth.jwt() ->> 'sub') = user_id);

create policy "Instructors can view enrollments for their courses"
  on public.enrollments for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = enrollments.course_id
        and courses.instructor_id = (auth.jwt() ->> 'sub')
    )
  );

-- ============================================================
-- 6. Lesson progress table
-- ============================================================

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index lesson_progress_user_id_idx on public.lesson_progress(user_id);
create index lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);

alter table public.lesson_progress enable row level security;

create policy "Users can view their own lesson progress"
  on public.lesson_progress for select
  using ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert their own lesson progress"
  on public.lesson_progress for insert
  with check ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own lesson progress"
  on public.lesson_progress for update
  using ((auth.jwt() ->> 'sub') = user_id);

create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row
  execute function public.set_updated_at();
