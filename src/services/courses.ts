import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';

export const coursesKeys = {
  all: ['courses'] as const,
};

export function useCourses() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: coursesKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, instructor:profiles!courses_instructor_id_fkey(name, avatar_url, role, company)')
        .throwOnError();
      if (error) throw error;
      return data;
    },
  });
}

export type CourseWithInstructor = NonNullable<
  ReturnType<typeof useCourses>['data']
>[number];

export function useDeleteCourse() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}
