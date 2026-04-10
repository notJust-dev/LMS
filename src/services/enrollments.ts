import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  check: (courseId: string) => ['enrollments', 'check', courseId] as const,
  byCourse: (courseId: string) => ['enrollments', 'course', courseId] as const,
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

export function useCourseEnrollments(courseId: string) {
  const supabase = useSupabase();

  return useQuery({
    queryKey: enrollmentKeys.byCourse(courseId),
    queryFn: async () => {
      const { data } = await supabase
        .from('enrollments')
        .select('*, profile:profiles!enrollments_user_id_fkey(name, avatar_url)')
        .eq('course_id', courseId)
        .order('enrolled_at', { ascending: false })
        .throwOnError();
      return data;
    },
  });
}

export type CourseEnrollment = NonNullable<
  ReturnType<typeof useCourseEnrollments>['data']
>[number];

/**
 * Returns the most recently enrolled course with progress info
 * for the "Continue Learning" hero card.
 */
export function useContinueLearning() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: ['continue-learning'],
    queryFn: async () => {
      // Get the most recent enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select(
          '*, course:courses(*, instructor:profiles!courses_instructor_id_fkey(name), chapters(*, lessons(*)))'
        )
        .order('enrolled_at', { ascending: false })
        .limit(1)
        .single()
        .throwOnError();

      if (!enrollment?.course) return null;

      const course = enrollment.course;

      // Get all lessons sorted
      const allLessons = [...course.chapters]
        .sort((a, b) => a.sort_order - b.sort_order)
        .flatMap((ch) =>
          [...ch.lessons].sort((a, b) => a.sort_order - b.sort_order)
        );

      if (allLessons.length === 0) return null;

      // Get completed lessons for this course
      const lessonIds = allLessons.map((l) => l.id);
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .in('lesson_id', lessonIds)
        .eq('completed', true)
        .throwOnError();

      const completedIds = new Set(progress?.map((p) => p.lesson_id) ?? []);
      const completedCount = completedIds.size;
      const totalLessons = allLessons.length;
      const progressPercent =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      // Find the first uncompleted lesson (or fall back to first lesson)
      const nextLesson =
        allLessons.find((l) => !completedIds.has(l.id)) ?? allLessons[0];

      return {
        courseId: course.id,
        courseTitle: course.title,
        instructorName: course.instructor?.name ?? 'Unknown',
        imageUrl: course.image_url,
        completedCount,
        totalLessons,
        progressPercent,
        nextLessonId: nextLesson.id,
      };
    },
  });
}

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
