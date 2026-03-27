import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/lib/supabase';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export function useProfile() {
  const supabase = useSupabase();

  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProfile() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: {
      id: string;
      name: string | null;
      onboarding_goal: string | null;
      interests: string[];
      onboarding_completed: boolean;
    }) => {
      const { error } = await supabase.from('profiles').insert(profile);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}
