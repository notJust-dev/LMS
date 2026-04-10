import { useSupabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesKeys } from './courses';

export function useCreateChapter(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; sort_order: number }) => {
      const { data } = await supabase
        .from('chapters')
        .insert({ ...input, course_id: courseId })
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

export function useUpdateChapter(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; title: string }) => {
      const { data } = await supabase
        .from('chapters')
        .update({ title: input.title })
        .eq('id', input.id)
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

export function useDeleteChapter(courseId: string) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapterId: string) => {
      await supabase
        .from('chapters')
        .delete()
        .eq('id', chapterId)
        .throwOnError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.detail(courseId) });
    },
  });
}
