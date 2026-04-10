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

/**
 * Returns a signed URL for a lesson video (valid for 1 hour).
 * Pass the `video_url` column value (the storage path within the bucket).
 */
export function useLessonVideoUrl(videoPath: string | null) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['lesson-video-url', videoPath],
    enabled: !!videoPath,
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('lesson-videos')
        .createSignedUrl(videoPath!, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
  });
}
