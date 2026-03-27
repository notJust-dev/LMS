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
      const { data, error } = await supabase.from('courses').select();
      if (error) throw error;
      return data;
    },
  });
}

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
