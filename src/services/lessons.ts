import { useSupabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export const lessonsKeys = {
  detail: (id: string) => ['lessons', id] as const,
};

export function useLesson(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: lessonsKeys.detail(id),
    queryFn: async () => {
      const { data } = await supabase
        .from('lessons')
        .select('*, chapter:chapters!lessons_chapter_id_fkey(*, course:courses!chapters_course_id_fkey(*)), resources:lesson_resources(*)')
        .eq('id', id)
        .single()
        .throwOnError();
      return data;
    },
  });
}

export type LessonDetail = NonNullable<ReturnType<typeof useLesson>['data']>;
