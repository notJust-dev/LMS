import { useProfile } from '@/services/profiles';
import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import "../global.css";

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

function RootStack() {
  const { isSignedIn, isLoaded } = useAuth({ treatPendingAsSignedOut: false })
  const { user } = useUser();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const isOnboarded = !!profile;
  const isTutor = user?.publicMetadata?.role === 'tutor';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn && isLoaded}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
      </Stack.Protected>

      <Stack.Protected guard={!!isSignedIn && isLoaded && !profileLoading}>
        <Stack.Protected guard={!isOnboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={isOnboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="course/[course_id]"
            options={{ headerShown: false }}
          />

          <Stack.Protected guard={isTutor}>
            <Stack.Screen name="tutor" />
          </Stack.Protected>
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <RootStack />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
