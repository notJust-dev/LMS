import { useSupabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesKeys } from './courses';

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

export function useCreateLesson(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      chapter_id: string;
      title: string;
      sort_order: number;
    }) => {
      const { data } = await supabase
        .from('lessons')
        .insert(input)
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.detail(courseId) });
    },
  });
}

export function useUpdateLesson(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      title?: string;
      description?: string | null;
      duration?: number;
      is_locked?: boolean;
      video_url?: string | null;
    }) => {
      const { data } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.detail(courseId) });
      queryClient.invalidateQueries({
        queryKey: lessonsKeys.detail(variables.id),
      });
    },
  });
}

export function useUploadLessonVideo() {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({
      lessonId,
      file,
    }: {
      lessonId: string;
      file: { uri: string; type: string; name: string };
    }) => {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const path = `${lessonId}.mp4`;

      const { error } = await supabase.storage
        .from('lesson-videos')
        .upload(path, blob, {
          contentType: file.type,
          upsert: true,
        });
      if (error) throw error;
      return path;
    },
  });
}

export function useDeleteLesson(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)
        .throwOnError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.detail(courseId) });
    },
  });
}

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
