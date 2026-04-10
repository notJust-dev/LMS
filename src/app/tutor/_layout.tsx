import { Stack } from 'expo-router/stack';

export default function TutorLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'My Courses' }} />
      <Stack.Screen name="create" options={{ title: 'New Course' }} />
      <Stack.Screen
        name="[course_id]/index"
        options={{ title: 'Edit Course' }}
      />
      <Stack.Screen
        name="[course_id]/lessons"
        options={{ title: 'Manage Lessons' }}
      />
      <Stack.Screen
        name="[course_id]/lesson/[lesson_id]"
        options={{ title: 'Edit Lesson' }}
      />
    </Stack>
  );
}
