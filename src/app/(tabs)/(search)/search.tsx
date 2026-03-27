import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { View, Text, Pressable } from '@/tw';
import { useSupabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

export default function SearchScreen() {
  const supabase = useSupabase();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    supabase
      .from('courses')
      .select()
      .then(({ data }) => {
        if (data) setCourses(data);
      });
  }, [supabase]);

  async function deleteCourse(id: string) {
    await supabase.from('courses').delete().eq('id', id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <View className="flex-1">
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-base flex-1">{item.title}</Text>
            <Pressable onPress={() => deleteCourse(item.id)} className="pl-4 py-1">
              <Text className="text-red-500 text-lg">✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
