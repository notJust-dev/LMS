import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';
import { useAuth } from '@clerk/expo';

export const coursesKeys = {
  all: ['courses'] as const,
  detail: (id: string) => ['courses', id] as const,
  tutor: (instructorId: string) => ['courses', 'tutor', instructorId] as const,
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

export function useCourse(id: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: coursesKeys.detail(id),
    queryFn: async () => {
      const { data } = await supabase
        .from('courses')
        .select(
          '*, instructor:profiles!courses_instructor_id_fkey(name, avatar_url, role, company), chapters(*, lessons(*))'
        )
        .eq('id', id)
        .single()
        .throwOnError();
      return data;
    },
  });
}

export type CourseDetail = NonNullable<ReturnType<typeof useCourse>['data']>;

export function useTutorCourses() {
  const supabase = useSupabase();
  const { userId } = useAuth();

  return useQuery({
    queryKey: coursesKeys.tutor(userId ?? ''),
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', userId!)
        .order('updated_at', { ascending: false })
        .throwOnError();
      return data;
    },
  });
}

export type TutorCourse = NonNullable<
  ReturnType<typeof useTutorCourses>['data']
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
