-- Function to recompute lesson_count and total_duration for a course
create or replace function public.sync_course_lesson_stats()
returns trigger as $$
declare
  target_course_id uuid;
begin
  -- Determine the affected course via the chapter
  if tg_op = 'DELETE' then
    select course_id into target_course_id
    from public.chapters where id = old.chapter_id;
  else
    select course_id into target_course_id
    from public.chapters where id = new.chapter_id;
  end if;

  if target_course_id is not null then
    update public.courses
    set
      lesson_count = (
        select count(*)
        from public.lessons l
        join public.chapters c on c.id = l.chapter_id
        where c.course_id = target_course_id
      ),
      total_duration = (
        select coalesce(sum(l.duration), 0)
        from public.lessons l
        join public.chapters c on c.id = l.chapter_id
        where c.course_id = target_course_id
      )
    where id = target_course_id;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$ language plpgsql;

-- Fire after any lesson insert, update, or delete
create trigger sync_course_stats_on_lesson_change
  after insert or update or delete on public.lessons
  for each row
  execute function public.sync_course_lesson_stats();

-- Also handle chapter deletion (cascades lessons)
create or replace function public.sync_course_stats_on_chapter_delete()
returns trigger as $$
begin
  update public.courses
  set
    lesson_count = (
      select count(*)
      from public.lessons l
      join public.chapters c on c.id = l.chapter_id
      where c.course_id = old.course_id
    ),
    total_duration = (
      select coalesce(sum(l.duration), 0)
      from public.lessons l
      join public.chapters c on c.id = l.chapter_id
      where c.course_id = old.course_id
    )
  where id = old.course_id;

  return old;
end;
$$ language plpgsql;

create trigger sync_course_stats_on_chapter_delete
  after delete on public.chapters
  for each row
  execute function public.sync_course_stats_on_chapter_delete();

-- Backfill existing courses
update public.courses
set
  lesson_count = (
    select count(*)
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    where c.course_id = courses.id
  ),
  total_duration = (
    select coalesce(sum(l.duration), 0)
    from public.lessons l
    join public.chapters c on c.id = l.chapter_id
    where c.course_id = courses.id
  );
