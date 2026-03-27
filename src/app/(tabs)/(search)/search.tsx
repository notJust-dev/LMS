import { CategoryChips } from '@/components/CategoryChips';
import { CourseItem } from '@/components/CourseItem';
import { useCourses } from '@/services/courses';
import { Text, View } from '@/tw';
import { Stack } from 'expo-router/stack';
import { useState } from 'react';
import { FlatList } from 'react-native';

export default function SearchScreen() {
  const { data: courses = [] } = useCourses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Courses');

  const filtered = courses.filter((c) => {
    const matchesSearch =
      !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === 'All Courses' ||
      c.category?.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <View className="flex-1">
      <Stack.SearchBar
        placement="automatic"
        placeholder="Search for any course..."
        onChangeText={(e) => setSearch(e.nativeEvent.text)}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <>
            <CategoryChips selected={category} onSelect={setCategory} />
            <View className="px-6 mb-4">
              <Text className="text-[14px] text-text-muted font-medium">
                Found {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                {search ? ` for "${search}"` : ''}
              </Text>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => (
          <View className="mx-6 my-6 border-t border-gray-100" />
        )}
        renderItem={({ item }) => (
          <View className="px-6">
            <CourseItem course={item} />
          </View>
        )}
      />
    </View>
  );
}
