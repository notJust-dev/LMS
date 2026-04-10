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
        .eq('is_published', true)
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

export function useCreateCourse() {
  const supabase = useSupabase();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: {
      title: string;
      description: string;
      category: string;
      price: number;
      original_price?: number | null;
    }) => {
      const { data } = await supabase
        .from('courses')
        .insert({ ...course, instructor_id: userId! })
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.tutor(userId!) });
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}

export function useUpdateCourse(id: string) {
  const supabase = useSupabase();
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: {
      title?: string;
      description?: string | null;
      category?: string | null;
      price?: number;
      original_price?: number | null;
      is_published?: boolean;
      image_url?: string | null;
    }) => {
      const { data } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
        .throwOnError();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coursesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: coursesKeys.tutor(userId!) });
      queryClient.invalidateQueries({ queryKey: coursesKeys.all });
    },
  });
}

export function useUploadCourseImage() {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async ({
      courseId,
      file,
    }: {
      courseId: string;
      file: { uri: string; type: string };
    }) => {
      const ext = file.type.split('/')[1] ?? 'jpg';
      const path = `${courseId}.${ext}`;

      const formData = new FormData();
      formData.append('', {
        uri: file.uri,
        type: file.type,
        name: path,
      } as unknown as Blob);

      const { error } = await supabase.storage
        .from('course-images')
        .upload(path, formData, {
          upsert: true,
        });
      if (error) throw error;

      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(path);
      return data.publicUrl;
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
