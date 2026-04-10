import { Stack } from 'expo-router/stack';

export default function CourseLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="lesson/[lesson_id]"
        options={{
          headerLargeTitle: false,
          headerTitle: 'Lesson',
          headerShadowVisible: false,
          // headerStyle: { backgroundColor: 'black' },
          // headerTintColor: 'white',
        }}
      />
    </Stack>
  );
}
