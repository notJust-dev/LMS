import { Stack } from 'expo-router/stack';

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerBlurEffect: 'none',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="search" options={{ title: 'Search' }} />
    </Stack>
  );
}
