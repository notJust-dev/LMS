import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  check: (courseId: string) => ['enrollments', 'check', courseId] as const,
};

export function useMyEnrollments() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: enrollmentKeys.all,
    queryFn: async () => {
      const { data } = await supabase
        .from('enrollments')
        .select(
          '*, course:courses(*, instructor:profiles!courses_instructor_id_fkey(name, avatar_url))'
        )
        .throwOnError();
      return data;
    },
  });
}

export type EnrollmentWithCourse = NonNullable<
  ReturnType<typeof useMyEnrollments>['data']
>[number];

export function useIsEnrolled(courseId: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: enrollmentKeys.check(courseId),
    queryFn: async () => {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .maybeSingle()
        .throwOnError();
      return !!data;
    },
  });
}

export function useEnroll() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: string;
    }) => {
      await supabase
        .from('enrollments')
        .insert({ user_id: userId, course_id: courseId })
        .throwOnError();
    },
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.check(courseId),
      });
    },
  });
}
