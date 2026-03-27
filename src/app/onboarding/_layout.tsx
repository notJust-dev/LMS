import { Stack } from 'expo-router/stack';
import { OnboardingProvider } from '@/providers/onboarding-context';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </OnboardingProvider>
  );
}
