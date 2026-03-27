import { useSupabase } from '@/lib/supabase';
import { useUser } from '@clerk/expo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export function useProfile() {
  const supabase = useSupabase();
  const { user } = useUser();

  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', user?.id || '')
        .maybeSingle();

      console.log(data, error);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
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
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
    onError: (err) => {
      console.log(err);
    },
  });
}
