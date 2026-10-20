import { Stack } from 'expo-router';

import { OnboardingDraftProvider } from '@/features/onboarding/draft';

export default function OnboardingLayout() {
  return (
    <OnboardingDraftProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="reveal" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </OnboardingDraftProvider>
  );
}
